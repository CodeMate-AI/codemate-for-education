from http.client import HTTPException
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests
import json
from pydantic import BaseModel
from typing import Optional
# from transcription_pipeline import pipe

load_dotenv(override=True)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
client = AzureOpenAI(
  api_key = os.environ.get("AOAI_KEY"),  
  api_version = os.environ.get("AOAI_VERSION"),
  azure_endpoint=os.environ.get("AOAI_ENDPOINT")
)




database = {}
with open("./STATIC/database.json", "r", encoding="utf-8") as e:
    database = json.load(e)



def references(query):
    pass










@app.post("/evaluate")
async def evaluate_asignment(request: Request):
    data = await request.json()
    response = client.chat.completions.create(
        model="gpt4-turbo",
        messages=[{
            "role": "system",
            "content": "Evaluate the student's code below for the mentioned task. Strictly use only the evauation metrices mentioned below and none other.\nGenerate an in-depth report of the same. You must only return the evaluation report in Markdown and nothing else."
        },{
            "role": "user",
            "content": "TASK: "+data["task"]+"\n==========================================\n\nCODE OF THE STUDENT:\n"+data["code"]+"\n\n===============================================\n\nEVALUATION METRICS:\n"+data["evaluation_metrics"]
        }],
        temperature=0.3,
        stream=False,
        max_tokens=2000
    )









# ============================================= #

@app.post("/student")
async def student(request: Request):
    global database
    return database["students"]


@app.post("/teacher")
async def teacher(request: Request):
    global database
    return database



@app.get("/get_task")
def get_task(task_id: str):
    global database
    tasks = database["students"]["assignments"]["pending"]
    for t in tasks:
        if t["aid"] == task_id:
            return {
                "task": t["description"]
            }
    return {
        "task": None
    }


@app.get("/get_mode/pending")
def get_mode(task: str):
    global database
    tasks = database["students"]["assignments"]["pending"]
    for t in tasks:
        print(t)
        if t["aid"] == task:
            return t["language"]
        




# @app.post("/create_assignment")
# async def create_assignment(request: Request):
#     global database
#     data = await request.json()
#     database["students"]["assignments"]["pending"].append({
#         "title": data["title"],
#         "language": data["language"],
#         "description": data["description"],
#         "due_date": data["due_date"],
#         "difficulty": data["difficulty"]
#     })

database_path = "./STATIC/database.json"

class Assignment(BaseModel):
    id: str
    title: str
    description: str
    problem_statement: str # Optional problem statement
    due_date: int  # Integer representation of a due date (e.g., a timestamp)
    difficulty: str  # String representation of difficulty level
    attachment: Optional[str] = None


def load_database():
    if os.path.exists(database_path):
        with open(database_path, "r") as f:
            return json.load(f)
    else:
        # If the file doesn't exist, return a default structure
        return {"assignments": []}

# Helper function to save data to the JSON file
def save_database(data):
    with open(database_path, "w") as f:
        json.dump(data, f, indent=2)


@app.post("/add_task")
def add_task(assignment: Assignment):
    # Load the current data from the JSON file
    data = load_database()
    print(data[0])

    # Check if assignment with same 'aid' already exists
    # if isinstance(data["assignments"], list):
       for existing_assignment in data[0]["assignments"]:
        if existing_assignment["id"] == assignment.id:
            return {
                "status": "failure",
                "message" : "Assignment not added",
            }

    # Add the new assignment to the 'assignments' array
    # while iterating through the JSON object, check for the institute id.
    # when the institute ID matches the provided institute id... that is when we add the assignment in the array of the JSON Object.
    # We tag the asignment with the teacher's ID.
    # prior to tagging the teacher's ID in the assignment, make sure to check if the teacher with that ID exists.
    # if the teacher with that ID doesn't exists, return `error`.
    # else proceed
    data["assignments"].append(assignment.model_dump())

    # Save the updated data back to the JSON file
    save_database(data)

    return {
        "status": "success",
        "message": "Assignment added successfully",
        "task_id": assignment.id
    }




"""
ENDPOINTS REQUIRED:
1. Chat :: /chat
2. Get assignments -> Teachers :: /teacher/get_assignments -> returns all assignments ever created
3. Get assignments -> Students :: /student/get_assignments -> returns all assignments :: completed and pending
4. Submit assignment :: /student/submit -> returns true on successful submission
5. Get assignment information -> Students :: /student/get_assignment -> returns a json with assignment infomation
6. Get assignment information -> Teachers :: /teacher/get_assignment -> returns a json with assignment information
7. Delete assignment :: /teacher/delete_assignment -> returns true on successfully deleting the assignment
8. Upload text files -> NO PDFs :: /teacher/upload/text -> one file at a time + max size of the file should be 10mb. + returns true once the embeddings for it are saved.
"""

with open("./database.json", "r", encoding="utf-8") as e:
    database = json.load(e)

def references(assignment_id, query):
    global database




@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    # print(data)

    messages = [
        {"role": "system", "content": "You are CodeMate by CodeMate for Education. You help individuals to learn programming languages. Your task is to explain the concepts to the user rather than providing the code. Don't ever provide the code to the user. You are allowed to provide sudo code to the users but never complete code. Help them in learning the language rather than just handing them over the code.\n\nRESPONSE FORMAT: STRICT MARKDOWN"},
        {"role": "user", "content": "THE TASK GIVEN TO THE USER RELATED TO WHICH HE/SHE WILL BE ASKING QUESTIONS POSSIBLY IS: "+data["task"]},
        {"role": "assistant", "content": "Understood! I will help the user accomplish the task and will not provide the complete code to them. However, as per the instructions, I will provide the user with sudo code whenever necessary."}
    ]

    messages.extend(data["messages"])
    print(messages)
    
    while True:
        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3,
            functions=[{
                "name": "references",
                "description": "This function is to be called for references related to the query of the user only and only if the last message of the user contains the --resources FLAG.",
                "parameters":{
                    "type": "object",
                    "properties": {
                        "q": {
                            "type": "string",
                            "description": "topic for which we need to fetch references."
                        }
                    },
                    "required": ["q"]
                }
            }],
            function_call="auto"
        )

        if response.choices[0].message.content != None:
            return {
                "response": response.choices[0].message.content
            }
        else:
            messages.append({
                "role": "assistant",
                "function_call": {
                    "name": "references",
                    "arguments": response.choices[0].message.function_call.arguments
                }
            })

            function_response = references(query="")
            messages.append({
                "role": "function",
                "name": "references",
                "content": str(function_response)
            })