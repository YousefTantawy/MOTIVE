"""API Router and Entrypoint using Dependency Injection.

This module exposes the REST API endpoints for the Course Recommender.
It utilizes FastAPI's Dependency Injection system to safely provide the 
database and ML models to endpoints, ensuring the application remains 
highly modular, testable, and secure against injection attacks.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, Any, Optional

# 2. Third-Party Imports
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

# 3. Local Application Imports
from course_recommender.src.data.db_connection import DatabaseConnection
from course_recommender.src.model.course_recommender import CourseRecommender
from course_recommender.src.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

# --- Global State for Dependency Injection ---
recommender_instance: Optional[CourseRecommender] = None
db_instance: Optional[DatabaseConnection] = None

# --- Constants for Query Execution ---
QUERY_ENROLLED_COURSES = """
    SELECT c.course_id
    FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    WHERE e.user_id = %s;
"""
"""Parameterized SQL query to fetch active course enrollments for a specific user."""


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages the startup and shutdown lifecycle of the FastAPI application.
    
    Ensures that heavy ML artifacts and database connections are instantiated 
    exactly once during server boot, rather than on every request or import.
    """
    global recommender_instance, db_instance
    
    logger.info("Initializing Recommender application and loading models...")
    
    # 1. Safely initialize DB and Model during startup
    db_instance = DatabaseConnection()
    recommender_instance = CourseRecommender()
    
    artifact_dir = Path(recommender_instance.DEFAULT_ARTIFACT_DIR)
    model_files = list(artifact_dir.glob(f"*{recommender_instance.ARTIFACT_EXTENSION}"))

    if not model_files:
        logger.warning("No .joblib files found! Recommender will fail if predict is called.")
    else:
        latest_model_path = max(model_files, key=lambda p: p.stat().st_mtime)
        try:
            recommender_instance.load_artifact(latest_model_path)
            logger.info(f"Successfully loaded model artifact: {latest_model_path.name}")
        except Exception as e:
            logger.error(f"Failed to load artifact during startup: {e}")
            
    yield
    
    # 2. Cleanup Resources
    logger.info("Application shutting down. Cleaning up resources...")
    # if db_instance and hasattr(db_instance, 'close'):
    #     db_instance.close()


# Initialize the FastAPI app with the defined lifespan
app = FastAPI(lifespan=lifespan, title="Course Recommender API")


class UserRequest(BaseModel):
    """Schema definition for incoming recommendation requests."""
    user_id: int


# --- Dependency Providers ---

def get_recommender() -> CourseRecommender:
    """Dependency provider that yields the active CourseRecommender instance."""
    if recommender_instance is None:
        raise RuntimeError("CourseRecommender is not initialized.")
    return recommender_instance

def get_db() -> DatabaseConnection:
    """Dependency provider that yields the active DatabaseConnection instance."""
    if db_instance is None:
        raise RuntimeError("DatabaseConnection is not initialized.")
    return db_instance


# --- API Endpoints ---

@app.post("/get-ids")
async def get_course_recommendation_ids(
    request: UserRequest,
    recommender: CourseRecommender = Depends(get_recommender),
    db: DatabaseConnection = Depends(get_db)
) -> Dict[str, Any]:
    """Fetches personalized course recommendations based on user history.

    Args:
        request (UserRequest): Validated JSON payload containing the user_id.
        recommender (CourseRecommender): Injected ML model service.
        db (DatabaseConnection): Injected database connection service.

    Returns:
        Dict[str, Any]: A dictionary containing the status and recommended IDs.

    Raises:
        HTTPException: If the ML model is unavailable (503) or a general 
                       server error occurs (500).
    """
    try:
        # 1. Execute Parameterized Query
        # Passing (request.user_id,) as a tuple completely negates SQL Injection risks
        courses = db.fetch_column(QUERY_ENROLLED_COURSES, (request.user_id,))

        # 2. Handle Cold Start
        if not courses:
            logger.info(f"User {request.user_id} has no enrollments. Returning cold start.")
            return {"status": "cold_start", "recommended_ids": []}

        # 3. Generate Predictions
        recommended_ids = recommender.predict(courses)
        
        return {
            "status": "success", 
            "recommended_ids": recommended_ids
        }

    except ValueError as ve:
        logger.error(f"Prediction failed: {ve}")
        raise HTTPException(status_code=503, detail="Recommender model is currently unavailable.")
    
    except Exception as e:
        logger.exception(f"Internal server error processing request for user {request.user_id}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

