"""Generates dense vector embeddings from text chunks.

This module provides the `DocumentEmbedder` class, which utilizes
pre-trained HuggingFace sentence transformer models to convert lists of 
text chunks into high-dimensional numerical vectors for semantic search.

Author: Hassan Darwish
Date: April 2026
"""

import logging
from typing import List
from sentence_transformers import SentenceTransformer
from study_copilot.app.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)


class DocumentEmbedder:
    """Handles the conversion of text chunks into semantic embeddings.

    This class encapsulates the embedding model, managing its initialization 
    and providing a robust interface to process batches of text into vectors.
    """

    # --- Constants for Configuration and Error Handling ---
    DEFAULT_MODEL_NAME = 'all-MiniLM-L6-v2'
    """The default lightweight transformer model used for generating embeddings."""

    ERROR_INVALID_TYPE = "Invalid input type. Expected a list of strings."
    """Error message raised when a non-list object is passed to the embedder."""

    def __init__(self, model_name: str = DEFAULT_MODEL_NAME) -> None:
        """Initializes the embedder and loads the specified transformer model.

        Args:
            model_name (str): The HuggingFace model identifier to load.
        """
        logger.info(f"Loading embedding model: {model_name}...")
        self.model_name = model_name
        self.model = SentenceTransformer(self.model_name)
        logger.info("Embedding model loaded successfully.")

    def embed_text(self, chunks: List[str]) -> List[List[float]]:
        """Generates vector embeddings for a list of text chunks.

        Args:
            chunks (List[str]): A list of string chunks to be embedded.

        Returns:
            List[List[float]]: A matrix (list of lists) containing the 
                               vector embeddings for each chunk. Returns 
                               an empty list if the input is empty.

        Raises:
            ValueError: If the input is not a list.
            RuntimeError: If the embedding model fails during encoding.
        """
        # 1. Strict Type Validation (Fail-Fast)
        if not isinstance(chunks, list):
            logger.error(f"{self.ERROR_INVALID_TYPE} Got: {type(chunks)}")
            raise ValueError(self.ERROR_INVALID_TYPE)

        # 2. Graceful Exit for Empty Data
        if len(chunks) == 0:
            logger.warning("No chunks provided for embedding. Returning empty list.")
            return []

        # 3. Execute the Embedding Operation
        try:
            logger.debug(f"Generating embeddings for {len(chunks)} chunks...")
            
            # The encode method returns a numpy array/tensor, which we convert to a native list
            embeddings_array = self.model.encode(chunks)
            embeddings_list: List[List[float]] = embeddings_array.tolist()
            
            logger.info(f"Successfully generated embeddings for {len(chunks)} chunks.")
            return embeddings_list

        except Exception as e:
            # 4. Catch and escalate unexpected model/memory failures
            logger.exception(f"An error occurred during embedding generation: {e}")
            raise RuntimeError(f"Embedding process failed: {e}")