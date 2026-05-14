"""API Router and Entrypoint using Dependency Injection.

This module exposes the REST API endpoints using FastAPI. It utilizes 
FastAPI's Dependency Injection system to safely provide the QAService 
to endpoints, making the application highly modular and testable.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from contextlib import asynccontextmanager
from typing import Optional

# 2. Third-Party Imports
import uvicorn
from fastapi import FastAPI, Depends, HTTPException

# 3. Local Application Imports
from study_copilot.app.services.qa_service import QAService
from study_copilot.app.schemas.qa_schema import QARequest, QAResponse
from study_copilot.app.utils.logger import setup_logging

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

# --- Global State for Dependency Injection ---
# This holds the active instance of our service in memory.
qa_service_instance: Optional[QAService] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages the startup and shutdown lifecycle of the FastAPI application."""
    global qa_service_instance
    
    logger.info("Starting Study Copilot API. Initializing ML models and DB connections...")
    
    try:
        # 1. Startup: Instantiate the service once when the server boots
        qa_service_instance = QAService()
        logger.info("All backend services initialized successfully. Ready for requests.")
        yield
        
    except Exception as e:
        logger.critical(f"Failed to initialize backend services: {e}")
        raise RuntimeError(f"Startup failed: {e}")
        
    finally:
        # 2. Shutdown: Clean up resources
        logger.info("Shutting down Study Copilot API resources...")
        # if qa_service_instance and hasattr(qa_service_instance, 'cleanup'):
        #     qa_service_instance.cleanup()


# Initialize the FastAPI app with the defined lifespan
app = FastAPI(title="Study Copilot API", lifespan=lifespan)


# --- Dependency Providers ---

def get_qa_service() -> QAService:
    """Dependency provider that yields the active QAService instance.
    
    Raises:
        RuntimeError: If the service failed to initialize during the lifespan phase.
    """
    if qa_service_instance is None:
        error_msg = "QAService is not initialized. Server startup may have failed."
        logger.error(error_msg)
        raise RuntimeError(error_msg)
    
    return qa_service_instance


# --- Endpoints ---

@app.post("/get-answer", response_model=QAResponse)
async def get_llm_response(
    payload: QARequest, 
    qa_service: QAService = Depends(get_qa_service)
) -> QAResponse:
    """Fetches an AI-generated answer grounded in retrieved document context.

    Args:
        payload (QARequest): The strictly validated incoming JSON payload.
        qa_service (QAService): The injected service instance handling RAG logic.

    Returns:
        QAResponse: The synthesized answer and its supporting source metadata.

    Raises:
        HTTPException: If the backend services encounter an unrecoverable error.
    """
    try:
        # Execute the RAG pipeline
        response: QAResponse = qa_service.answer_question(payload)
        return response

    except Exception as e:
        # Catch unexpected internal errors and return a clean 500 status to the client
        logger.exception(f"Internal server error while processing request: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An internal server error occurred while generating the response."
        )
