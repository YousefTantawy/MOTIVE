"""Extracts text from Google Drive PDFs into Markdown format.

This module provides the `DocumentLoader` class, which handles the secure 
downloading of PDF documents from Google Drive to local temporary storage, 
extracts their contents into LLM-friendly Markdown, and ensures the 
system cleans up the temporary files afterward.

Author: Hassan Darwish
Date: April 2026
"""

import logging
import os
import tempfile
import gdown
import pymupdf4llm
from study_copilot.app.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class DocumentLoader:
    """Handles remote document retrieval and text extraction.

    This class encapsulates the workflow of securely downloading external 
    PDFs and parsing them using PyMuPDF into a structured Markdown format 
    suitable for Large Language Models or vector databases.
    """

    # --- Constants for Configuration and Error Handling ---
    TEMP_FILE_SUFFIX = '.pdf'
    """The suffix enforced on temporary files to ensure proper parsing."""

    ERROR_EMPTY_URL = 'The provided Google Drive URL is empty or invalid.'
    """Error message for validation failure on the input URL."""

    def load_from_gdrive(self, gdrive_url: str) -> str:
        """Downloads a PDF from Google Drive and extracts it to Markdown.

        Args:
            gdrive_url (str): The public or shared link to the Google Drive PDF.

        Returns:
            str: The extracted text from the PDF formatted as Markdown.

        Raises:
            ValueError: If the provided URL is empty.
            RuntimeError: If the download fails or the PDF cannot be parsed.
        """
        # 1. Fail-Fast Validation
        if not gdrive_url or not isinstance(gdrive_url, str):
            logger.error(self.ERROR_EMPTY_URL)
            raise ValueError(self.ERROR_EMPTY_URL)

        # 2. Create a secure, temporary file on the hard drive
        # We set delete=False so we can manually control when it gets destroyed
        with tempfile.NamedTemporaryFile(delete=False, suffix=self.TEMP_FILE_SUFFIX) as temp_pdf:
            temp_path = temp_pdf.name

        try:
            # 3. Download the file into the temporary path
            logger.info(f"Starting download from Google Drive URL: {gdrive_url}")
            
            # gdown.download handles both public and shared links
            gdown.download(url=gdrive_url, output=temp_path, quiet=False)
            logger.info("Download completed successfully.")
            
            # 4. Extract the text to Markdown
            logger.info("Extracting PDF content to Markdown format...")
            markdown_text: str = pymupdf4llm.to_markdown(temp_path)
            logger.info("Text extraction completed successfully.")
            
            return markdown_text
            
        except Exception as e:
            # 5. Catch network and parsing errors, log them, and escalate
            logger.exception(f"An error occurred during document loading: {e}")
            raise RuntimeError(f"Document loading pipeline failed: {e}")
            
        finally:
            # 6. ALWAYS clean up the temporary file
            # This ensures the server doesn't crash from full disk space over time
            if os.path.exists(temp_path):
                os.remove(temp_path)
                logger.debug(f"Temporary file {temp_path} successfully cleaned up.")