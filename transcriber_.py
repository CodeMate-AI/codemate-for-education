import whisper
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

model = whisper.load_model("large-v3")
transcription = model.transcribe(audio="./dsa.mp3", word_timestamps=True)
transcription["text"]


@app.post("/transcribe")
async def transcribe_(request: Request):
    data = await request.json()
    # DEFINING ARGS
    __args = {
        "verbose": True,
        "task": data["task"] if "task" in data else "transcribe",
        "language": data["lang"] if "lang" in data else "en",
        "best_of": 5,
        "beam_size": 5,
        "patience": None,
        "length_penalty": None,
        "suppress_tokens": '-1',
        "initial_prompt": None,
        "condition_on_previous_text": True,
        "fp16": True,
        "compress_ration_threshold": 2.4,
        "logprob_threshold": 0.6,
        "word_timestamps": True,
        "prepend_punctuations": "\"\'“¿([{-",
        "append_punctuations": "\"\'.。,，!！?？:：”)]}、"
    }


    transcription__ = model.transcribe(audio=f"./audios/{data['id']}", **__args)





@app.post("/upload")
async def upload(request: Request):
    pass