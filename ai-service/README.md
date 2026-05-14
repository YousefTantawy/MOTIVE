# Unified AI Learning Platform — Backend

A FastAPI-based backend composed of two independent AI microservices, unified under a single gateway. The platform provides intelligent course recommendations and a document-grounded study assistant, both served from one entry point.

---

## Architecture Overview

```
Gateway (port 5171)
├── /recommend  →  Course Recommender Microservice
└── /copilot    →  Study Copilot Microservice
```

The gateway orchestrates the startup and shutdown lifecycles of both services, ensuring all ML models and database connections are fully initialized before the server begins accepting traffic.

---

## Microservices

### Course Recommender (`/recommend`)

A content-based recommendation engine that suggests courses a user hasn't enrolled in yet, based on the semantic similarity of their current course history.

**How it works:**

1. **Embedding Pipeline** — Course titles and descriptions are fetched from MySQL, preprocessed, and encoded into dense vectors using `all-MiniLM-L6-v2` (via `sentence-transformers`). The resulting artifact is serialized to disk with `joblib`.
2. **User Profile** — At inference time, the enrolled courses' vectors are averaged into a single user profile vector via mean pooling.
3. **Recommendation** — Cosine similarity is computed between the user profile and all course vectors. The top results (up to 8) that the user isn't already enrolled in are returned.
4. **Cold Start** — Users with no enrollment history receive an empty list with a `cold_start` status rather than an error.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/recommend/get-ids` | Returns recommended course IDs for a given user |

**Request body:**
```json
{ "user_id": 42 }
```

**Response:**
```json
{
  "status": "success",
  "recommended_ids": [12, 7, 31, 5, 19, 2, 44, 9]
}
```

---

### Study Copilot (`/copilot`)

A Retrieval-Augmented Generation (RAG) system that answers student questions grounded in uploaded course documents. It will not hallucinate — if the context doesn't contain the answer, it says so.

**How it works:**

1. **Ingestion Pipeline** — PDFs are downloaded from Google Drive, extracted to Markdown via `pymupdf4llm`, split into overlapping chunks, embedded, and stored in ChromaDB.
2. **Retrieval** — The user's question is embedded and a cosine similarity search retrieves the top-K most relevant chunks from the vector store.
3. **Generation** — Retrieved chunks are injected into a strict prompt template alongside the question, then sent to a local Ollama LLM (default: `llama3`) for synthesis.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/copilot/get-answer` | Returns an AI-generated answer grounded in document context |

**Request body:**
```json
{ "question": "What are the prerequisites for Advanced Calculus?" }
```

**Response:**
```json
{
  "answer": "To enroll in Advanced Calculus, you must first complete Linear Algebra.",
  "source_documents": [
    { "document_id": 105, "chunk_index": 4 }
  ]
}
```

---

## Project Structure

```
.
├── gateway.py                          # Master gateway — mounts all microservices
├── Dockerfile
├── requirements.txt
│
├── course_recommender/
│   ├── artifacts/                      # Serialized .joblib embedding artifacts
│   └── src/
│       ├── router.py                   # FastAPI app + dependency injection
│       ├── model/
│       │   └── course_recommender.py   # Embedding generation & cosine similarity
│       ├── preprocessor/
│       │   └── course_preprocessor.py  # Text cleaning & feature engineering
│       ├── pipelines/
│       │   └── train_pipeline.py       # End-to-end embedding generation pipeline
│       ├── data/
│       │   └── db_connection.py        # MySQL connector
│       └── utils/
│           └── logger.py
│
└── study_copilot/
    └── app/
        ├── api/
        │   └── router.py               # FastAPI app + dependency injection
        ├── core/
        │   └── config.py               # Pydantic settings (loaded from .env)
        ├── ingestion/
        │   ├── loader.py               # Google Drive PDF downloader
        │   ├── splitter.py             # Markdown text chunker
        │   ├── embedder.py             # Sentence transformer embedder
        │   └── vector_store.py         # ChromaDB client (local or cloud)
        ├── pipeline/
        │   └── ingestion_pipeline.py   # End-to-end document ingestion
        ├── retrieval/
        │   └── retriever.py            # Semantic similarity search
        ├── generation/
        │   ├── base_llm.py             # Abstract LLM interface
        │   ├── ollama_llm.py           # Ollama/LangChain implementation
        │   └── prompt_builder.py       # RAG prompt assembly
        ├── services/
        │   └── qa_service.py           # Retrieve → Prompt → Generate orchestrator
        ├── schemas/
        │   └── qa_schema.py            # Pydantic request/response models
        └── utils/
            └── logger.py
```

---

## Setup & Configuration

### Prerequisites

- Python 3.10+
- A running MySQL instance (for the Course Recommender)
- A running [Ollama](https://ollama.com/) instance with `llama3` pulled (`ollama pull llama3`)
- Docker (optional, for containerized deployment)

### Environment Variables

Create a `.env` file in the project root. All variables are optional with sensible defaults unless marked required.

```env
# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# MySQL (required for Course Recommender)
DB_HOST=localhost
DB_USER=your_user
DB_NAME=your_database
DB_PASSWORD=your_password

# Vector Database
VECTOR_DB_MODE=local           # "local" or "cloud"
VECTOR_DB_DIR=data/vector_store
COLLECTION_NAME=document_embeddings

# ChromaDB Cloud (required only if VECTOR_DB_MODE=cloud)
VECTOR_DB_HOST=
VECTOR_DB_PORT=
VECTOR_DB_API_KEY=

# Embedding Model
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2

# Document Chunking
CHUNK_SIZE=1000
CHUNK_OVERLAP=50

# LLM
LLM_MODEL_NAME=llama3
LLM_HOST=http://localhost:11434
```

### Local Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd <repo-directory>

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your values

# 5. Generate course embeddings (run once, or whenever the catalog changes)
python -m course_recommender.src.pipelines.train_pipeline

# 6. Start the gateway
uvicorn gateway:master_app --host 0.0.0.0 --port 5171 --reload
```

### Docker

```bash
# Build the image
docker build -t ai-learning-platform .

# Run the container
docker run -p 5171:5171 --env-file .env ai-learning-platform
```

---

## Running Tests

```bash
pytest
```

Tests use `pytest.ini` at the project root to set `pythonpath = .`, ensuring all local imports resolve correctly.

---

## Ingesting a Document (Study Copilot)

Before the Study Copilot can answer questions, documents must be ingested into the vector store. Use the `IngestionPipeline` directly:

```python
from study_copilot.app.pipeline.ingestion_pipeline import IngestionPipeline

pipeline = IngestionPipeline()
pipeline.ingest_document(document_id=1)  # ID must exist in your SQL documents table
```

The pipeline will download the associated PDF from Google Drive, chunk it, embed it, and store it in ChromaDB automatically.

---

## Interactive API Docs

Once the gateway is running, FastAPI's auto-generated documentation is available at:

- **Gateway:** `http://localhost:5171/docs`
- **Course Recommender:** `http://localhost:5171/recommend/docs`
- **Study Copilot:** `http://localhost:5171/copilot/docs`

---

## Author

Hassan Darwish — May 2026
