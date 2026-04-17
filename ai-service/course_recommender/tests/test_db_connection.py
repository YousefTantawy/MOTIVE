import pandas as pd
from course_recommender.src.data.db_connection import DatabaseConnection


def test_fetch_dataframe_success():
    # 2. Run the actual code
    db = DatabaseConnection()
    df = db.fetch_dataframe("SELECT * FROM courses")

    # 3. Assertions (Did the code do what we expected?)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 55
    assert df.iloc[0]['title'] == 'Advanced C# Design Patterns'

def test_fetch_column_success():
    db = DatabaseConnection()
    col = db.fetch_column("SELECT title FROM courses")

    assert isinstance(col, list)
    assert len(col) == 55
    assert col[0] == 'Advanced C# Design Patterns'