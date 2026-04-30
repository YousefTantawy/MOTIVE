import pandas as pd
from study_copilot.app.data.db_connection import DatabaseConnection


# def test_fetch_dataframe_success():
#     # 2. Run the actual code
#     db = DatabaseConnection()
#     df = db.fetch_dataframe("SELECT * FROM %s", ("courses",))

#     # 3. Assertions (Did the code do what we expected?)
#     assert isinstance(df, pd.DataFrame)
#     assert len(df) == 55
#     assert df.iloc[0]['title'] == 'Advanced C# Design Patterns'

def test_fetch_column_success():
    db = DatabaseConnection()
    query = "SELECT title FROM courses WHERE difficulty_level = %s"
    params = ("Advanced",)
    col = db.fetch_column(query, params)

    assert isinstance(col, list)
    assert len(col) == 17
    assert col[0] == 'Advanced C# Design Patterns'

def test_fetch_scalar():
    db = DatabaseConnection()
    query = """SELECT file_path
        FROM course_materials
        WHERE material_id = %s;"""
        
    params = (1,) # FIX 1: Pass an integer, not a string
    link = db.fetch_scalar(query, params)

    assert link is not None, "Database returned None. Check if you committed the row in MySQL Workbench!"
    assert link.startswith('https://drive.google.com/file/') # FIX 2: Correct method call
    assert isinstance(link, str)
