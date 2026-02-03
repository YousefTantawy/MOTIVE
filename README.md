# 🎓 MOTIVE - Intelligent Online Learning Platform

> **ECEN424 Database Design Project**
> An advanced e-learning platform featuring real-time course management, AI-driven recommendations, and a modern interactive frontend.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **Vite** | Interactive UI with Hot Module Replacement |
| **Backend** | ![.NET](https://img.shields.io/badge/.NET%2010-512BD4?style=flat&logo=dotnet&logoColor=white) **ASP.NET Core** | High-performance REST API |
| **AI Service** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Machine Learning service for course recommendations |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-000000?style=flat&logo=mysql&logoColor=white) | Relational Data Store (Normalized Schema) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) | Containerized Monolith Architecture |

---

## 🏗️ Architecture

All services run within a unified environment sharing the same network namespace in Docker(`host` mode), ensuring zero-latency communication between the Backend API and the Database.

* **`motive-stack`**: A single robust container orchestrating:
    * `.NET Web API` (Port 5168)
    * `React Frontend` (Port 5173)
    * `Python AI Engine` (Port 5171)
    * `mySql Database` (Port 3060)
* **`motive-db`**: A dedicated MySQL 8.0 container with persistent volume storage.

---

## 🚀 Getting Started

### Prerequisites
* Docker & Docker Compose
* Git

### Installation & Running
This project is fully containerized. You do not need to install .NET, Node, or Python locally.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/YourUsername/MOTIVE.git](https://github.com/YourUsername/MOTIVE.git)
    cd MOTIVE
    ```

2.  **Launch the Application**
    ```bash
    sudo docker-compose up -d --build
    ```

3.  **Verify Running Services**
    The application uses a startup script (`run.sh`) to manage processes. Check the status:
    ```bash
    sudo docker logs motive_motive-stack_1
    ```
    In the case in which the user may want to check the logs of each service individually,
    ```bash
    sudo docker exec -it motive_motive-stack_1 bash
    screen -ls
    screen -r (id of screen)
    ```
    and to exit screen: ctrl A then D

### Access Points
| Service | URL |
| :--- | :--- |
| **Web App** | `http://localhost:5173` |
| **API Swagger** | `http://localhost:5168/swagger/index.html` |

---

## ⚡ Key Features

* **Course Discovery:** Users can browse top-rated and most recent courses.
* **AI Recommendations:** Python-based engine suggests courses based on user interests.
* **Robust Backend:** C# Architecture with Entity Framework Core and Dependency Injection.
* **Optimized Database:** Fully normalized MySQL schema (3NF) handling complex relationships.

---

## 🔧 Configuration & Troubleshooting

### Database Connection
The application is configured to run in **Host Mode**.
* **Connection String:** Uses `127.0.0.1` to access the database container directly.
* **SSL:** Disabled (`SslMode=None`) for local development compatibility.

### Common Issues
* **"Unable to Connect":** ensure the `motive-db` container is healthy (`docker ps`).
* **Database Not Ready:** On the very first run, MySQL takes ~30 seconds to initialize. If the app crashes, simply restart the stack:
    ```bash
    sudo docker-compose restart motive-stack
    ```
### Database Explanation
* [**Click here for the full Database Documentation & Schema**](https://github.com/YousefTantawy/MOTIVE/blob/main/database/databaseReadMe.md)
---

## 👥 Contributors
* **Yousef Tantawy** - Backend & DevOps
* **Amr Tarek** - Frontend
* **Omar Ashraf && Ahmed Alaa** - Database Design
* **Hassan Darwish** - Ai service

## ⚙️ Future updates
* Add more monitoring features, specifically for ai-service
* Add more DevOps related concepts
* Re-Work the backend to fit more industrial standards



