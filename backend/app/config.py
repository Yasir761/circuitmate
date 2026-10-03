import os
from pathlib import Path

from dotenv import load_dotenv


# backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "circuitmate")


if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured")