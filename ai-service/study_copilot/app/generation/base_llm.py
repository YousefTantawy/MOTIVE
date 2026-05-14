"""Defines the abstract interface for Large Language Model integrations.

This module provides the `BaseLLM` abstract base class, establishing a 
strict contract that all concrete LLM implementations (e.g., Ollama, 
OpenAI, Anthropic) must follow. This ensures the rest of the application 
remains decoupled from any specific model provider.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
from abc import ABC, abstractmethod


class BaseLLM(ABC):
    """Abstract Base Class defining the standard contract for LLM generation.

    By programming against this interface rather than a concrete class, 
    the `QAService` and other orchestrators can easily swap out different 
    language models without altering their core logic.
    """

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Synchronously generates a text response based on the provided prompt.

        Concrete subclasses must implement the specific network calls, 
        authentication, and error handling required for their respective 
        model providers inside this method.

        Args:
            prompt (str): The fully assembled context and user query.

        Returns:
            str: The synthesized text response from the language model.

        Raises:
            NotImplementedError: If a subclass fails to implement this method.
        """
        raise NotImplementedError("Subclasses must implement the generate() method.")