"""Constructs highly structured prompts for Large Language Models.

This module provides the `PromptBuilder` class, which is responsible for 
safely injecting user queries and retrieved database chunks into a 
strict instructional template to prevent LLM hallucinations.

Author: Hassan Darwish
Date: May 2026
"""

# 1. Standard Library Imports
import logging
from typing import Any, Dict, List

# 2. Local Application Imports
from study_copilot.app.utils.logger import setup_logging

# Initialize environment and logging
setup_logging()
logger = logging.getLogger(__name__)


class PromptBuilder:
    """Manages the assembly of context-grounded LLM prompts.

    This class enforces strict prompt formatting, ensuring the LLM is 
    given clear boundaries between the system instructions, the retrieved 
    factual context, and the user's query.
    """

    # --- Constants for Prompt Engineering ---
    CONTEXT_DIVIDER = "\n\n---\n\n"
    """The string used to clearly separate different chunks of text in the prompt."""

    TEMPLATE_SYSTEM_PROMPT = """You are a helpful, precise, and professional study assistant.
Use ONLY the following context to answer the user's question. 
If the context does not contain the answer, do not guess. Simply say: "I don't have enough information in the provided documents to answer that."

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:"""
    """The strict system instruction template to enforce RAG constraints."""

    ERROR_INVALID_QUESTION = "The question provided to the PromptBuilder must be a non-empty string."

    def __init__(self) -> None:
        """Initializes the prompt builder."""
        # No heavy instantiation required, but reserved for future tokenizers or formatters
        pass

    def build_prompt(self, question: str, chunks: List[Dict[str, Any]]) -> str:
        """Injects retrieved chunks and the user's question into the prompt template.
        
        Args:
            question (str): The user's raw question.
            chunks (List[Dict[str, Any]]): The list of dictionaries retrieved from 
                                           the vector database containing the text.
            
        Returns:
            str: The final, synthesized string ready to be sent to the LLM.
            
        Raises:
            ValueError: If the user's question is empty or invalid.
        """
        # 1. Strict Validation (Fail-Fast)
        if not question or not isinstance(question, str) or not question.strip():
            logger.error(self.ERROR_INVALID_QUESTION)
            raise ValueError(self.ERROR_INVALID_QUESTION)

        # 2. Safe Context Extraction
        valid_texts: List[str] = []
        
        if not chunks:
            logger.warning("No chunks provided to PromptBuilder. LLM will rely entirely on fallback logic.")
        else:
            for i, chunk in enumerate(chunks):
                # Use .get() to prevent KeyErrors if the vector DB schema changes
                text = chunk.get("text", "").strip()
                if text:
                    valid_texts.append(text)
                else:
                    logger.debug(f"Chunk at index {i} was missing 'text' or was empty. Skipping.")

        # 3. Assemble the Context Block
        context_text = self.CONTEXT_DIVIDER.join(valid_texts)
        
        # 4. Format and Return the Final Prompt
        logger.info(f"Successfully built prompt with {len(valid_texts)} chunks of context.")
        return self.TEMPLATE_SYSTEM_PROMPT.format(
            context=context_text, 
            question=question.strip()
        )