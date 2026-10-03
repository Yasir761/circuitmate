from typing import Any
import math
import re
from collections import Counter

MIN_SIMILARITY = 0.08

_chunks: list[dict[str, Any]] = []
_chunk_vectors: list[dict[str, float]] = []
_document_frequency: Counter[str] = Counter()
_total_chunks = 0


ECE_QUERY_HINTS: dict[str, str] = {
    "resonance": (
        "resonance resonant frequency resonance condition "
        "series resonance parallel resonance RLC XL XC"
    ),
    "maximum power": (
        "maximum power transfer maximum power transfer theorem "
        "Thevenin resistance load resistance RL Rth"
    ),
    "mesh analysis": (
        "mesh analysis mesh current loop analysis KVL "
        "Kirchhoff voltage law"
    ),
    "nodal analysis": (
        "nodal analysis node voltage node analysis KCL "
        "Kirchhoff current law"
    ),
    "thevenin": (
        "Thevenin theorem Thevenin equivalent Vth Rth "
        "equivalent circuit load resistance"
    ),
    "norton": (
        "Norton theorem Norton equivalent current resistance "
        "IN RN equivalent circuit"
    ),
    "mutual inductance": (
        "mutual inductance coupled coils mutual flux leakage flux "
        "coefficient of coupling M"
    ),
    "coefficient of coupling": (
        "coefficient of coupling coupled coils mutual inductance "
        "mutual flux leakage flux k"
    ),
}


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def expand_query(query: str) -> str:
    normalized = query.lower()

    hints = [
        vocabulary
        for trigger, vocabulary in ECE_QUERY_HINTS.items()
        if trigger in normalized
    ]

    if not hints:
        return query

    return f"{query}\n\nECE retrieval terms: {' '.join(hints)}"


def build_index(chunks: list[dict[str, Any]]) -> None:
    global _chunks
    global _chunk_vectors
    global _document_frequency
    global _total_chunks

    _chunks = chunks
    _chunk_vectors = []
    _document_frequency = Counter()
    _total_chunks = len(chunks)

    if not chunks:
        return

    tokenized_chunks = [
        tokenize(chunk["text"])
        for chunk in chunks
    ]

    for tokens in tokenized_chunks:
        _document_frequency.update(set(tokens))

    for tokens in tokenized_chunks:
        counts = Counter(tokens)
        total_terms = len(tokens)

        vector: dict[str, float] = {}

        if total_terms == 0:
            _chunk_vectors.append(vector)
            continue

        for term, count in counts.items():
            df = _document_frequency[term]

            # Smoothed inverse document frequency.
            idf = math.log(
                (_total_chunks + 1) / (df + 1)
            ) + 1

            vector[term] = (count / total_terms) * idf

        _chunk_vectors.append(vector)


def cosine_similarity(
    query_vector: dict[str, float],
    document_vector: dict[str, float],
) -> float:
    if not query_vector or not document_vector:
        return 0.0

    dot_product = sum(
        value * document_vector.get(term, 0.0)
        for term, value in query_vector.items()
    )

    query_norm = math.sqrt(
        sum(value * value for value in query_vector.values())
    )

    document_norm = math.sqrt(
        sum(value * value for value in document_vector.values())
    )

    if query_norm == 0 or document_norm == 0:
        return 0.0

    return dot_product / (query_norm * document_norm)


def build_query_vector(query: str) -> dict[str, float]:
    tokens = tokenize(query)

    if not tokens:
        return {}

    counts = Counter(tokens)
    total_terms = len(tokens)

    vector: dict[str, float] = {}

    for term, count in counts.items():
        df = _document_frequency.get(term, 0)

        idf = math.log(
            (_total_chunks + 1) / (df + 1)
        ) + 1

        vector[term] = (count / total_terms) * idf

    return vector


def retrieve_chunks(
    query: str,
    chunks: list[dict[str, Any]] | None = None,
    top_k: int = 4,
) -> list[dict[str, Any]]:
    global _chunks

    if chunks is not None and chunks is not _chunks:
        build_index(chunks)

    if not _chunks or not _chunk_vectors:
        return []

    retrieval_query = expand_query(query)
    query_vector = build_query_vector(retrieval_query)

    scored_chunks = []

    for chunk, vector in zip(_chunks, _chunk_vectors):
        score = cosine_similarity(query_vector, vector)

        if score >= MIN_SIMILARITY:
            scored_chunks.append(
                {
                    **chunk,
                    "score": score,
                }
            )

    scored_chunks.sort(
        key=lambda chunk: chunk["score"],
        reverse=True,
    )

    return scored_chunks[:top_k]