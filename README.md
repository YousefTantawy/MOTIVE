# MOTIVE - Intelligent Online Learning Platform

> **ECEN424 Database Design Project**
> An advanced e-learning platform featuring real-time course management, AI-driven recommendations, and a modern interactive frontend.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **Vite** | Interactive UI with Hot Module Replacement |
| **Backend** | ![.NET](https://img.shields.io/badge/.NET%2010-512BD4?style=flat&logo=dotnet&logoColor=white) **ASP.NET Core** | High-performance REST API |
| **AI Service** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **FastAPI** | Course recommendations + RAG study assistant |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-000000?style=flat&logo=mysql&logoColor=white) | Relational data store (normalized schema) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | Multi-container bridge network via Docker Compose |

---

## Architecture

Services run as isolated containers connected through Docker's bridge network. Each service communicates using its container name as a hostname — no hardcoded IPs.

```
motive-network (bridge)
├── motive-frontend   → port 5173
├── motive-backend    → port 5168
├── motive-ai         → port 5171
└── motive-db         → port 3306
```

**Communication flow:**
- Browser → `motive-frontend:5173`
- Frontend (browser) → `motive-backend:5168`
- Backend → `motive-db:3306` (via service name)
- Backend → `motive-ai:5171` (via service name)

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Git

### Installation & Running

1. **Clone the repository**
    ```bash
    git clone https://github.com/YousefTantawy/MOTIVE
    cd MOTIVE
    ```

2. **Launch all services**
    ```bash
    DOCKER_BUILDKIT=1 docker compose up --build
    ```
    > `DOCKER_BUILDKIT=1` enables pip layer caching — packages are only downloaded once even if dependencies change.

3. **Wait for startup**

    The AI service downloads the embedding model on first run (~90MB). Watch for:
    ```
    motive-ai | INFO: Application startup complete.
    ```
    before hitting the recommendations endpoint.

### Access Points

| Service | URL |
| :--- | :--- |
| **Web App** | `http://localhost:5173` |
| **API Swagger** | `http://localhost:5168/swagger/index.html` |
| **AI Docs** | `http://localhost:5171/docs` |

---

## Key Features

- **Course Discovery:** Browse trending, recently added, best-selling, and top-rated courses.
- **AI Recommendations:** Semantic similarity engine suggests courses based on enrollment history.
- **Study Copilot:** RAG-based assistant that answers questions grounded in course documents.
- **Robust Backend:** ASP.NET Core with Entity Framework Core and dependency injection.
- **Optimized Database:** Fully normalized MySQL schema (3NF) with pre-built views for performance.

---

## Configuration

All service configuration is handled through `docker-compose.yml` environment variables. No `.env` files are needed to run the stack.

| Variable | Service | Description |
| :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | backend | MySQL connection string |
| `AiService__BaseUrl` | backend | AI service base URL |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | ai | MySQL credentials for the AI service |

---

## Troubleshooting

**"Connection refused" on first load**
The AI service takes ~30–60s to initialize on first boot (model loading). Refresh after it fully starts.

**Database not ready**
On the very first run, MySQL takes ~20s to initialize the schema. The backend and AI service will wait automatically via healthcheck — no manual restart needed.

**Rebuild without re-downloading packages**
```bash
DOCKER_BUILDKIT=1 docker compose up --build
```
Subsequent builds use the host pip cache and skip re-downloading.

---

## Database

- [Full Database Documentation & Schema](https://github.com/YousefTantawy/MOTIVE/blob/main/database/databaseReadMe.md)

---

## Contributors

- **Yousef Tantawy** — Backend & DevOps
- **Amr Tarek** — Frontend
- **Omar Ashraf & Ahmed Alaa** — Database Design
- **Hassan Darwish** — AI Service

---

## Future Updates

- Add healthcheck dependency so backend waits for AI service before accepting traffic
- Implement JWT authentication
- Add monitoring and observability for the AI service
- Rework backend to fit more industrial standards
