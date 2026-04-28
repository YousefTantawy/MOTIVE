"""Provides data access for course documents and materials.

This module contains the `DocumentRepository` class, which acts as an 
abstraction layer over the database connection. It is responsible for 
retrieving file paths and metadata for course materials securely.

Author: Hassan Darwish
Date: April 2026
"""

# 1. Standard Library Imports
import logging
from typing import Optional

# 2. Local Application Imports
from study_copilot.app.data.db_connection import DatabaseConnection
from study_copilot.app.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class DocumentRepository:
    """Handles database operations related to course documents.

    This repository pattern isolates the SQL queries and database logic 
    from the rest of the application (like routers or services), making 
    the system easier to test and maintain.
    """

    # --- Constants for Query Execution ---
    QUERY_GET_FILE_PATH = """
        SELECT file_path
        FROM course_materials
        WHERE material = %s;
    """
    """SQL query to fetch the file path of a specific material by its ID."""

    def __init__(self) -> None:
        """Initializes the repository with a database connection."""
        self.db = DatabaseConnection()

    def get_pdf_link(self, pdf_id: int) -> Optional[str]:
        """Retrieves the file path (link) for a given PDF document ID.

        Args:
            pdf_id (int): The unique identifier for the requested material.

        Returns:
            Optional[str]: The file path if the document exists, otherwise None.

        Raises:
            ConnectionError: If the database query fails to execute.
        """
        # 1. Prepare parameterized input to prevent SQL injection
        param = (pdf_id,)
        
        try:
            # 2. Execute the scalar fetch
            logger.info(f"Fetching document link for material ID: {pdf_id}")
            link: Optional[str] = self.db.fetch_scalar(self.QUERY_GET_FILE_PATH, param)
            
            # 3. Handle the result gracefully
            if link is None:
                logger.warning(f"No document found for material ID: {pdf_id}")
            else:
                logger.info(f"Document link retrieved successfully for ID: {pdf_id}")
                
            return link

        except Exception as e:
            # 4. Catch, log, and re-raise exceptions to maintain the Fail-Fast pattern
            logger.exception(f"Database error while fetching PDF link for ID {pdf_id}: {e}")
            raise ConnectionError(f"Failed to retrieve document link: {e}")