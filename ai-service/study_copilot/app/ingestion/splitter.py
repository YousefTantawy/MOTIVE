"""Splits markdown text into manageable chunks for vector embedding.

This module provides the `DocumentSplitter` class, which wraps LangChain's
MarkdownTextSplitter to ensure large documents are broken down into
semantically meaningful segments without exceeding LLM context windows.

Author: Hassan Darwish
Date: April 2026
"""

import logging
from typing import List
from langchain_text_splitters import MarkdownTextSplitter
from study_copilot.app.utils.logger import setup_logging
from study_copilot.app.core.config import Settings

# Initialize logging and configuration
setup_logging()
logger = logging.getLogger(__name__)
settings = Settings()

class DocumentSplitter:
    """Handles the chunking of markdown text documents.

    This class provides a configurable interface to split large blocks of 
    markdown text into smaller, overlapping chunks to preserve context 
    when feeding data into embedding models or vector databases.
    """

    # --- Constants for Error Handling ---
    ERROR_INVALID_TYPE = "Invalid input for text splitting. Expected a string."
    """Error message raised when a non-string object is passed to the splitter."""

    def __init__(self) -> None:
        """Initializes the document splitter with specified dimensions."""
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
        
        # Initialize the underlying LangChain utility
        self.splitter = MarkdownTextSplitter(
            chunk_size=self.chunk_size, 
            chunk_overlap=self.chunk_overlap
        )

    def split_text(self, text: str) -> List[str]:
        """Splits a single markdown string into a list of smaller strings.

        Args:
            text (str): The raw markdown text to be split.

        Returns:
            List[str]: A list of text chunks. Returns an empty list if the 
                       input string is empty or contains only whitespace.

        Raises:
            ValueError: If the input is not a string type (e.g., None).
        """
        # 1. Strict Type Validation (Fail-Fast)
        if not isinstance(text, str):
            logger.error(f"{self.ERROR_INVALID_TYPE} Got: {type(text)}")
            raise ValueError(self.ERROR_INVALID_TYPE)

        # 2. Graceful Exit for Empty Strings
        if not text.strip():
            logger.warning("Empty string provided for splitting. Returning empty list.")
            return []

        # 3. Execute the Splitting Operation
        logger.debug(f"Splitting text (Size: {self.chunk_size}, Overlap: {self.chunk_overlap})...")
        chunks: List[str] = self.splitter.split_text(text)
        
        logger.info(f"Successfully split text into {len(chunks)} chunks.")
        return chunks