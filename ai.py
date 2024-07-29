from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key="thalaforareason")
client = AzureOpenAI(
    api_key=os.environ.get("AOAI_KEY"),
    api_version=os.environ.get("AOAI_VERSION"),
    azure_endpoint=os.environ.get("AOAI_ENDPOINT"),
)


class RequestBody(BaseModel):
    content: str


@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}


@app.get("/generate/")
def evaluate_code():
    try:
        initial_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    role: "user",
                    content: "Draft 1 / Interview Thought Tree\n1. Self-Introduction\n● Background\no Name\no Native Place\no Education Qualification\no Family Background\no Internship (if any)\no Work Experience\n● Key Skills\no Technical Skills\no Soft Skills\n● Career Goals\no Short- Term - Immediate\no Long – Term – 5 years Vision\n2. Understanding the Company\no Company Profile (Company Research, History, Mission and Vision, Products & Services, Owners, CEOs etc.)\n● Current News (Company)\no Recent Achievements\no Industry Position\n3. Job-Specific Preparation\n● Job Description\no Key Responsibilities\no Required Skills\n● Matching Skills\no Relevant Experience\no Examples of Past Work\n4. Common Interview Challenges\n● Behavioral Questions\no STAR Method (Situation, Task, Action, Result)\n● Technical Questions\no Problem-Solving Examples\no Relevant Projects\n5. Questions for the Interviewer\n● Role-Specific\no Day-to-Day Responsibilities\no Team Structure\n● Company Culture\no Work Environment\no Growth Opportunities\n6. Closing the Interview\n● Expressing Interest\no Why You’re a Good Fit\no Enthusiasm for the Role\n● Next Steps\no Follow-Up Timeline\no Thank You Note\n\nhey chatgpt become an interviewer and take my interview on the basis of the above sequence and points",
                }
            ],
            temperature=0.3,
            stream=False,
            max_tokens=1000000,
        )

        result = initial_response.choices[0].message.content
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
