"""Centralized application configuration management.

This module provides the `Settings` class, which leverages Pydantic 
to securely load, validate, and manage environment variables and 
application configurations from a `.env` file.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
from functools import lru_cache
from pathlib import Path

# 2. Third-Party Imports
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application configuration schema and default values.

    Pydantic automatically reads from the system environment and the 
    specified `.env` file to populate these fields. If a variable is 
    not found, the safe fallbacks defined here are used.
    """

# --- Logging Configuration ---
    LOG_LEVEL: str = "INFO"
    """The threshold for logging output (e.g., 'DEBUG', 'INFO', 'WARNING')."""
    
    LOG_FILE: Path = Path("logs/app.log")
    """The file path where application logs will be saved."""
    
    # --- Relational Database Configuration ---
    DB_HOST: str | None = None
    """The hostname or IP address of the relational database."""
    
    DB_USER: str | None = None
    """The username for database authentication."""
    
    DB_NAME: str | None = None
    """The specific name of the primary database to connect to."""
    
    DB_PASSWORD: str | None = None 
    """The secret password for database authentication."""
    
    # --- Vector Database Configuration ---
    VECTOR_DB_MODE: str = 'local'
    """Deployment mode for ChromaDB. Must be 'local' or 'cloud'."""

    VECTOR_DB_DIR: Path = Path('data/vector_store')
    """Relative path for local persistent storage."""

    COLLECTION_NAME: str = 'document_embeddings'
    """The namespace used within the vector database."""

    # --- Cloud Database Conditionals ---
    # Using modern Python 3.10 union syntax (Type | None)
    VECTOR_DB_HOST: str | None = None
    """Remote host address (Required if mode is 'cloud')."""

    VECTOR_DB_PORT: int | None = None
    """Remote host port (Required if mode is 'cloud')."""

    VECTOR_DB_API_KEY: str | None = None
    """Authentication token for the remote database."""

    # --- Embedding Model Configuration ---
    EMBEDDING_MODEL_NAME: str = 'all-MiniLM-L6-v2'
    """The HuggingFace transformer model used for semantic embeddings."""

    # --- Document Splitting Configuration ---
    CHUNK_SIZE: int = 1000
    """Maximum character count for a single document chunk."""

    CHUNK_OVERLAP: int = 50
    """Number of characters to overlap between consecutive chunks."""

    # --- LLM Engine Configuration ---
    LLM_MODEL_NAME: str = 'llama3'
    """The specific language model to be invoked (e.g., 'llama3')."""
    
    LLM_HOST: str = "http://localhost:11434"
    """The URL where the local or remote LLM service is hosted."""

    # --- Pydantic Configuration ---
    # model_config instructs Pydantic on how to load external variables
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """Retrieves a cached instance of the application settings.
    
    Using lru_cache ensures the .env file is only parsed once from disk, 
    improving performance while guaranteeing a singleton settings instance.
    
    Returns:
        Settings: The validated application configuration object.
    """
    return Settings()