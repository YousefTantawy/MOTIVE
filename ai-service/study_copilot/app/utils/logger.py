"""Configures centralized logging for the application.

This module provides the `setup_logging` utility, which establishes a 
standardized format for all application logs. It configures both console 
output (for real-time development) and file-based output (for audit trails 
and debugging).

Author: Hassan Darwish
Date: February 2026
"""

import logging
from pathlib import Path
from typing import Union
from study_copilot.app.core.config import get_settings

# --- load settings ---
settings = get_settings()

LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
"""The standardized layout string for all log messages."""

def setup_logging(log_file_override: Union[str, Path, None] = None) -> None:
    """Initializes the global logging configuration.

    This function ensures that the target directory for the log file exists,
    and then configures the root logger to output messages of the set level modified by the config file
    and above to both the terminal and the specified file.

    Args:
        log_file_override (Union[str, Path, None]): The destination file path for the logs.

    Raises:
        PermissionError: If the application lacks permissions to create the 
                         log directory or write to the file.
    """
    # 1. Standardize the input into a Path object
    log_path = Path(log_file_override or settings.LOG_FILE)
    
    # 2. Dynamic Directory Creation
    # Extract the parent directory from the log file path and ensure it exists.
    # This prevents crashes if a custom path like "custom_logs/api/run.log" is provided.
    log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 3. Configure the root logger
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=LOG_FORMAT,
        handlers=[
            # Output to the terminal for real-time monitoring
            logging.StreamHandler(), 
            
            # Output to the file for historical tracking
            logging.FileHandler(log_path, encoding='utf-8')
        ]
    )