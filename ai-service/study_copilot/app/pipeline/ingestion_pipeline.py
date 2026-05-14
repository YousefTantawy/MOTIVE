"""Orchestrates the end-to-end document ingestion pipeline.

This module provides the `IngestionPipeline` class, which binds together 
the repository, loader, splitter, embedder, and vector database. It acts 
as the central nervous system for processing raw PDFs into searchable 
semantic vectors.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from typing import List, Dict, Any

# 2. Local Application Imports
from study_copilot.app.utils.logger import setup_logging
from study_copilot.app.data.repositories.document_repository import DocumentRepository
from study_copilot.app.ingestion.loader import DocumentLoader
from study_copilot.app.ingestion.embedder import DocumentEmbedder
from study_copilot.app.ingestion.splitter import DocumentSplitter
from study_copilot.app.ingestion.vector_store import VectorStore

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)

class IngestionPipeline:
    """Manages the lifecycle of converting documents into vector embeddings.

    This class serves as the main interface for data ingestion. It handles 
    retrieving file links, extracting markdown, chunking text, generating 
    dense vectors in batches, and upserting the final artifacts to ChromaDB.
    """

    # --- Constants for Error Handling and Logging ---
    ERROR_NO_LINK = "Ingestion aborted: No Google Drive link found for ID {doc_id}."
    """Error raised when the database has no valid file path for the given ID."""

    WARN_EMPTY_CONTENT = "Extracted content for ID {doc_id} is empty. Aborting."
    """Warning logged when a successfully downloaded PDF yields no readable text."""

    WARN_NO_CHUNKS = "No chunks generated for document ID {doc_id}. Aborting ingestion."
    """Warning logged when the text splitter returns an empty array."""

    ERROR_STORAGE_FAILED = "Pipeline failed at storage stage for document ID {doc_id}: {error}"
    """Error raised when the vector database refuses the batch upsert."""

    def __init__(self) -> None:
        """Initializes the integrated components of the ingestion pipeline."""
        self.document_repository = DocumentRepository()
        self.loader = DocumentLoader()
        self.splitter = DocumentSplitter()
        self.embedder = DocumentEmbedder()
        self.vector_store = VectorStore()
    
    def ingest_document(self, document_id: int) -> None:
        """Processes a single document through the complete vectorization pipeline.

        Args:
            document_id (int): The unique identifier of the document in the SQL database.

        Raises:
            ValueError: If the document cannot be found or text extraction fails.
            RuntimeError: If vector storage or embedding generation fails.
        """
        logger.info(f"Starting ingestion pipeline for document ID: {document_id}")
        
        # 1. Retrieve the document link from the SQL Database
        gdrive_url = self.document_repository.get_document(document_id)
        if not gdrive_url:
            error_msg = self.ERROR_NO_LINK.format(doc_id=document_id)
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        # 2. Download and Extract Text
        logger.info(f"Downloading and extracting PDF for document ID {document_id}...")
        content: str = self.loader.load_from_gdrive(gdrive_url)
        
        if not content.strip():
            logger.warning(self.WARN_EMPTY_CONTENT.format(doc_id=document_id))
            return

        # 3. Split Text into Contextual Chunks
        chunks: List[str] = self.splitter.split_text(content)
        logger.info(f"Split document ID {document_id} into {len(chunks)} chunks.")

        if not chunks:
            logger.warning(self.WARN_NO_CHUNKS.format(doc_id=document_id))
            return

        # 4. Generate Embeddings (Batch Processing)
        # We pass the entire list of chunks at once. This is significantly faster 
        # and satisfies our embedder's strict List[str] type requirement.
        logger.info("Generating embeddings in batch mode...")
        batch_embeddings: List[List[float]] = self.embedder.embed_text(chunks)

        # 5. Prepare Metadata and IDs
        batch_ids: List[str] = []
        batch_metadatas: List[Dict[str, Any]] = []

        for idx in range(len(chunks)):
            # Construct a unique, traceable ID for the vector database
            chunk_id = f"doc_{document_id}_chunk_{idx}"
            batch_ids.append(chunk_id)
            
            # Attach index and source metadata for future filtering
            batch_metadatas.append({
                "document_id": document_id,
                "chunk_index": idx
            })

        # 6. Batch Store in Vector Database
        try:
            self.vector_store.store_embeddings(
                chunk_ids=batch_ids,
                chunks=chunks,
                embeddings=batch_embeddings,
                metadatas=batch_metadatas
            )
            logger.info(f"Successfully completed ingestion pipeline for document ID: {document_id}")
            
        except Exception as e:
            # Inject both the document ID and the specific exception message into the constant
            error_msg = self.ERROR_STORAGE_FAILED.format(doc_id=document_id, error=str(e))
            logger.exception(error_msg)
            raise RuntimeError(error_msg)