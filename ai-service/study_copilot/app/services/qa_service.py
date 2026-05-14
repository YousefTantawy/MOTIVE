"""Orchestrates the Retrieval-Augmented Generation (RAG) process.

This module provides the `QAService` class, which serves as the primary 
entry point for user queries. It coordinates the semantic retriever, 
prompt builder, and language model to produce grounded, factual answers.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from typing import Any, Dict, List

# 2. Local Application Imports
from study_copilot.app.utils.logger import setup_logging
from study_copilot.app.schemas.qa_schema import QARequest, QAResponse
from study_copilot.app.retrieval.retriever import SemanticRetriever
from study_copilot.app.generation.ollama_llm import OllamaLLM
from study_copilot.app.generation.prompt_builder import PromptBuilder

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class QAService:
    """Coordinates the retrieval and generation pipeline for QA tasks.

    This service abstracts the complex interactions between the vector 
    database, prompt engineering, and LLM inference, exposing a simple, 
    strongly-typed interface for the FastAPI routers.
    """

    # --- Constants for Fallbacks and Error Handling ---
    FALLBACK_ANSWER = "Sorry, I encountered an internal error while trying to generate the answer."
    """The safe response returned to the user if the LLM crashes during inference."""

    def __init__(self) -> None:
        """Initializes the core RAG components."""
        self.retriever = SemanticRetriever()
        self.prompt_builder = PromptBuilder() 
        self.llm = OllamaLLM()

    def answer_question(self, request: QARequest) -> QAResponse:
        """Executes the full RAG pipeline: Retrieve -> Prompt -> Generate.

        Args:
            request (QARequest): The validated user query schema.

        Returns:
            QAResponse: The final response schema containing the synthesized 
                        answer and the supporting document metadata.
        """
        logger.info(f"Processing QA request for question: '{request.question}'")
        
        # 1. Retrieve the relevant document chunks
        # If the retriever fails, it raises a RuntimeError (Fail-Fast), 
        # which should be caught and handled as a 500 error by your FastAPI router.
        retrieved_chunks: List[Dict[str, Any]] = self.retriever.get_relevant_context(request.question)
        
        # 2. Safely Extract Metadata for Citations
        # Use .get() to provide an empty dictionary fallback, preventing KeyErrors 
        # if the vector DB returns incomplete records.
        sources: List[Dict[str, Any]] = [
            chunk.get("metadata", {}) for chunk in retrieved_chunks
        ]
        
        # 3. Format the final prompt
        # The prompt builder safely handles empty contexts and invalid strings internally.
        full_prompt: str = self.prompt_builder.build_prompt(request.question, retrieved_chunks)
        
        # 4. Generate Answer via Language Model
        try:
            logger.debug("Prompt successfully constructed. Invoking LLM...")
            answer_text: str = self.llm.generate(full_prompt)
        except Exception as e:
            # We catch the LLM error here (Graceful Exit) instead of crashing, 
            # so the user still gets a well-formatted JSON response (just with an error message).
            logger.exception(f"LLM generation failed during inference: {e}")
            answer_text = self.FALLBACK_ANSWER
            
        # 5. Package the final Response using our strict Pydantic Contract
        logger.info("Successfully generated QA response.")
        return QAResponse(
            answer=answer_text,
            source_documents=sources
        )