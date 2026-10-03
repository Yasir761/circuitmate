from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.routes.exam import router as exam_router

app = FastAPI(
    title="CircuitMate API",
    description="AI study companion for ECE students",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://circuitmate-theta.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(exam_router)