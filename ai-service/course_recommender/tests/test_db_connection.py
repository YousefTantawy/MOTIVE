import pytest
import pandas as pd
from unittest.mock import MagicMock, patch
from src.course_recommender.data.db_connection import DatabaseConnection

@patch('src.course_recommender.data.db_connection.mysql.connector.connect')
def test_fetch_dataframe_success(mock_connect):
    
    # 1. Setup the "Fake" (Mock) Database Response
    # We create a fake cursor that returns a predefined list of dictionaries
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        {'course_id': 1, 'title': 'Machine Learning', 'full_text': 'Intro to ML'},
        {'course_id': 2, 'title': 'Data Structures', 'full_text': 'Trees and Graphs'}
    ]
    
    # We tell our fake connection to return our fake cursor
    # (The enter/exit handles the 'with' context manager in your code)
    mock_connection = MagicMock()
    mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connect.return_value = mock_connection

    # 2. Run the actual code
    db = DatabaseConnection()
    df = db.fetch_dataframe("SELECT * FROM fake_table")

    # 3. Assertions (Did the code do what we expected?)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 2
    assert df.iloc[0]['title'] == 'Machine Learning'
    
    # Verify that your code actually tried to close the connection safely
    mock_connection.close.assert_called_once()