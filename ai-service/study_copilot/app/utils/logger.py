import logging
from pathlib import Path

def setup_logging(log_file: str = "logs/app.log"):
    """Configures the logger to show output in terminal and save to a file."""
    Path("logs").mkdir(exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(), 
            logging.FileHandler(log_file)
        ]
    )