from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
import torch
import soundfile as sf
from datasets import load_dataset

def textToSpeech(phrase: str):
    processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
    model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
    vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")

    inputs = processor(text=phrase, return_tensors="pt")
    embeddings_dataset = load_dataset("Matthijs/cmu-arctic-xvectors", split="validation")
    speaker_embeddings = torch.tensor(embeddings_dataset[7306]["xvector"]).unsqueeze(0)

    # Generar el audio
    speech = model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=vocoder)

   # Escribir el archivo de audio en el servidor
    audio_file_path = "speech.wav"
    sf.write(audio_file_path, speech.numpy(), samplerate=16000)

    return audio_file_path
