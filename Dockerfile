# Simple backend-only deployment
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Expose backend port
EXPOSE 8000

# Create simple startup script
RUN echo '#!/bin/bash\n\
echo "🚀 Starting Yari 2 Backend..."\n\
echo "📡 Backend running on port 8000"\n\
python api.py\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start backend
CMD ["/app/start.sh"] 