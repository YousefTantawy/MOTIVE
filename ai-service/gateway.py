"""Unified AI API Gateway.

This module serves as the primary entry point for the entire backend ecosystem.
It utilizes FastAPI's mounting capabilities to route traffic to independent 
microservices (Course Recommender and Study Copilot) while orchestrating 
their startup and shutdown lifecycles safely.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from contextlib import asynccontextmanager

# 2. Third-Party Imports
import uvicorn
from fastapi import FastAPI

# 3. Local Application Imports
# Note: In a true microservice architecture, logging utilities might be in a shared 
# common library. For this gateway, we utilize the copilot's established logger.
from study_copilot.app.utils.logger import setup_logging

# Import the Recommender Microservice
from course_recommender.src.router import app as recommender_app
from course_recommender.src.router import lifespan as recommender_lifespan

# Import the Study Copilot Microservice
from study_copilot.app.api.router import app as copilot_app
from study_copilot.app.api.router import lifespan as copilot_lifespan

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def master_lifespan(app: FastAPI):
    """Orchestrates the lifecycle of all mounted microservices.
    
    By nesting the asynchronous context managers, we guarantee that if the 
    Gateway starts, all underlying ML models and database connections across 
    all apps are fully loaded. 
    """
    logger.info("Gateway starting up: Booting microservices...")
    
    try:
        # 1. Initialize Study Copilot resources
        async with copilot_lifespan(copilot_app):
            logger.info("Study Copilot resources initialized successfully.")
            
            # 2. Initialize Course Recommender resources
            async with recommender_lifespan(recommender_app):
                logger.info("Course Recommender resources initialized successfully.")
                
                logger.info("All ML models and DB connections loaded! Gateway is ready.")
                
                # 3. Yield control back to the Master Gateway to accept incoming traffic
                yield
                
    except Exception as e:
        # Catch if a specific service fails to bind its database or load its model
        logger.critical(f"Gateway failed to initialize a microservice: {e}")
        raise RuntimeError(f"Master Gateway Startup Failed: {e}")
        
    finally:
        # 4. Cleanup Phase
        # Python automatically unwinds the `async with` blocks in reverse order
        logger.info("Gateway shutting down: Microservice resources cleaned up safely.")


# Initialize the Master Gateway application
master_app = FastAPI(
    title="Master Unified AI Gateway",
    description="Centralized routing hub for all underlying AI microservices.",
    version="1.0.0",
    lifespan=master_lifespan
)

# Mount the independent microservices to specific URL paths
master_app.mount('/recommend', recommender_app)
master_app.mount('/copilot', copilot_app)


if __name__ == '__main__':
    # Run the gateway locally for development
    uvicorn.run("gateway:master_app", host="127.0.0.1", port=5171, reload=True)