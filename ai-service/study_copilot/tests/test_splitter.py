"""Unit tests for the DocumentSplitter module.

This module verifies that the text chunking logic behaves correctly
under standard conditions, respects chunk size limits, and handles 
invalid inputs safely without causing silent downstream failures.

Author: Hassan Darwish
Date: April 2026
"""

import pytest
from study_copilot.app.ingestion.splitter import DocumentSplitter

@pytest.fixture
def document_splitter() -> DocumentSplitter:
    """Fixture to provide a clean instance of DocumentSplitter for each test.
    
    Using a fixture ensures that if the DocumentSplitter ever gains stateful 
    attributes, tests will not contaminate each other.
    """
    return DocumentSplitter()


def test_split_text_returns_valid_chunks(document_splitter: DocumentSplitter) -> None:
    """Verifies that a long markdown string is properly split into valid chunks.

    This test performs an end-to-end check of the splitting process, ensuring
    chunks do not exceed the configured maximum size.
    """
    # 1. Arrange: Set up a string guaranteed to exceed the chunk size
    base_string = "# Heading\n\nThis is a test markdown string to be split into chunks. "
    markdown = base_string * 30 
    
    # Pre-flight check to ensure our test data is actually long enough
    assert len(markdown) > document_splitter.chunk_size, "Test string must exceed chunk size."

    # 2. Act: Execute the splitting logic
    chunks = document_splitter.split_text(markdown)

    # 3. Assert: Validate the outcomes
    assert len(chunks) > 1, "The document was not split into multiple chunks."
    
    for i, chunk in enumerate(chunks):  
        assert isinstance(chunk, str), f"Chunk {i} is not a string. Got {type(chunk)}."
        assert len(chunk.strip()) > 0, f"Chunk {i} was empty or contained only whitespace."
        assert len(chunk) <= document_splitter.chunk_size, f"Chunk {i} exceeded max size."


def test_split_text_handles_empty_string(document_splitter: DocumentSplitter) -> None:
    """Verifies that passing an empty or whitespace-only string returns an empty list."""
    
    # 1. Arrange
    empty_markdown = "   \n\t  "

    # 2. Act
    chunks = document_splitter.split_text(empty_markdown)

    # 3. Assert
    assert chunks == [], "Expected the splitter to return an empty list for empty text."
    assert isinstance(chunks, list), "Expected the return type to remain a list."


def test_split_text_raises_value_error_on_invalid_type(document_splitter: DocumentSplitter) -> None:
    """Verifies the Fail-Fast mechanism triggers when given non-string data."""
    
    # 1. Arrange
    invalid_input = {"text": "This is a dictionary, not a string."}

    # 2 & 3. Act & Assert: Use pytest.raises to expect a specific exception
    with pytest.raises(ValueError, match="Invalid input for text splitting. Expected a string."):
        document_splitter.split_text(invalid_input) # type: ignore