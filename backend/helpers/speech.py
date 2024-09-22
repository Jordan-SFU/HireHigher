0
import os
from dotenv import load_dotenv
import uuid
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
import json

load_dotenv()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_KEY")
client = ElevenLabs(
    api_key=ELEVENLABS_API_KEY,
)


def text_to_speech_file(text: str, filename: str):
    # Calling the text_to_speech conversion API with detailed parameters
    response = client.text_to_speech.convert(
        voice_id="9BWtsMINqrJLrRacOk9x", # Adam pre-made voice
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_turbo_v2_5", # use the turbo model for low latency
        voice_settings=VoiceSettings(
            stability=1.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
        ),
    )
    save_file_path = f"{filename}.mp3"

    # Writing the audio to a file
    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)

    print(f"{save_file_path}: A new audio file was saved successfully!")

    # Return the path of the saved audio file
    return save_file_path


def generateQuestionsAudio(list):
    data = json.loads(list)
    i = 1
    for line in data.values():
        print(line)
        text_to_speech_file(line, f"questions/Q{i}")
        i += 1