from typing import Any

DOCUMENT_CHUNKS: list[dict] = []
def chunk_pages(
    pages: list[dict[str, Any]],
    chunk_size: int = 1200,
    overlap: int = 200,
) -> list[dict[str, Any]]:
    chunks = []

    for page in pages:
        page_number = page["page"]
        text = page["text"].strip()

        if not text:
            continue

        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append(
                    {
                        "page": page_number,
                        "text": chunk_text,
                    }
                )

            if end >= len(text):
                break

            start = end - overlap

    return chunks