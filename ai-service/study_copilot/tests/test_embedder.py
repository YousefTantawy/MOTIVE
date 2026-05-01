"""Unit tests for the DocumentEmbedder module.

This module verifies that the sentence transformer model correctly encodes 
valid text into numerical vectors, handles empty datasets gracefully, and 
fails fast when provided with incorrectly typed data.

Author: Hassan Darwish
Date: April 2026
"""

# 1. Standard/Third-Party Imports
import pytest

# 2. Local Application Imports
from study_copilot.app.ingestion.embedder import DocumentEmbedder


@pytest.fixture(scope="module")
def document_embedder() -> DocumentEmbedder:
    """Fixture to provide a single, reusable instance of DocumentEmbedder.
    
    Setting scope="module" ensures the heavy ML model is only loaded into 
    memory once for the entire test file, drastically reducing test execution time.
    """
    return DocumentEmbedder()


def test_embed_text_returns_valid_vectors(document_embedder: DocumentEmbedder) -> None:
    """Verifies that the embedder returns a valid matrix of floats for standard text."""
    
    # 1. Arrange
    chunks = [
        "This is the first test chunk.", 
        "Machine learning pipelines require rigorous testing."
    ]

    # 2. Act
    embeddings = document_embedder.embed_text(chunks)
    
    # 3. Assert
    assert isinstance(embeddings, list), f"Expected output to be a list, got {type(embeddings)}."
    assert len(embeddings) == len(chunks), "Output length does not match input chunk count."
    
    for i, vec in enumerate(embeddings):
        assert isinstance(vec, list), f"Expected embedding {i} to be a list, got {type(vec)}."
        assert len(vec) > 0, f"Embedding vector {i} is empty."
        
        # Verify the contents are actually numerical
        assert all(isinstance(val, float) for val in vec), f"Embedding {i} contains non-float values."


def test_embed_text_handles_empty_list(document_embedder: DocumentEmbedder) -> None:
    """Verifies that passing an empty list bypasses the model and returns an empty list."""
    
    # 1. Arrange
    empty_chunks: list[str] = []

    # 2. Act
    embeddings = document_embedder.embed_text(empty_chunks)

    # 3. Assert
    assert embeddings == [], "Expected the embedder to return an empty list for empty input."
    assert isinstance(embeddings, list), "Expected the return type to remain a list."


def test_embed_text_raises_value_error_on_invalid_type(document_embedder: DocumentEmbedder) -> None:
    """Verifies the Fail-Fast mechanism triggers when given a single string instead of a list."""
    
    # 1. Arrange
    invalid_input = "This is a single string, but the method expects a list of strings."

    # 2 & 3. Act & Assert: Use pytest.raises to expect our specific type-check exception
    with pytest.raises(ValueError, match="Invalid input type. Expected a list of strings."):
        document_embedder.embed_text(invalid_input) # type: ignore