# 1. Start with the .NET 10 SDK (Linux)
FROM mcr.microsoft.com/dotnet/sdk:10.0

# 2. Install Node.js 24 and 'screen' (needed for your run.sh)
RUN apt-get update && \
    apt-get install -y curl screen python3 python3-pip python3-venv && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs

# 3. Set the working directory
WORKDIR /app

# 4. Copy all your files into the container
COPY . .

# 5. Give permission to execute your script
RUN chmod +x run.sh

# 6. Expose the ports for Backend and Frontend
EXPOSE 5168
EXPOSE 5173
EXPOSE 5171

# 7. Run your script and keep the container alive
CMD ./run.sh && tail -f /dev/null
