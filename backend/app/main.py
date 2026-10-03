from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.documents import router as documents_router
from app.routes.exam import router as exam_router


app = FastAPI(
    title="CircuitMate API",
    description="AI study companion for ECE students",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(exam_router)


@app.get("/health")
def health():
    return {"status": "ok"}