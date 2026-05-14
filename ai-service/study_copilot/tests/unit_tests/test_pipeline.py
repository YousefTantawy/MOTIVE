import pytest
from unittest.mock import MagicMock
from study_copilot.app.pipeline.ingestion_pipeline import IngestionPipeline

def test_ingestion_pipeline_batching():
    # 1. Setup: Instantiate the pipeline
    pipeline = IngestionPipeline()
    
    # 2. Mocking: Replace the real classes with fake objects that return hardcoded data
    pipeline.document_repository.get_document = MagicMock(return_value={"id": 1, "name": "test.pdf"})
    pipeline.loader.load_from_gdrive = MagicMock(return_value="This is a long text " * 100)
    
    # Fake 3 chunks
    pipeline.splitter.split_text = MagicMock(return_value=["Chunk 1", "Chunk 2", "Chunk 3"])
    
    # Fake embeddings (lists of floats)
    pipeline.embedder.embed_text = MagicMock(return_value=[0.1, 0.2, 0.3])
    
    # Spy on the vector store to see what was passed to it
    pipeline.vector_store.store_embeddings = MagicMock()

    # 3. Execution: Run the method
    pipeline.ingest_document(document_id=1)

    # 4. Assertion: Did the code behave correctly?
    # Check that the database was called exactly once (Batching is working!)
    pipeline.vector_store.store_embeddings.assert_called_once()
    
    # Extract the arguments passed to the database
    called_args = pipeline.vector_store.store_embeddings.call_args.kwargs
    
    # Prove that the fail-fast length validation won't trigger
    assert len(called_args['chunk_ids']) == 3
    assert len(called_args['chunks']) == 3
    assert len(called_args['embeddings']) == 3
    assert len(called_args['metadatas']) == 3