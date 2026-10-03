from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.document_store import get_chunks
from app.services.retrieval import retrieve_chunks
from app.services.gemma import ask_gemma

router = APIRouter(prefix="/api/exam", tags=["exam"])


class ExamStartRequest(BaseModel):
    subject: str = "Other ECE"
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    marks: Literal[2, 5, 10] = 5
    question_type: Literal[
        "theory",
        "numerical",
        "conceptual",
        "mixed",
    ] = "theory"

    # Kept for backwards compatibility with the previous frontend.
    topic: str | None = None


class ExamAnswerRequest(BaseModel):
    question: str
    answer: str
    subject: str = "Other ECE"
    marks: int = 5


def _get_exam_sources(query: str):
    chunks = get_chunks()

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Please upload your ECE study material first.",
        )

    results = retrieve_chunks(
        query,
        chunks,
        top_k=4,
    )

    # If the exact exam query doesn't retrieve anything,
    # use representative sections from the uploaded material.
    if not results:
        step = max(1, len(chunks) // 4)

        results = [
            {
                **chunks[index],
                "score": 0.0,
            }
            for index in range(
                0,
                len(chunks),
                step,
            )
        ][:4]

    return results


def _format_sources(results):
    return [
        {
            "page": item["page"],
            "score": item.get("score", 0.0),
        }
        for item in results
    ]


@router.post("/start")
def start_exam(request: ExamStartRequest):
    topic = request.topic or request.subject

    retrieval_query = (
        f"{topic}. "
        f"{request.question_type} ECE exam question. "
        f"{request.difficulty} difficulty. "
        f"{request.marks} mark question."
    )

    results = _get_exam_sources(retrieval_query)

    context = "\n\n".join(
        f"[Page {item['page']}]\n{item['text']}"
        for item in results
    )

    prompt = f"""
You are CircuitMate, an AI exam simulator for Electronics and
Communication Engineering students.

Generate exactly ONE exam question using ONLY the study material below.

Subject:
{request.subject}

Difficulty:
{request.difficulty}

Marks:
{request.marks}

Question type:
{request.question_type}

Topic:
{topic}

Rules:
- The question must be answerable from the provided study material.
- Do not introduce formulas, concepts, terminology, or facts that are
  absent from the material.
- Match the requested difficulty.
- Make the question appropriate for an ECE university exam.
- For a numerical question, use values that allow the student to solve
  the problem using formulas present in the material.
- Return ONLY the question.
- Do not include the answer.
- Do not include sources.

Study material:
{context}
"""

    question = ask_gemma(prompt).strip()

    if not question:
        raise HTTPException(
            status_code=500,
            detail="Gemma did not generate an exam question.",
        )

    return {
        "question": question,
        "sources": _format_sources(results),
        "subject": request.subject,
        "difficulty": request.difficulty,
        "marks": request.marks,
        "question_type": request.question_type,
    }


@router.post("/answer")
def evaluate_exam_answer(request: ExamAnswerRequest):
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question is required.",
        )

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer is required.",
        )

    results = _get_exam_sources(
        request.question
    )

    context = "\n\n".join(
        f"[Page {item['page']}]\n{item['text']}"
        for item in results
    )

    prompt = f"""
You are CircuitMate, an ECE exam evaluator.

Evaluate the student's answer using ONLY the study material below.

Subject:
{request.subject}

Marks:
{request.marks}

QUESTION:
{request.question}

STUDENT ANSWER:
{request.answer}

STUDY MATERIAL:
{context}

Evaluate fairly.

Return exactly this structure:

Score: X/{request.marks}

What you got right:
- point
- point

What could be improved:
- point
- point

Model answer:
A concise exam-ready answer based only on the study material.

Sources:
- Page X
- Page Y

Rules:
- Do not invent facts outside the study material.
- Do not penalize wording differences when the underlying technical
  meaning is correct.
- For numerical answers, check the student's calculation carefully.
- If the material is insufficient to evaluate part of the answer,
  explicitly say so.
"""

    evaluation = ask_gemma(prompt).strip()

    return {
        "evaluation": evaluation,
        "sources": _format_sources(results),
    }