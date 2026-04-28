"""API Router for the Course Recommendation service.

This module provides the FastAPI application and REST endpoints required 
to serve course recommendations. It handles database querying, ML artifact 
loading via application lifespan events, and prediction formatting.

Author: Hassan Darwish
Date: April 2026
"""

import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, Any
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from course_recommender.src.data.db_connection import DatabaseConnection
from course_recommender.src.model.course_recommender import CourseRecommender
from course_recommender.src.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize global components (empty states)
recommender = CourseRecommender()
db_connection = DatabaseConnection()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages the startup and shutdown lifecycle of the FastAPI application.
    
    This ensures heavy ML artifacts are only loaded into memory when the 
    server actually starts running, rather than every time the file is imported.
    """
    logger.info("Initializing application and loading ML models...")
    
    # 1. Locate the artifact directory
    artifact_dir = Path(recommender.DEFAULT_ARTIFACT_DIR)
    model_files = list(artifact_dir.glob(f"*{recommender.ARTIFACT_EXTENSION}"))

    # 2. Validate and load the most recent artifact
    if not model_files:
        logger.warning("No .joblib files found! Recommender will fail if predict is called.")
    else:
        # Find the file with the most recent modification time (st_mtime)
        latest_model_path = max(model_files, key=lambda p: p.stat().st_mtime)
        try:
            recommender.load_artifact(latest_model_path)
            logger.info(f"Successfully loaded model artifact: {latest_model_path.name}")
        except Exception as e:
            logger.error(f"Failed to load artifact during startup: {e}")
            
    # Yield control back to FastAPI so it can start accepting requests
    yield
    
    logger.info("Application shutting down. Cleaning up resources...")

# Initialize the FastAPI app with the defined lifespan
app = FastAPI(lifespan=lifespan, title="Course Recommender API")

class UserRequest(BaseModel):
    """Schema definition for incoming recommendation requests."""
    user_id: int

@app.post("/get-ids")
async def get_course_recommendation_ids(request: UserRequest) -> Dict[str, Any]:
    """Fetches personalized course recommendations based on user history.

    Args:
        request (UserRequest): The validated JSON payload containing the user_id.

    Returns:
        Dict[str, Any]: A dictionary containing the status and a list of 
                        recommended course IDs.

    Raises:
        HTTPException: If the database connection fails or the ML model 
                       has not been properly initialized.
    """
    try:
        # 1. Secure Database Query: Pass user_id as a parameter tuple to prevent SQL Injection
        query_enrolled_courses = f"""
            SELECT c.course_id
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            WHERE e.user_id = {request.user_id};
        """
        """SQL query to fetch active course enrollments for a specific user."""

        courses = db_connection.fetch_column(query_enrolled_courses)

        # 2. Handle the "Cold Start" problem (user has no prior enrollments)
        if not courses:
            logger.info(f"User {request.user_id} has no enrollments. Returning cold start.")
            return {"status": "cold_start", "recommended_ids": []}

        # 3. Generate recommendations using the loaded artifact
        recommended_ids = recommender.predict(courses)
        
        return {
            "status": "success", 
            "recommended_ids": recommended_ids
        }

    except ValueError as ve:
        # Catch ML errors (e.g., embeddings not loaded) and return a 503 Service Unavailable
        logger.error(f"Prediction failed: {ve}")
        raise HTTPException(status_code=503, detail="Recommender model is currently unavailable.")
    
    except Exception as e:
        # Catch unexpected DB or internal errors
        logger.exception(f"Internal server error while processing request for user {request.user_id}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

if __name__ == '__main__':
    # Run the application locally for development
    uvicorn.run("course_recommender.src.router:app", host="127.0.0.1", port=5171, reload=True)