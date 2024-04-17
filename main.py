from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests
import json
from transcription_pipeline import pipe

load_dotenv(override=True)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = AzureOpenAI(
  api_key = os.environ.get("AOAI_KEY"),  
  api_version = os.environ.get("AOAI_VERSION"),
  azure_endpoint=os.environ.get("AOAI_ENDPOINT")
)


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    messages = [
        {
            "role": "system",
            "content": "You are CodeMate by CodeMate for Education. You help individuals to learn programming languages. Your task is to explain the concepts to the user rather than providing the code. Don't ever provide the code to the user. You are allowed to provide sudo code to the users but never complete code. Help them in learning the language rather than just handing them over the code.\n\nRESPONSE FORMAT: STRICT MARKDOWN"
        },
        {
            "role": "user",
            "content": "THE TASK GIVEN TO THE USER RELATED TO WHICH HE/SHE WILL BE ASKING QUESTIONS POSSIBLY IS: "+data["task"]
        },
        {
            "role": "assistant",
            "content": "Understood! I will help the user accomplish the task and will not provide the complete code to them. However, as per the instructions, I will provide the user with sudo code whenever necessary."
        }
    ]
    messages.extend(data["messages"])
    if "enhanced_context" in data:
        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3,
            functions=[{
                "name": "references",
                "description": "Function to fetch resources from the internet when --resources flag is in the message.",
                "parameters":{
                    "type": "object",
                    "properties": {
                        "q": {
                            "type": "string",
                            "description": "the query for which we need to search the internet."
                        }
                    },
                    "required": ["q"]
                }
            }],
            function_call="auto"
        )
    else:
        response = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3
        )

    

    if response.choices[0].message.function_call != None and response.choices[0].message.content == None:
            # at this point we know there is only one function so no need to complicate things, we can directly call the function here itself...
        q = json.loads(response.choices[0].message.function_call.arguments)["q"]
        resp = requests.get("https://focus.os.deepnight.tech/search?q="+q).json()
        r_ = []
        i = 0
        for r in range(len(resp["serp"]["organic_search_results"])):
            if i <= 2:
                r_.append(resp["serp"]["organic_search_results"][r])
                i += 1
            else:
                break


        messages.append({
            "role": "function",
            "name": "references",
            "content": str(r_)
        })

        resp = client.chat.completions.create(
            model="gpt-35-turbo-16k",
            messages=messages,
            temperature=0.3,
            functions=[{
                "name": "references",
                "description": "This function is called to fetch results from the internet to find appropriate resources for the user's query. The function returns an array of top-3 links.",
                "parameters":{
                    "type": "object",
                    "properties": {
                        "q": {
                            "type": "string",
                            "description": "the query for which we need to search the internet."
                        }
                    },
                    "required": ["q"]
                }
            }],
            function_call="auto"
        )
        return {
            "results": r_,
            "response": resp.choices[0].message.content
        }
    else:
        return {
            "response": response.choices[0].message.content
        }