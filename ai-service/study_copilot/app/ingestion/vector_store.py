"""Manages vector database connections and document storage.

This module provides the `VectorStore` class, an abstraction layer over 
ChromaDB. It handles configuring either a local persistent client or a 
remote HTTP client based on application settings, and provides secure 
methods for batch-upserting embeddings.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

# 2. Third-Party Imports
import chromadb
from chromadb.config import Settings as ChromaSettings
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection

# 3. Local Application Imports
from study_copilot.app.utils.logger import setup_logging
from study_copilot.app.core.config import Settings as AppSettings

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

# Base path calculation for local database routing
BASE_ENV = Path(__file__).resolve().parent.parent.parent


class VectorStore:
    """Manages connections to ChromaDB and facilitates vector operations.

    This class provides a unified interface for storing and retrieving 
    document embeddings, abstracting away the differences between local 
    and cloud-based database deployments.
    """

    # --- Constants for Configuration and Error Handling ---
    MODE_LOCAL = "local"
    """Deployment mode for using a local SQLite-backed Chroma database."""

    MODE_CLOUD = "cloud"
    """Deployment mode for connecting to a remote ChromaDB server."""

    def __init__(self) -> None:
        """Initializes the vector store client based on configuration mode."""

        self.settings = AppSettings()
        self.collection_name: str = self.settings.COLLECTION_NAME
        
        # Determine execution mode and initialize the corresponding client
        db_mode: str = self.settings.VECTOR_DB_MODE.lower()
        
        if db_mode == self.MODE_LOCAL:
            self._init_local_client()
        elif db_mode == self.MODE_CLOUD:
            self._init_cloud_client()
        else:
            error_msg = f"Invalid VECTOR_DB_MODE: '{db_mode}'. Must be 'local' or 'cloud'."
            logger.error(error_msg)
            raise ValueError(error_msg)

    def _init_local_client(self) -> None:
        """Sets up a persistent local ChromaDB client."""
        vector_db_path = BASE_ENV / self.settings.VECTOR_DB_DIR
        
        try:
            # Ensure the target directory exists before initializing Chroma
            vector_db_path.mkdir(parents=True, exist_ok=True)
            logger.debug(f"Ensured vector database directory exists at: {vector_db_path}")
            
            self.client: ClientAPI = chromadb.PersistentClient(path=str(vector_db_path))
            self.collection: Collection = self.client.get_or_create_collection(name=self.collection_name)
            
            logger.info("Initialized local persistent vector store.")
            
        except Exception as e:
            logger.exception(f"Failed to initialize local vector store: {e}")
            raise ConnectionError(f"Failed to initialize local vector store: {e}")

    def _init_cloud_client(self) -> None:
        """Sets up an HTTP client to connect to a remote ChromaDB instance."""
        try:
            # Configure HTTP client with authentication credentials
            chroma_settings = ChromaSettings(
                chroma_client_auth_credentials=self.settings.VECTOR_DB_API_KEY
            )
            
            self.client: ClientAPI = chromadb.HttpClient(
                host=self.settings.VECTOR_DB_HOST,
                port=self.settings.VECTOR_DB_PORT,
                settings=chroma_settings
            )
            self.collection: Collection = self.client.get_or_create_collection(name=self.collection_name)
            
            logger.info("Initialized cloud-based vector store using ChromaDB.")
            
        except Exception as e:
            logger.exception(f"Failed to initialize cloud-based vector store: {e}")
            raise ConnectionError(f"Failed to initialize cloud-based vector store: {e}")

    def store_embeddings(
        self, 
        chunk_ids: List[str], 
        chunks: List[str], 
        embeddings: List[List[float]], 
        metadatas: List[Dict[str, Any]]
    ) -> None:
        """Stores document chunks, metadata, and embeddings in the vector store.

        Args:
            chunk_ids (List[str]): Unique identifiers for each text chunk.
            chunks (List[str]): The raw text content of the chunks.
            embeddings (List[List[float]]): The dense vector representations.
            metadatas (List[Dict[str, Any]]): Dictionary metadata for filtering.

        Raises:
            ValueError: If the lengths of the input lists do not match.
            RuntimeError: If the database upsert operation fails.
        """
        # 1. Exit for Empty Data
        if not chunk_ids:
            logger.warning("No chunks provided to store_embeddings. Exiting gracefully.")
            return

        # 2. Strict Data Integrity Validation (Fail-Fast)
        # Verify all input lists have the exact same length
        lengths = {len(chunk_ids), len(chunks), len(embeddings), len(metadatas)}
        if len(lengths) > 1:
            error_msg = (
                f"Data length mismatch in batch upsert: ids({len(chunk_ids)}), "
                f"chunks({len(chunks)}), embeddings({len(embeddings)}), "
                f"metadatas({len(metadatas)})."
            )
            logger.error(error_msg)
            raise ValueError(error_msg)

        # 3. Execute the Upsert Operation
        try:
            logger.debug(f"Attempting to store {len(chunk_ids)} embeddings in ChromaDB...")
            self.collection.upsert(
                ids=chunk_ids,
                documents=chunks,
                embeddings=embeddings,
                metadatas=metadatas
            )
            logger.info(f"Successfully stored {len(chunk_ids)} chunks in ChromaDB.")
            
        except Exception as e:
            # Catch DB-specific errors (e.g., timeout, connection dropped)
            logger.exception(f"Failed to store batch embeddings: {e}")
            raise RuntimeError(f"Failed to store batch embeddings: {e}")