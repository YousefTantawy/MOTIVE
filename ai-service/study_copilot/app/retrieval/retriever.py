"""Retrieves semantically relevant document chunks from the vector database.

This module provides the `SemanticRetriever` class, which bridges the 
embedding model and the vector store. It converts user queries into vectors 
and executes similarity searches to fetch context for the RAG pipeline.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from typing import Any, Dict, List

# 2. Local Application Imports
from study_copilot.app.ingestion.embedder import DocumentEmbedder
from study_copilot.app.ingestion.vector_store import VectorStore
from study_copilot.app.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)


class SemanticRetriever:
    """Executes semantic similarity searches against the vector database.

    This class encapsulates the retrieval logic, ensuring queries are 
    properly embedded and database results are safely parsed into a 
    standardized dictionary format for the prompt builder.
    """

    # --- Constants for Configuration and Error Handling ---
    DEFAULT_TOP_K = 5
    """The default number of context chunks to retrieve per query."""

    ERROR_INVALID_QUERY = "The search query must be a non-empty string."
    """Error raised when the retriever is passed invalid input."""

    ERROR_RETRIEVAL_FAILED = "Failed to retrieve context from Vector Database: {error}"
    """Error raised when the embedding or database query fails."""

    def __init__(self) -> None:
        """Initializes the required search components."""
        # We only need the tools to SEARCH here, not split or load.
        self.embedder = DocumentEmbedder()
        self.vector_store = VectorStore()

    def get_relevant_context(self, query: str, top_k: int = DEFAULT_TOP_K) -> List[Dict[str, Any]]:
        """Retrieves the most semantically relevant chunks for a given query.

        Args:
            query (str): The user's natural language question.
            top_k (int): The maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A formatted list of dictionaries containing 
                                  the text, metadata, and distance scores. 
                                  Returns an empty list if no matches are found.

        Raises:
            ValueError: If the query is empty or invalid.
            RuntimeError: If the database or embedding model encounters an error.
        """
        # 1. Strict Validation (Fail-Fast)
        if not query or not isinstance(query, str) or not query.strip():
            logger.error(self.ERROR_INVALID_QUERY)
            raise ValueError(self.ERROR_INVALID_QUERY)

        try:
            # 2. Generate the query embedding
            logger.debug(f"Embedding search query: '{query}'")
            # We wrap the query in a list for the embedder, then extract the first vector
            query_embedding: List[float] = self.embedder.embed_text([query])[0]
            
            # 3. Execute Vector Search
            logger.debug(f"Querying vector database for top {top_k} results...")
            results = self.vector_store.collection.query(
                query_embeddings=[query_embedding], 
                n_results=top_k
            )
            
            # 4. Safe Data Extraction (Preventing IndexErrors)
            documents = results.get("documents")
            
            # If the database returns nothing or the inner list is empty, exit gracefully
            if not documents or not documents[0]:
                logger.warning("Vector search returned zero results.")
                return []
            
            # 5. Format the Results
            formatted_results: List[Dict[str, Any]] = []
            
            # We can now safely assume index [0] exists
            for i in range(len(documents[0])):
                chunk_data = {
                    "text": documents[0][i],
                    "metadata": results["metadatas"][0][i] if "metadatas" in results else {},
                    "distance_score": results["distances"][0][i] if "distances" in results else None
                }
                formatted_results.append(chunk_data)
                    
            logger.info(f"Successfully retrieved {len(formatted_results)} context chunks.")
            return formatted_results

        except Exception as e:
            # 6. Catch, format, and escalate errors
            error_msg = self.ERROR_RETRIEVAL_FAILED.format(error=str(e))
            logger.exception(error_msg)
            raise RuntimeError(error_msg)