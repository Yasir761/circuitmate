from typing import Any

import faiss
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
MIN_SIMILARITY = 0.38

_model = SentenceTransformer(EMBEDDING_MODEL)

_index: faiss.Index | None = None
_chunks: list[dict[str, Any]] = []

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
    global _index, _chunks

    _chunks = chunks

    if not chunks:
        _index = None
        return

    texts = [chunk["text"] for chunk in chunks]
    embeddings = _model.encode(texts, normalize_embeddings=True)

    dimension = embeddings.shape[1]
    _index = faiss.IndexFlatIP(dimension)
    _index.add(embeddings)

def retrieve_chunks(
    query: str,
    chunks: list[dict[str, Any]] | None = None,
    top_k: int = 4,
) -> list[dict[str, Any]]:
    global _index, _chunks

    if chunks is not None and chunks is not _chunks:
        build_index(chunks)

    if _index is None or not _chunks:
        return []

    retrieval_query = expand_query(query)
    query_embedding = _model.encode(
        [retrieval_query],
        normalize_embeddings=True,
    )

    scores, indices = _index.search(
        query_embedding,
        min(top_k, len(_chunks)),
    )

    results = []

    for score, index in zip(scores[0], indices[0]):
        if index < 0:
            continue

        score_value = float(score)

        if score_value < MIN_SIMILARITY:
            continue

        results.append(
            {
                **_chunks[index],
                "score": score_value,
            }
        )

    return results
