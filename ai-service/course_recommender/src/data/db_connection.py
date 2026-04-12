"""Facilitates data retrieval from a MySQL database.

This module provides the `DatabaseConnection` class, which encapsulates
the logic for connecting to a MySQL server and executing queries to 
return results as Pandas DataFrames.

Author: Hassan Darwish
Date: April 2026
"""

import os
import logging
import mysql.connector
import pandas as pd
from course_recommender.src.utils.logger import setup_logging
from dotenv import load_dotenv

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)
load_dotenv()

class DatabaseConnection:
    """Handles connections to a MySQL database and facilitates data retrieval.

    This class encapsulates the connection logic, ensuring that database
    credentials are securely loaded from the environment and that 
    connections are properly closed after use.

    Attributes:
        db_host (Optional[str]): The hostname of the database server.
        db_user (Optional[str]): The username for authentication.
        db_name (Optional[str]): The name of the target database.
        db_password (Optional[str]): The password for authentication.
    """

    # --- Constants for clarity in database operations ---
    DICTIONARY_CURSOR = True
    """Whether to return rows as dictionaries (column_name: value)."""

    CONNECTION_SUCCESS_MSG = 'Database connection successful; data retrieved.'
    """Log message for successful data retrieval."""

    ZERO_ROWS_WARNING_MSG = 'Query executed successfully, but returned 0 rows.'
    """Log message for data not found."""

    ERROR_PREFIX = 'An error occurred during data retrieval: '
    """Prefix for logging exception details."""

    def __init__(self) -> None:
        """Initializes the DatabaseConnection with credentials from environment.
        
        Loads configuration from the system environment variables. It is 
        expected that DB_HOST, DB_USER, DB_NAME, and DB_PASSWORD are set.
        """
        self.db_host = os.getenv('DB_HOST')
        self.db_user = os.getenv('DB_USER')
        self.db_name = os.getenv('DB_NAME')
        self.db_password = os.getenv('DB_PASSWORD')

    def fetch_dataframe(self, query: str) -> pd.DataFrame | None:
        """Execute a SQL query and return the results as a Pandas DataFrame.

        This method manages the full lifecycle of a database request:
        establishing a connection, executing the query via a dictionary 
        cursor, and ensuring the connection is closed.

        Args:
            query (str): The SQL query string to be executed.

        Returns:
            pd.DataFrame: A DataFrame containing the fetched data.

        Raises:
            ConnectionError: If there is an issue connecting to the database 
                             or executing the query.
        """
        connection = None
        
        try:
            # 1. Establish the database connection
            connection = mysql.connector.connect(
                host=self.db_host,
                user=self.db_user,
                database=self.db_name,
                password=self.db_password
            )

            # 2. Use a dictionary cursor to map column names to values
            with connection.cursor(dictionary=self.DICTIONARY_CURSOR) as cursor:
                cursor.execute(query)
                data = cursor.fetchall()

            logger.info(self.CONNECTION_SUCCESS_MSG)
            
            # check data in rows 
            if not data:
                logger.warning(self.ZERO_ROWS_WARNING_MSG) 
                return pd.DataFrame()
            # 3. Convert the list of dictionaries to a Pandas DataFrame
            return pd.DataFrame(data)

        except Exception as e:
            # Log the specific exception details before raising a custom error
            logger.exception(f"{self.ERROR_PREFIX}{e}")
            raise ConnectionError(f"Failed to fetch data from database: {e}")

        finally:
            # 4. Ensure the connection is released back to the system
            if connection and connection.is_connected():
                connection.close()
    
    def fetch_column(self, query: str) -> list[int] | None:
        """Execute a SQL query and return the results as a list of integers.

        This method manages the full lifecycle of a database request:
        establishing a connection, executing the query via a dictionary 
        cursor, and ensuring the connection is closed.

        Args:
            query (str): The SQL query string to be executed.

        Returns:
            list[int]: A list containing the fetched data.

        Raises:
            ConnectionError: If there is an issue connecting to the database 
                             or executing the query.
        """
        connection = None
        try:
            # 1. Establish the database connection
            connection = mysql.connector.connect(
                host=self.db_host,
                user=self.db_user,
                database=self.db_name,
                password=self.db_password
            )

            # 2. Use a dictionary cursor to map column names to values
            with connection.cursor(dictionary=self.DICTIONARY_CURSOR) as cursor:
                cursor.execute(query)
                data = cursor.fetchall()

            logger.info(self.CONNECTION_SUCCESS_MSG)
            
            # check data in rows 
            if not data:
                logger.warning(self.ZERO_ROWS_WARNING_MSG) 
                return []
            # 3. Convert the dictionary into a list
            return [row[0] for row in data]
        
        except Exception as e:
            # Log the specific exception details before raising a custom error
            logger.exception(f"{self.ERROR_PREFIX}{e}")
            raise ConnectionError(f"Failed to fetch data from database: {e}")

        finally:
            # 4. Ensure the connection is released back to the system
            if connection and connection.is_connected():
                connection.close()