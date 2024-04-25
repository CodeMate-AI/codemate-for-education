from http.client import HTTPException
from fastapi import FastAPI, Request, Query, HTTPException
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
from uuid import uuid4
# from transcription_pipeline import pipe
from serpapi import GoogleSearch

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



def references(query, assignment_id=""):
    params = {
        "api_key": "dc04d437e8e83d594f3344b2928644d8a6dcce2164d26012fe0944ddc82ee2fa",
        "engine": "youtube",
        "search_query": query
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    return results["video_results"]










@app.post("/evaluate")
async def evaluate_asignment(request: Request, submission_id: str):
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

    with open(f"./evaluations/{submission_id}.md", "w", encoding="utf-8") as e:
        e.write(response.choices[0].message.content)









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
def get_task(task_id: str, institute_id: str):
    database = load_database()
    index = None
    for i, db in enumerate(database):
        if db["id"] == institute_id:
            index = i

    # student_index__ = None
    # for e, student in enumerate(database[i]["students"]):
    #     if student["id"] == student_id:
    #         student_index__ = e

    tasks = database[i]["assignments"]
    for t in tasks:
        if t["id"] == task_id:
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
    teacher_id: str
    title: str
    description: str
    problem_statement: str # Optional problem statement
    due_date: int  # Integer representation of a due date (e.g., a timestamp)
    difficulty: str  # String representation of difficulty level
    attachment: Optional[str] = None
    sample_input: str
    sample_output: str


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


@app.post("/add_task/")
def add_task(assignment: Assignment, institute_id: str = Query(..., description="Institute ID"), teacher_id: str = Query(..., description="Teacher ID")):
 
    data = load_database()
    print(institute_id)
    print(teacher_id)
    
    institute_index = None
    for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
    if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

    print(institute_index)
    # Check if the teacher with the provided 'teacher_id' exists
    teacher_exists = False
    for teacher in data[institute_index]["teachers"]:
        if teacher["id"] == teacher_id:
            teacher_exists = True
            break

    if not teacher_exists:
        return {
            "status": "failure",
            "message": "Teacher not found.",
        }

    for existing_assignment in data[institute_index]["assignments"]:
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
    
    assignment_data = assignment.model_dump()
    assignment_data["teacherId"] = teacher_id

    print(assignment_data)
    # Add the assignment to the 'assignments' list for this institute
    data[institute_index]["assignments"].append(assignment_data)

    for student in data[institute_index]["students"]:
        if "assigned" not in student:
          student["assigned"] = []
          student["assigned"].append(assignment.id)

    # Save the updated data back to the JSON file
    save_database(data)

    return {
        "status": "success",
        "message": "Assignment added successfully",
        "task_id": assignment.id
    }


def read_database():
    with open("database.json", "r") as f:
        return json.load(f)


@app.get("/share")
def get_assignment(institute_id: str = Query(..., description="Institute ID"), assignment_id: str = Query(..., description="Assignment ID")):
    # Load the database
  data = load_database()
  print(institute_id)
    
  institute_index = None
  for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
  if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

  assignments = data[institute_index]["assignments"]
    # Find the assignment by its ID
  for assignment in assignments:
        if assignment["id"] == assignment_id:
            return {"assignment": assignment}

    # If no assignment is found, return a 404 error
  raise HTTPException(status_code=404, detail="Assignment not found")


@app.get("/student/get_assignments")
def get_assignment(institute_id: str = Query(..., description="Institute ID")):
    # Load the database
  data = load_database()
  print(institute_id)
    
  institute_index = None
  for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
  if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

  assignments = data[institute_index]["assignments"]
    
  return {
        "status": "success",
        "assignments": assignments,
    }

    # If no assignment is found, return a 404 error
  raise HTTPException(status_code=404, detail="Assignment not found")


@app.get("/teacher/get_assignments")
def get_assignments_teacher(  institute_id: str = Query(..., description="Institute ID"),teacher_id: str = Query(..., description="Teacher ID")):
  data = load_database()
  print(institute_id)
    
  institute_index = None
  for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
        if institute_index is None:
            return {
                "status": "failure",
                "message": "Institute not found.",
            }
  assignment_data = []
  for assign__ in data[institute_index]["assignments"]:
    if "teacherId" in assign__:
        print(type(assign__))
    if assign__["teacher_id"] == teacher_id:
        assignment_data.append(assign__)
  
  submission_data = [
        submission
        for submission in data[institute_index]["submissions"]
            if submission["teacher_id"] == teacher_id and submission["aid"] == "001"
    ]
  
  students = data[institute_index]["students"]
  
    
  return {
        "status": "success",
        "assignments": assignment_data,
        "submissions": submission_data,
        "students": students
    }


# Endpoint to get all assignments for students
@app.get("/student/get_assignment")
def get_assignments_student(  institute_id: str, assignment_id: str):
    data = load_database()
    
    institute_index = None
    for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
    if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

    assignments = data[institute_index]["assignments"]
    # Find the assignment by its ID
    for assignment in assignments:
        if assignment["id"] == assignment_id:
            return {"assignment": assignment}

    # If no assignment is found, return a 404 error
    raise HTTPException(status_code=404, detail="Assignment not found")


# Endpoint for students to submit assignments

class Submissions(BaseModel):
    id: str
    teacherId: str
    student_id: str
    aid: str
    submission: str

@app.post("/student/submit")
async def submit_assignment(
    request: Request,
    submission: Submissions,
    institute_id: str = Query(..., description="Institute ID"),
    student_id: str = Query(..., description="Student ID"), 
    assignment_id: str = Query(..., description="Assignment ID")
):
    incoming_data = await request.json()
    data = load_database()

    institute_index = None
    for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
    if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

    # Find the student in the database
    for institute in data:
        for student in institute["students"]:
            if student["id"] == student_id:

                # If not completed yet, add assignment_id to completed assignments
                if "completed" not in student:
                    data[institute_index]["students"]["completed"] = []

                if assignment_id not in data[institute_index]["students"]["completed"]:
                    data[institute_index]["students"]["completed"].append(assignment_id)
                
    submission_data = submission.model_dump()

    data[institute_index]["submissions"].append(submission_data)
    save_database(data)
    return {"status": "success", "message": "Assignment submitted successfully."}

    # raise HTTPException(status_code=404, detail="Student or assignment not found.")



# Endpoint to get assignment information for teachers
@app.get("/teacher/get_assignment")
def get_assignment_teacher(
    assignment_id: str = Query(..., description="Assignment ID"), 
    teacher_id: str = Query(..., description="Teacher ID")
):
    data = load_database()

    # Find the specific assignment for the correct teacher
    for institute in data:
        for assignment in institute["assignments"]:
            if assignment["id"] == assignment_id and assignment["teacherId"] == teacher_id:
                return {"status": "success", "assignment": assignment}

    raise HTTPException(status_code=404, detail="Assignment not found for the given teacher.")


@app.get("/teacher/get_submissions")
def get_submissions(
    institute_id: str = Query(..., description="Institute ID"),
    teacher_id: str = Query(..., description="Teacher ID"), 
    assignment_id: str = Query(..., description="Assignment ID")
):
    data = load_database()

    # Find the institute in the database
    institute_index = None
    for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
    if institute_index is None:
        return {
            "status": "failure",
            "message": "Institute not found.",
        }

    # Check if the teacher exists in this institute
    teacher_exists = any(
        teacher for teacher in data[institute_index]["teachers"] if teacher["id"] == teacher_id
    )

    if not teacher_exists:
        return {
            "status": "failure",
            "message": "Teacher not found.",
        }

    # Find the submissions related to the specified assignment
    submissions = [
        submission
        for submission in data[institute_index]["submissions"]
        if submission["aid"] == assignment_id and submission["teacher_id"] == teacher_id
    ]

    assignment_data = [
        assignment
        for assignment in data[institute_index]["assignments"]
        if assignment["id"] == assignment_id
    ]

    print("SUBMISSIONS: ", submissions, "\n\n")
    print("ASSIGNMENTS: ", assignment_id, "\n\n")

    return {
        "status": "success",
        "submissions": submissions,
        "assignment_data": assignment_data
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




@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    # print(data)

    messages = [
        {"role": "system", "content": "You are CodeMate by CodeMate for Education. You help individuals to learn programming languages. Your task is to explain the concepts to the user rather than providing the code. Don't ever provide the code to the user. You are allowed to provide sudo code to the users but never complete code. Help them in learning the language rather than just handing them over the code.\n\nRESPONSE FORMAT: STRICT MARKDOWN"},
        {"role": "user", "content": "THE TASK GIVEN TO THE USER RELATED TO WHICH HE/SHE WILL BE ASKING QUESTIONS POSSIBLY IS: "+data["task"]},
        {"role": "assistant", "content": "Understood! I will help the user accomplish the task and will not provide any code to them. However, as per the instructions, I will provide the user with sudo code if it is very necessary."}
    ]

    tems = [
        {
            "role": "system",
            "content": "Based on the provided context, conver the last query of the user to a youtube search query. ONLY RETURN THE YOUTUBE SEARCH QUERY and nothing else."
        },
        {
            "role": "user",
            "content": "TASK TO COMPLETE: "+data["task"]
        }
    ]


    tems.extend(data["messages"])
    print(tems)

    

    response = client.chat.completions.create(
        model="gpt-35-turbo-16k",
        messages=tems,
    )

    function_response = references(query=response.choices[0].message.content, assignment_id="")
    print(function_response)

    data["messages"][-1]["content"] += "\n\n\nREFERENCE VIDEOS TO SHARE WITH THE STUDENT. ADD THE FOLLOWING LINKS IN YOUR RESPONSE.:\n"+json.dumps(function_response)
    messages.extend(data["messages"])
    print(messages)
    
    while True:
        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.7
        )

        print(response.choices[0].model_dump())

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

            function_response = references(query=json.loads(response.choices[0].message.function_call.arguments)["q"], assignment_id="")
            messages.append({
                "role": "function",
                "name": "references",
                "content": str(function_response)
            })