from typing import Any


DOCUMENT_CHUNKS: list[dict[str, Any]] = []


def set_chunks(chunks: list[dict[str, Any]]) -> None:
    DOCUMENT_CHUNKS.clear()
    DOCUMENT_CHUNKS.extend(chunks)


def get_chunks() -> list[dict[str, Any]]:
    return DOCUMENT_CHUNKS