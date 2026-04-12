from fastapi import FastAPI
from pydantic import BaseModel
from course_recommender.src.model.course_recommender import CourseRecommender
from course_recommender.src.preprocessor.course_preprocessor import CoursePreprocessor
from course_recommender.src.data.db_connection import DatabaseConnection

app = FastAPI()


class UserRequest(BaseModel):
    user_id: int

@app.post("/get-course-recommendation-ids")
async def get_course_recommendation_ids(request: UserRequest):
    df = db_connection.fetch_dataframe("""
            SELECT c.course_id, c.title, cd.full_text 
            FROM courses c
            JOIN course_descriptions cd ON c.course_id = cd.course_id
        """)
    
    if df is None:
        raise ValueError('the dataframe returned with empty cells.')
    
    course_ids_list, all_text_list = preprocessor.preprocess(df)

    recommender.generate_embeddings(course_ids_list, all_text_list)

    user_enrolled_courses = db_connection.fetch_column(
        f"SELECT course_id FROM enrollments WHERE user_id = {request.user_id}"
    )
    if user_enrolled_courses is None:
        raise ValueError('the user is not enrolled in any course')

    ids = recommender.predict(user_enrolled_courses)
    recommender.save_artifact()

    return ids 