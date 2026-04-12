"""Executes the end-to-end embedding generation pipeline.

This module orchestrates the workflow of extracting course catalog data 
from the database, preprocessing the text, generating dense semantic 
embeddings, and saving the resulting artifacts to disk.

Author: Hassan Darwish
Date: April 2026
"""

import logging
import pandas as pd
from course_recommender.src.utils.logger import setup_logging
from course_recommender.src.model.course_recommender import CourseRecommender
from course_recommender.src.preprocessor.course_preprocessor import CoursePreprocessor
from course_recommender.src.data.db_connection import DatabaseConnection

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class EmbeddingPipeline:
    """Orchestrates the data extraction, embedding generation, and saving process.

    This class binds together the database connector, text preprocessor, 
    and recommendation model to provide a single, unified method for 
    refreshing the course embedding artifacts.
    """

    # --- Constants for Configuration ---
    CATALOG_QUERY = """
        SELECT c.course_id, c.title, cd.full_text 
        FROM courses c
        JOIN course_descriptions cd ON c.course_id = cd.course_id
    """
    """SQL query to fetch the complete active course catalog."""

    def __init__(self) -> None:
        """Initializes the pipeline components."""
        self.db_connection = DatabaseConnection()
        self.preprocessor = CoursePreprocessor()
        self.recommender = CourseRecommender()

    def run(self) -> None:
        """Executes the complete embedding generation pipeline.

        Steps:
            1. Fetch raw course data from the database.
            2. Validate the data exists.
            3. Preprocess and clean the text fields.
            4. Generate semantic embeddings.
            5. Serialize and save the artifact to disk.

        Raises:
            ValueError: If the database returns an empty dataset or if 
                        preprocessing yields no valid text.
        """
        logger.info("Starting the embedding generation pipeline...")

        # 1. Fetch raw data
        logger.info("Fetching course catalog from the database...")
        df: pd.DataFrame = self.db_connection.fetch_dataframe(self.CATALOG_QUERY)
        
        # 2. Strict Validation: Use .empty instead of 'is None' for Pandas DataFrames
        if df.empty:
            error_msg = 'The database query returned an empty dataset. Pipeline aborted.'
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # 3. Preprocess the text
        logger.info(f"Preprocessing {len(df)} course records...")
        course_ids_list, all_text_list = self.preprocessor.preprocess(df)

        # 4. Fail-Fast validation before heavy processing
        if not course_ids_list or not all_text_list:
            error_msg = 'Preprocessing resulted in empty lists. Pipeline aborted.'
            logger.error(error_msg)
            raise ValueError(error_msg)

        # 5. Generate embeddings
        # 
        self.recommender.generate_embeddings(course_ids_list, all_text_list)

        # 6. Save the artifact to disk
        self.recommender.save_artifact()
        
        logger.info("Pipeline execution completed successfully.")

if __name__ == "__main__":
    # This block ensures the pipeline only runs if the script is executed 
    # directly, not if it is imported by another module.
    pipeline = EmbeddingPipeline()
    pipeline.run()