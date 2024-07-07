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


@app.post("/generate/")
def evaluate_code(data: RequestBody):
    try:
        initial_response = client.chat.completions.create(
            model="gpt4-turbo",
            messages=[{"role": "user", "content": data.content}],
            temperature=0.3,
            stream=False,
            max_tokens=2000,
        )

        result = initial_response.choices[0].message.content
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
