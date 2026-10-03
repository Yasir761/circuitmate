from datetime import datetime, timezone
from typing import Any

from pymongo import MongoClient

from app.config import MONGODB_DATABASE, MONGODB_URI


client = MongoClient(MONGODB_URI)

db = client[MONGODB_DATABASE]

documents_collection = db["documents"]
messages_collection = db["messages"]
exam_attempts_collection = db["exam_attempts"]


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def save_document(
    session_id: str,
    filename: str,
    pages: int,
    chunks: int,
    subject: str,
) -> str:
    result = documents_collection.insert_one(
        {
            "session_id": session_id,
            "filename": filename,
            "pages": pages,
            "chunks": chunks,
            "subject": subject,
            "uploaded_at": utc_now(),
        }
    )

    return str(result.inserted_id)


def save_message(
    session_id: str,
    role: str,
    content: str,
    mode: str,
    sources: list[dict[str, Any]] | None = None,
) -> None:
    messages_collection.insert_one(
        {
            "session_id": session_id,
            "role": role,
            "content": content,
            "mode": mode,
            "sources": sources or [],
            "created_at": utc_now(),
        }
    )


def save_exam_attempt(
    session_id: str,
    question: str,
    answer: str,
    score: int,
    max_score: int,
    sources: list[dict[str, Any]] | None = None,
) -> None:
    exam_attempts_collection.insert_one(
        {
            "session_id": session_id,
            "question": question,
            "answer": answer,
            "score": score,
            "max_score": max_score,
            "sources": sources or [],
            "created_at": utc_now(),
        }
    )


def get_session_document(session_id: str) -> dict[str, Any] | None:
    document = documents_collection.find_one(
        {"session_id": session_id},
        sort=[("uploaded_at", -1)],
    )

    if not document:
        return None

    return {
        "filename": document["filename"],
        "pages": document["pages"],
        "chunks": document["chunks"],
        "subject": document.get("subject", "ECE"),
    }


def get_session_messages(session_id: str) -> list[dict[str, Any]]:
    messages = messages_collection.find(
        {"session_id": session_id}
    ).sort("created_at", 1)

    return [
        {
            "id": str(message["_id"]),
            "role": message["role"],
            "content": message["content"],
            "mode": message["mode"],
            "sources": message.get("sources", []),
        }
        for message in messages
    ]