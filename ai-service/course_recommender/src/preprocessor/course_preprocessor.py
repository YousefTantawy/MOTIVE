"""Preprocesses course data for recommendation models.

This module provides the `CoursePreprocessor` class, which handles
the cleaning, normalization, and combination of text fields from a 
course database into a structured format suitable for vectorization.

Author: Hassan Darwish
Date: April 2026
"""

import logging
import pandas as pd
from typing import Tuple, List
from src.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class CoursePreprocessor:
    """Cleans and prepares course text data for downstream processing.

    This class takes a raw pandas DataFrame containing course information
    and performs text normalization, feature concatenation, and validation
    to ensure the data is structurally sound for the recommender system.
    """

    # --- Constants for column names and logging clarity ---
    COLUMN_COURSE_ID = 'course_id'
    """The dataframe column containing the unique course identifier."""

    COLUMN_TITLE = 'title'
    """The dataframe column containing the course title."""

    COLUMN_FULL_TEXT = 'full_text'
    """The dataframe column containing the detailed course description."""

    COLUMN_COMBINED_TEXT = 'combined_text'
    """The newly created column combining title and description."""

    PREPROCESSED_SUCCESSFULLY_MSG = 'Data preprocessing finished successfully.'
    """Log message indicating successful completion of the pipeline."""

    ERROR_MSG_PREFIX = 'Missing expected column in database data: '
    """Prefix for logging missing column exceptions."""

    def preprocess(self, df: pd.DataFrame) -> Tuple[List[int], List[str]]:
        """Processes raw course data into parallel lists of IDs and texts.

        This method handles null values, concatenates the title and full 
        text for maximum context, and normalizes spacing to ensure clean
        input for embedding models.

        Args:
            df (pd.DataFrame): The raw course data. Must contain 'course_id', 
                               'title', and 'full_text' columns.

        Returns:
            Tuple[List[int], List[str]]: A tuple containing two parallel lists:
                                         1. A list of course IDs (integers).
                                         2. A list of cleaned, combined texts.

        Raises:
            ValueError: If the input DataFrame is missing required columns.
        """
        # 1. Handle empty input immediately to avoid unnecessary processing
        if df.empty:
            return [], []

        try:
            # 2. Impute missing values: replace any None/NaN in full_text with an empty string
            df[self.COLUMN_FULL_TEXT] = df[self.COLUMN_FULL_TEXT].fillna('')
            
            # 3. Feature engineering: combine title and full text for maximum semantic context
            df[self.COLUMN_COMBINED_TEXT] = (
                df[self.COLUMN_TITLE] + ' ' + df[self.COLUMN_FULL_TEXT]
            )

            # 4. Text normalization: remove leading and trailing whitespace
            df[self.COLUMN_COMBINED_TEXT] = df[self.COLUMN_COMBINED_TEXT].str.strip()
            
            # 5. Text normalization: collapse multiple spaces into a single space
            df[self.COLUMN_COMBINED_TEXT] = df[self.COLUMN_COMBINED_TEXT].str.replace(
                r'\s+', ' ', regex=True
            )

            # 6. Data extraction: convert the pandas Series into standard Python lists
            index_list: List[int] = df[self.COLUMN_COURSE_ID].tolist()
            text_list: List[str] = df[self.COLUMN_COMBINED_TEXT].tolist()

            logger.info(self.PREPROCESSED_SUCCESSFULLY_MSG)
            return index_list, text_list 

        except KeyError as e:
            # Log the exact error and raise a descriptive ValueError for the caller
            logger.error(f"{self.ERROR_MSG_PREFIX}{e}")
            raise ValueError(f"Dataframe is missing a required column: {e}")