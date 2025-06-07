# Multi-stage build: Frontend first
FROM node:18-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Main stage: Python backend with built frontend
FROM python:3.11-slim

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/.next ./frontend/.next
COPY --from=frontend-build /frontend/public ./frontend/public
COPY --from=frontend-build /frontend/package*.json ./frontend/
COPY --from=frontend-build /frontend/node_modules ./frontend/node_modules

# Install Node.js in the Python container to run the frontend
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Expose ports
EXPOSE 8000 3000

# Create startup script
RUN echo '#!/bin/bash\n\
cd /app/frontend && npm start &\n\
cd /app && python api.py\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"] 