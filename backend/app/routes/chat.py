from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.document_store import get_chunks
from app.services.gemma import ask_gemma
from app.services.mongodb import (
    get_session_document,
    get_session_messages,
    save_message,
)
from app.services.retrieval import retrieve_chunks


router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
)


class ChatRequest(BaseModel):
    message: str
    mode: Literal["chat", "explain", "solve"] = "chat"
    subject: str | None = None
    session_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.get("/debug")
def debug_chat():
    chunks = get_chunks()

    results = retrieve_chunks(
        "maximum power transfer theorem",
        chunks,
    )

    return {
        "chunk_count": len(chunks),
        "results": results,
    }


@router.get("/history/{session_id}")
def get_history(session_id: str):
    return {
        "document": get_session_document(session_id),
        "messages": get_session_messages(session_id),
    }


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    chunks = get_chunks()

    # Use the student's actual question for retrieval.
    results = retrieve_chunks(
        request.message,
        chunks,
    )

    # ---------------------------------------------------------
    # No relevant study material found
    # ---------------------------------------------------------

    if not results:
        if chunks:
            return ChatResponse(
                answer=(
                    "I couldn't find enough relevant information in your "
                    "uploaded study material to answer this question."
                ),
                sources=[],
            )

        # No document uploaded yet.
        if request.mode == "solve":
            return ChatResponse(
                answer=(
                    "Please upload your ECE study material before using "
                    "Solve Problem."
                ),
                sources=[],
            )

        try:
            answer = ask_gemma(request.message)

        except Exception as exc:
            print(f"Gemma error: {exc}")

            return ChatResponse(
                answer=(
                    "I couldn't generate an answer right now. "
                    "Please try again."
                ),
                sources=[],
            )

        if request.session_id:
            save_message(
                session_id=request.session_id,
                role="user",
                content=request.message,
                mode=request.mode,
                sources=[],
            )

            save_message(
                session_id=request.session_id,
                role="assistant",
                content=answer,
                mode=request.mode,
                sources=[],
            )

        return ChatResponse(
            answer=answer,
            sources=[],
        )

    # ---------------------------------------------------------
    # Build grounded context
    # ---------------------------------------------------------

    context_parts = []

    for result in results[:3]:
        text = result["text"].strip()

        text = text[:3000]

        context_parts.append(
            f"[Page {result['page']}]\n{text}"
        )

    context = "\n\n".join(context_parts)

    subject = request.subject or "ECE"

    # ---------------------------------------------------------
    # Prompt selection
    # ---------------------------------------------------------

    if request.mode == "solve":
        prompt = f"""
You are CircuitMate's ECE Problem Solver.

The student's subject is:
{subject}

Your job is to solve ONLY the specific problem the student actually
provided.

The study material below is reference material, not a list of problems
that you are allowed to substitute for the student's problem.

STUDY MATERIAL:
{context}

STUDENT PROBLEM:
{request.message}

IMPORTANT PROBLEM-IDENTIFICATION RULE:

Before solving anything, determine whether the student's message contains
enough information to identify the specific problem they want solved.

If the student has NOT provided enough information to identify the specific
problem:

- Do NOT silently choose a related example from the notes.
- State clearly that the problem statement or required circuit values are
  incomplete.
- You may mention that a related example exists in the notes, but clearly
  label it as a related example only.
- Do NOT present the related example as the student's problem.
- Do NOT invent missing circuit values, component values, equations,
  diagrams, assumptions, or numerical data.
- Ask the student to provide the missing problem statement, circuit values,
  or circuit image if necessary.
- Do not calculate a final numerical answer for an unspecified problem.

For example, if the student asks:
"Find the load resistance for maximum power transfer in this network"

but does not provide the network, circuit diagram, or values needed to
identify the network, you must NOT select Example 3 or another example
from the notes and pretend that it is their network.

Instead, explain that the specific network information is missing.

If the student DOES provide enough information to identify the problem,
solve that problem using only information supported by the study material.

GROUNDING RULES:

- Use only information supported by the study material.
- Do not use outside knowledge to fill missing information.
- Do not invent equations, values, formulas, theorems, or derivations.
- Identify the relevant formula, theorem, or method from the notes.
- Show the engineering reasoning step by step.
- If numerical values are provided, substitute them clearly.
- Keep units when they are present in the study material.
- If the notes do not provide enough information to solve the problem,
  clearly say so instead of guessing.
- Mention relevant page numbers.
- If an equation was corrupted during PDF extraction, do not reconstruct
  it from outside knowledge.
- Keep the answer suitable for an ECE engineering student.

Return the answer using EXACTLY this structure:

PROBLEM:
Briefly restate the student's actual problem.

GIVEN:
- List the values or conditions explicitly provided by the student and
  supported by the notes.
- If the problem is incomplete, state what information is missing.

APPROACH:
State the relevant formula, theorem, or method from the notes if the
problem is sufficiently specified.

SOLUTION:
Step 1 — ...
Step 2 — ...
Step 3 — ...

If the problem is incomplete, do not fabricate solution steps. Instead,
state what information is required to continue.

RESULT:
State the final result only if the student's actual problem contains
enough information and the study material supports the calculation.

EXAM NOTE:
Give one short note about how the student should present this solution
in an exam.

SOURCES:
- Page X
- Page Y
"""

    elif request.mode == "explain":
        prompt = f"""
You are CircuitMate, an ECE concept tutor.

The student's subject is:
{subject}

Explain the student's concept using ONLY the study material below.

STUDY MATERIAL:
{context}

STUDENT REQUEST:
{request.message}

Rules:
- Use only information supported by the study material.
- Do not add outside facts.
- Preserve important terminology from the notes.
- Explain the concept clearly for an ECE engineering student.
- Include formulas or relationships only when supported by the notes.
- If the notes are insufficient, clearly say so.
- Mention relevant page numbers.
- Do not invent missing equations.

Return the answer using this structure:

CONCEPT:
Name the concept being explained.

CORE IDEA:
Explain the main idea clearly.

FROM THE NOTES:
Explain the important details supported by the material.

KEY RELATIONSHIP:
Give the relevant equation or relationship if present in the notes.

EXAM TAKEAWAY:
Give a concise exam-friendly takeaway.

SOURCES:
- Page X
- Page Y
"""

    else:
        prompt = f"""
You are CircuitMate, an AI study companion for ECE students.

The student's subject is:
{subject}

Answer the student's question using ONLY the study material below.

STUDY MATERIAL:
{context}

STUDENT QUESTION:
{request.message}

Rules:
- Treat the study material as the primary and authoritative source.
- Do not use outside knowledge to fill missing information.
- Do not invent facts, equations, definitions, or derivations.
- Mention the relevant page number when using information from the material.
- If the material does not contain enough information to answer the question,
  clearly say so.
- Explain the answer clearly for an ECE student.
- Keep the answer focused on the student's question.
- If an equation was lost or corrupted during PDF text extraction, do not
  invent the missing equation.
- If the material contains a specific definition or terminology, preserve
  that terminology in the answer.

Return a clear, concise answer followed by:

SOURCES:
- Page X
- Page Y
"""

    # ---------------------------------------------------------
    # Generate answer with Gemma
    # ---------------------------------------------------------

    try:
        answer = ask_gemma(prompt)

    except Exception as exc:
        print(f"Gemma error: {exc}")

        return ChatResponse(
            answer=(
                "I found relevant information in your study material, "
                "but the AI service failed while generating the answer. "
                "Please try again."
            ),
            sources=[
                {
                    "page": result["page"],
                    "score": result["score"],
                }
                for result in results
            ],
        )

    # ---------------------------------------------------------
    # Sources
    # ---------------------------------------------------------

    sources = [
        {
            "page": result["page"],
            "score": result["score"],
        }
        for result in results
    ]

    # ---------------------------------------------------------
    # Persist conversation
    # ---------------------------------------------------------

    if request.session_id:
        save_message(
            session_id=request.session_id,
            role="user",
            content=request.message,
            mode=request.mode,
            sources=[],
        )

        save_message(
            session_id=request.session_id,
            role="assistant",
            content=answer,
            mode=request.mode,
            sources=sources,
        )

    return ChatResponse(
        answer=answer,
        sources=sources,
    )