"""Integration tests for the DocumentLoader module.

This module contains tests to verify that the DocumentLoader can 
successfully connect to external sources (like Google Drive), download 
files securely, and parse them into structured Markdown format.

Note: These are integration tests that make actual network calls. In a 
strict CI/CD pipeline, network calls should ideally be mocked.

Author: Hassan Darwish
Date: April 2026
"""

import pytest
from study_copilot.app.ingestion.loader import DocumentLoader

# --- Constants for Testing ---
VALID_GDRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/15sN_xfAoYZ6XftO0JubWgB9_GrV1abUx'
"""A known, public Google Drive URL containing testable PDF documents."""

@pytest.fixture
def document_loader() -> DocumentLoader:
    """Fixture to provide a clean instance of DocumentLoader for each test.
    
    Using a fixture ensures that if the DocumentLoader ever gains stateful 
    attributes, tests will not contaminate each other.
    """
    return DocumentLoader()

def test_load_from_gdrive_returns_valid_markdown(document_loader: DocumentLoader) -> None:
    """Verifies that a valid Google Drive URL yields extracted Markdown text.

    This test performs an end-to-end integration check of the download, 
    temporary file management, and PyMuPDF extraction pipeline.
    """
    
    # 1. Arrange: Set up the necessary data for the test
    url = VALID_GDRIVE_FOLDER_URL

    # 2. Act: Execute the exact method being tested
    markdown = document_loader.load_from_gdrive(url)

    # 3. Assert: Validate the outcomes with descriptive error messages
    
    # Verify the object exists and is the correct data type
    assert markdown is not None, "The loader returned None instead of a string."
    assert isinstance(markdown, str), f"Expected a string, but got {type(markdown)}."
    
    # Verify the string actually contains extracted content, not just whitespace
    assert len(markdown.strip()) > 0, "The extracted markdown string was completely empty."