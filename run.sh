#!/bin/bash

# --- CONFIGURATION ---

# Adjust these folder names if yours are different

BACKEND_DIR="backend"

FRONTEND_DIR="frontend"

AI_DIR="ai-service"

# Ports (Must match what you opened in Azure!)

BACKEND_PORT="5168"

AI_PORT="5171"

FRONTEND_PORT="5173"

echo "--------------------------------------------------"

echo "🚀 Starting Motive Project Servers..."

echo "--------------------------------------------------"

# 1. Kill any existing sessions to prevent duplicates

# (Optional: remove these lines if you want multiple instances)

git pull

screen -X -S motive-backend quit > /dev/null 2>&1

screen -X -S motive-frontend quit > /dev/null 2>&1

screen -X -S motive-ai quit > /dev/null 2>&1

# 2. Start Backend in a detached screen

echo "Starting Backend on port $BACKEND_PORT..."

screen -dmS motive-backend bash -c "cd $BACKEND_DIR && dotnet run --urls 'http://0.0.0.0:$BACKEND_PORT'; exec bash"

# 3. Start Frontend in a detached screen

# Note: We pass --host to expose it to the internet

echo "Starting Frontend on port $FRONTEND_PORT..."

screen -dmS motive-frontend bash -c "cd $FRONTEND_DIR && npm install && npm run dev -- --host --port $FRONTEND_PORT; exec bash"

# 4. Start ai-service

echo "Starting Ai-service on port $AI_PORT..."

screen -dmS motive-ai bash -c "cd $AI_DIR && python3 recommendation_service.py; exec bash"

echo "--------------------------------------------------"

echo "Servers are running!"

echo "--------------------------------------------------"

echo "To view logs, type:"

echo "  screen -r motive-backend"

echo "  screen -r motive-frontend"

echo "  screen -r motive-ai"

echo "To detach again, press: Ctrl+A, then D"
