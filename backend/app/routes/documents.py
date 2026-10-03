from pathlib import Path

import fitz
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.services.document_store import get_chunks, set_chunks
from app.services.documents import chunk_pages
from app.services.mongodb import save_document
from app.services.retrieval import build_index, retrieve_chunks


router = APIRouter(
    prefix="/api/documents",
    tags=["documents"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    session_id: str = Form(...),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    file_path = UPLOAD_DIR / file.filename

    contents = await file.read()
    file_path.write_bytes(contents)

    document = fitz.open(file_path)

    pages = []

    for page_number, page in enumerate(
        document,
        start=1,
    ):
        text = page.get_text("text").strip()

        if text:
            pages.append(
                {
                    "page": page_number,
                    "text": text,
                }
            )

    document.close()

    chunks = chunk_pages(pages)

    # Keep retrieval state in memory for the current backend process.
    set_chunks(chunks)
    build_index(chunks)

    document_id = save_document(
        session_id=session_id,
        filename=file.filename,
        pages=len(pages),
        chunks=len(chunks),
        subject="ECE",
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "pages": len(pages),
        "chunks": len(chunks),
    }


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search_document(request: SearchRequest):
    results = retrieve_chunks(
        request.query,
        get_chunks(),
    )

    return {
        "query": request.query,
        "results": results,
    }