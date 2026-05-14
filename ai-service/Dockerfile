# 1. Base Image: Use Python 3.10 slim for a lightweight, secure foundation
FROM python:3.10-slim

# 2. Environment Variables: Optimize Python and Pip for containers
# Grouping these into a single ENV command reduces the number of image layers
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 3. Work Directory: Set the default execution context
WORKDIR /app

# 4. System Dependencies: Install compilers and clean up in a single layer
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. Dependency Installation: Leverage Docker layer caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# 6. Least Privilege Security: Create a non-root user and group
# This is a critical security measure to prevent container breakout attacks
RUN addgroup --system appgroup && adduser --system --group appuser

# 7. Source Code: Copy the application code and transfer ownership to the new user
COPY --chown=appuser:appgroup . .

# 8. Switch User: Ensure all subsequent commands (like CMD) run as the unprivileged user
USER appuser

# 9. Network: Expose the designated Gateway port
EXPOSE 5171

# 10. Entrypoint: Bind to 0.0.0.0 so the container can receive external traffic
CMD ["uvicorn", "gateway:master_app", "--host", "0.0.0.0", "--port", "5171"]