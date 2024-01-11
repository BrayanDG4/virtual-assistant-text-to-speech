import base64
from typing import Union

from fastapi import FastAPI, Request, Response

from textToSpeech import textToSpeech
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/voice")
async def voice(request: Request):
    request_data = await request.json()  

    phrase = request_data.get("phrase")  

    audio_file = textToSpeech(phrase)

    with open(audio_file, "rb") as file:
        audio_data = file.read()

    response = Response(content=audio_data, media_type="audio/wav")
    response.headers["Content-Disposition"] = "attachment; filename=speech.wav"
    
    return response
