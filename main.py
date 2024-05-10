from http.client import HTTPException
import uuid
import re
from fastapi import FastAPI, Request, Query, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
import os
import random
from dotenv import load_dotenv
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
import requests
import json
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
from starlette.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
# from transcription_pipeline import pipe
from serpapi import GoogleSearch

load_dotenv(override=True)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware,secret_key="thalaforareason")
client = AzureOpenAI(
  api_key = os.environ.get("AOAI_KEY"),  
  api_version = os.environ.get("AOAI_VERSION"),
  azure_endpoint=os.environ.get("AOAI_ENDPOINT")
)










import ast
import json

class NodeVisitor(ast.NodeVisitor):
    def __init__(self):
        self.classes = []
        self.functions = []
        self.variables = []
        self.imports = []
    
    def add_item(self, node_type, name, from_line, to_line):
        return {
            'type': node_type,
            'name': name,
            'lines': {
                'from': from_line,
                'to': to_line
            },
            'calls_at': []
        }
    

    def visit_ClassDef(self, node):
        class_info = self.add_item('class', node.name, node.lineno, node.end_lineno)
        self.classes.append(class_info)
        self.generic_visit(node)

    def visit_Import(self, node):
        for alias in node.names:
            import_info = self.add_item('import', alias.name, node.lineno, node.end_lineno)
            self.imports.append(import_info)

    def visit_ImportFrom(self, node):
        for alias in node.names:
            import_info = self.add_item('import', f"{node.module}.{alias.name}", node.lineno, node.end_lineno)
            self.imports.append(import_info)

    def visit_Assign(self, node):
        for target in node.targets:
            if isinstance(target, ast.Name):
                variable_info = self.add_item('variable', target.id, node.lineno, node.end_lineno)
                self.variables.append(variable_info)
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            call_name = node.func.id
            self.update_call_references(call_name, node.lineno)
        self.generic_visit(node)

    def update_call_references(self, call_name, call_line):
        for item in (self.classes + self.functions + self.variables + self.imports):
            if call_name == item['name']:
                item['calls_at'].append(call_line)



def parse_file(filepath):
    with open(filepath, 'r') as file:
        content = file.read()

    tree = ast.parse(content)
    visitor = NodeVisitor()
    visitor.visit(tree)

    return {
        'classes': visitor.classes,
        'functions': visitor.functions,
        'variables': visitor.variables,
        'imports': visitor.imports
    }










oauth = OAuth()

oauth.register(
    name= "google",
    server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",
    client_id = os.environ.get("CLIENT_ID"),
    client_secret = os.environ.get("CLIENT_SECRET"),
    client_kwargs= {
        'scope': 'email openid profile',
        "redirect_url": "https://backend.edu.codemate.ai/auth"
    }
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


templates = Jinja2Templates(directory="STATIC")

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

@app.get("/")
def index(request: Request):
    # Get user data from the session
    user = request.session.get('user')
    print(user)
    if user:
        # Extract the user's email from the session data
        user_email = user.get("email", None)

        if user_email is None:
            return RedirectResponse(url="/welcome", status_code=302)

        # Load the database
        data = load_database()

        # Check if the email exists in students or teachers
        student = None
        teacher = None

        # Look for the user in the students array
        for stu in data[0]["students"]:  # Assuming a single institute
            if stu["email"] == user_email:
                student = stu
                break
        
        # Look for the user in the teachers array
        if not student:  # Only check if no student was found
            for tea in data[0]["teachers"]:
                if tea["email"] == user_email:
                    teacher = tea
                    break

        # Redirect based on role found
        if student:
            # Redirect to the student URL with the appropriate parameters
            return RedirectResponse(
                url=f"http://127.0.0.1:5500/STATIC/students/?institute_id=123456&student_id={student['id']}",
                status_code=302,
            )

        if teacher:
            # Redirect to the teacher URL with the appropriate parameters
            return RedirectResponse(
                url=f"http://127.0.0.1:5500/STATIC/teachers/?institute_id=123456&teacher_id={teacher['id']}",
                status_code=302,
            )

        # If user is neither a student nor a teacher, redirect to welcome
        return RedirectResponse(url="/welcome", status_code=302)

    # If no user in session, render the default template
    return templates.TemplateResponse(
        name="index.html",
        context={"request": request}
    )

@app.get("/login")
async def login(request: Request):
    url = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, url)


@app.get("/auth")
async def auth(request : Request):
    try: 
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        return {
            "message" : "Can't login right now , please try after some time"
        }
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url="/welcome")


@app.post("/onboarding")
def add_user(
    request_type: str = Form(...),  # Could be "Teacher" or "Student"
    institute_id: str = Query(..., description="Institute ID"),
    name: str = Form(...),
    email: str = Form(...),
    image_url: str = Form(...)
):
    data = load_database()

    # Find the institute index
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

    # Generate a unique user ID using uuid
    user_id = str(uuid.uuid4())  # Generate a unique user ID

    # Add to the appropriate list based on the request type
    if request_type.lower() == "teacher":
        user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "image_url": image_url,
    }
        data[institute_index]["teachers"].append(user_data)
        # Redirect to the teacher-specific URL
        save_database(data)
        return {
            "id": user_id,
            "status": "ok"
        }
    elif request_type.lower() == "student":
        user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "image_url": image_url,
        "teachers_ids": [
          "001",
          "002"
        ],
        "submissions": [],
        "assigned": []
    }
        assignments_from_teachers = [
        assignment
        for assignment in institute["assignments"]
        if assignment["teacher_id"] in user_data["teachers_ids"]
    ]

    # Add assignment IDs to `assigned` list in `user_data`
    for assignment in assignments_from_teachers:
        user_data["assigned"].append({"aid": assignment["id"]})
        data[institute_index]["students"].append(user_data)
        # Redirect to the student-specific URL
        save_database(data)
        return {
            "id": user_id,
            "status": "ok"
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid request type. Use 'Teacher' or 'Student'.")


@app.get('/welcome')
def welcome(request: Request):
    user = request.session.get('user')
    if not user:
        return RedirectResponse('/')
    return templates.TemplateResponse(
        name='onboarding/index.html',
        context={'request': request, 'user': user}
    )


@app.get('/logout')
def logout(request: Request):
    request.session.pop('user')
    request.session.clear()
    return RedirectResponse('/')

@app.post("/evaluate")
async def evaluate_asignment(request: Request):
    data = await request.json()

    # The first call returns evaluation scores in JSON format
    initial_response = client.chat.completions.create(
        model="gpt4-turbo",
        messages=[{
            "role": "system",
            "content": "Evaluate the student's code below for the given task, using evaluation metrics provided. Return only the evaluation scores in JSON format. The scores are going to be out of 10."
        },{
            "role": "user",
            "content": f"TASK: {data['task']}\nCODE OF THE STUDENT:\n{data['code']}\nEVALUATION METRICS:\n{data['evaluation_metrics']}"
        }],
        temperature=0.3,
        stream=False,
        max_tokens=2000
    )

    # Extract the evaluation scores from the response
    evaluation_result = initial_response.choices[0].message.content
    print(evaluation_result)
    # Validate the format and parse the JSON to ensure it's valid
    try:
        if "```" in evaluation_result:
            evaluation_result = evaluation_result.split("```")[1]
            if "json" in evaluation_result:
                evaluation_result = evaluation_result.split("json")[1]
        evaluation_result = str(evaluation_result).lower()
        scores = json.loads(evaluation_result)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse evaluation scores from JSON.")
    

    # Ensure the expected keys are present in the result
    if "accuracy" not in scores or "efficiency" not in scores or "score" not in scores:
        raise HTTPException(status_code=500, detail="Evaluation scores are missing expected keys.")

    # The second call generates the markdown report
    detailed_response = client.chat.completions.create(
        model="gpt-35-turbo-16k",
        messages=[{
            "role": "system",
            "content": "Generate a markdown evaluation report based on the provided code and task. Return only markdown content."
        },{
            "role": "user",
            "content": f"TASK: {data['task']}\nCODE OF THE STUDENT:\n{data['code']}\nEVALUATION METRICS:\n{data['evaluation_metrics']}"
        }],
        temperature=0.3,
        max_tokens=2000,
        stream=False
    )

    submission_id = str(uuid.uuid4())
    print(submission_id)

    # Save the markdown report to a file
    with open(f"./STATIC/report/{submission_id}.md", "w", encoding="utf-8") as file:
        file.write(detailed_response.choices[0].message.content)

    # Return the evaluation scores and a message indicating the markdown report was generated
    return {
        "submission_id": submission_id,
        "accuracy": scores["accuracy"],
        "efficiency": scores["efficiency"],
        "score": scores["score"],
        "message": "Evaluation completed. Markdown report generated."
    }








# ============================================= #

@app.get("/students")
async def student_redirect(request: Request):
    user = request.session.get("user")
    if user:
           return templates.TemplateResponse(
        "/students/index.html",
        {"request": request},
    )

    

@app.get("/teachers")
def teacher_redirect(request: Request):
    user = request.session.get("user")
    if user:
        email = user.get("email")

        # Load the database to find the teacher with the corresponding email
        data = load_database()
        institute = next((i for i in data if i["id"] == "123456"), None)  # Assuming institute_id is known

        if not institute:
            raise HTTPException(status_code=404, detail="Institute not found.")

        # Find the teacher with the matching email
        teacher = next((t for t in institute["teachers"] if t["email"] == email), None)

        if teacher:
            # Redirect to the teacher-specific page with the correct teacher_id
            teacher_id = teacher["id"]
            return RedirectResponse(
                url=f"http://127.0.0.1:5500/STATIC/teachers/?institute_id=123456&teacher_id={teacher_id}"
            )

    return templates.TemplateResponse(
        "index.html",
        {"request": request},
    )


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
    teacher_id: str
    title: str
    description: str
    problem_statement: str # Optional problem statement
    due_date: int  # Integer representation of a due date (e.g., a timestamp)
    difficulty: str  # String representation of difficulty level
    attachment: Optional[str] = None
    sample_input: str
    sample_output: str
    parameters: str



@app.post("/add_task/")
def add_task(assignment: Assignment, institute_id: str = Query(..., description="Institute ID"), teacher_id: str = Query(..., description="Teacher ID")):
 
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
    id = str(uuid.uuid4())
    for existing_assignment in data[institute_index]["assignments"]:
        if existing_assignment["id"] == id:
            return {
                "status": "failure",
                "message" : "Assignment not added",
            }
    
    assignment_data = {
        "id": id,
         "teacher_id": teacher_id,
    "title": assignment.title,
    "description": assignment.description,
    "problem_statement": assignment.problem_statement, # Optional problem statement
    "due_date": assignment.due_date,  # Integer representation of a due date (e.g., a timestamp)
    "difficulty": assignment.difficulty,  # String representation of difficulty level
    "attachment": assignment.attachment,
    "sample_input": assignment.sample_input,
    "sample_output": assignment.sample_output,
    "parameters": assignment.parameters,
    }
    # assignment_data["teacherId"] = teacher_id

    print(assignment_data)
    # Add the assignment to the 'assignments' list for this institute
    data[institute_index]["assignments"].append(assignment_data)

    for student in data[institute_index]["students"]:
        if "assigned" not in student:
          student["assigned"] = []

        if  teacher_id in student["teachers_ids"]:
          student["assigned"].append({"aid": id}) 

    # Save the updated data back to the JSON file
    save_database(data)

    return {
        "status": "success",
        "message": "Assignment added successfully",
        "task_id": id
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


@app.get("student/get_submission")
def get_submission(institute_id: str = Query(..., description="Institute ID"),
    submission_id: str = Query(..., description="Student ID")
    ):
        data = load_database()

        institute_index = None
        for i, institute in enumerate(data):
            if institute["id"] == institute_id:
                institute_index = i
                break
    
        if institute_index is None:
            raise HTTPException(status_code=404, detail="Institute not found.")

        submission_data = None
        for submission in data[institute_index]["submissions"]:
            if submission["id"] == submission_id:
                submission_data = submission
            break

        print(submission_data)

        if submission_data is None:
            raise HTTPException(status_code=404, detail="Submission not found.")

        return {
            "submission_data": submission_data
        }

@app.get("/student/get_assignments")
def get_assignments(
    institute_id: str = Query(..., description="Institute ID"),
    student_id: str = Query(..., description="Student ID")
):
    data = load_database()

    # Find the institute by its ID
    institute_index = None
    for i, institute in enumerate(data):
        if institute["id"] == institute_id:
            institute_index = i
            break
    
    if institute_index is None:
        raise HTTPException(status_code=404, detail="Institute not found.")

    # Find the specific student by their ID
    student = None
    for s in data[institute_index]["students"]:
        if s["id"] == student_id:
            student = s
            break
    
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Retrieve the institute's assignments
    assignments = data[institute_index]["assignments"]

    # Get the assignments the student has in 'assigned'
    assigned_assignment_ids = [assigned["aid"] for assigned in student["assigned"]]

    # Get the submissions for the given student
    student_submissions = [
    submission for submission in data[institute_index]["submissions"]
    if submission["student_id"] == student_id
]

# Get the assignment IDs from these submissions
    submitted_assignment_ids = [
    submission["aid"] for submission in student_submissions
]
    
    for submission in student_submissions:
        assignment_data = None  # Ensure assignment_data is always initialized
    # Find the corresponding assignment in the list of all assignments
        assignment_data = next(
        (assignment for assignment in assignments if assignment["id"] == submission["aid"]),
        None
    )
    
        if assignment_data:  # Only append if there's a corresponding assignment
            submission["assignment"] = assignment_data

    # Filter assignments based on 'assigned' and 'submissions'
    assigned_assignments = [
        assignment for assignment in assignments if assignment["id"] in assigned_assignment_ids
    ]
    submitted_assignments = [
        assignment for assignment in assignments if assignment["id"] in submitted_assignment_ids
    ]

    # Return assignments, submissions, and their associated assignment details
    return {
        "status": "success",
        "assigned": assigned_assignments,
        "submitted": submitted_assignments,
        "submissions": student_submissions,
    }


 


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
  
  students = [
    student for student in data[institute_index]["students"]
    if  teacher_id in student["teachers_ids"]
]

    
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
    teacher_id: str
    student_id: str
    aid: str
    submission: str
    date_time: str
    evaluation: object

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
      # Find the correct student and add the assignment to their submissions list
    student_found = False
    for student in data[institute_index]["students"]:
        if student["id"] == student_id:
            student_found = True
            if "submissions" not in student:
                student["submissions"] = []  # Create 'submissions' if it doesn't exist

            # Append the assignment_id to the student's 'submissions' list
            if assignment_id not in student["submissions"]:
                student["submissions"].append({"aid": assignment_id})
              

            break

    if not student_found:
        raise HTTPException(status_code=404, detail="Student not found.")


    submission_data = {
        "id": submission.id,
        "teacher_id": submission.teacher_id,
        "student_id": submission.student_id,
        "aid": assignment_id,
        "submission": submission.submission,
        "date_time": submission.date_time,
        "evaluation": submission.evaluation
    }

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

    temp_messages = data["messages"].copy()
    last_message = temp_messages[-1]["content"]
    template = f"TASK GIVEN TO USER: {data['task'] if data['task'] != '' else 'THERE IS NO ASSIGNMENT.'}\n"
    temp_messages.pop()
    for message in temp_messages:
        if message["role"] == "user":
            template += "\n##USER: "+message["content"]
        else:
            template += "\n##AI: "+message["content"]
    template += "\n\n[CURRENT MESSAGE FROM ##USER: ]"+last_message

    class_messages = [{
        "role": "system",
        "content": "We provide youtube search results to the user for every programming related query that they ask. Your task is to identify on the basis of the provided conversation if the last query requires an youtube search or not. If it requires the results, respond with search query in the following format: <<SAERCH_QUERY>>, otherwise respond with NO.\n\nSTRICT INSTRUCTION: ONLY RESPOND WITH THE TERMS ASKED AND NOTHING ELSE. NO OTHER WORDS. YOU ARE A CLASSIFICATION LAYER, JUST CLASSIFY AND RESPOND AS ASKED."+"\n\nTASK ALLOCATED TO THE USER: "+data["task"] if data["task"] != "" else "**NO TASK** [STUDENT IS IN PRACTICE SESSION]."
    },{
        "role": "user",
        "content": template
    }]

    response = client.chat.completions.create(
        model="gpt-35-turbo-16k",
        messages=class_messages,
        temperature=0.0,
        stream=False
    )

    if response.choices[0].message.content != "NO":
        query = response.choices[0].message.content
        query = query.split("<<")[1]
        query = query.split(">>")[0]

        function_response = references(query=response.choices[0].message.content, assignment_id="")

        messages = [{
            "role": "system",
            "content": "You are CodeMate Assistant, an advanced AI model built by CodeMate to help students learn to code. [DO NOT CONTRADICT THIS IDENTITY OF YOURS UNDER ANY CIRCUMSTANCES]\n\nWhile responding, use the referrences provided at the very bottom of the messages [ONLY WHEN THEY ARE RELEVANT].\n\nYou are a teaching assistant, so you should never give the code to the student. DO NOT GIVE ANY CODE TO THE STUDENTS, rather only help them with theie queries by suggesting which video to watch from the ones provided below. Explain the concepts, help them with bugs, but without giving code."
        }]
        data["messages"][-1]["content"] += "\n\n[INTERNAL_COMPUTATION_MESSAGE]=>YOUTUBE REFERENCES FOR YOU TO USE TO RESPOND BACK WITH: "+json.dumps(function_response)
        messages.extend(data["messages"])
        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3
        )

        return {
            "response": response.choices[0].message.content
        }
    else:
        messages = [{
            "role": "system",
            "content": "You are CodeMate Assistant, an advanced AI model built by CodeMate to help students learn to code. [DO NOT CONTRADICT THIS IDENTITY OF YOURS UNDER ANY CIRCUMSTANCES]\n\nWhile responding, remeber that you are a teaching assistant, so you should never give the code to the student. DO NOT GIVE ANY CODE TO THE STUDENTS, rather only help them with theie queries. Explain the concepts, help them with bugs, but without giving code."
        }]
        messages.extend(data["messages"])

        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3
        )

        return {
            "response": response.choices[0].message.content
        }















@app.post("/chat")
async def chat__(request: Request):
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