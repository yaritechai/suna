#!/usr/bin/env python3
"""
Simple health check endpoint for deployment monitoring
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import time

app = FastAPI()

@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return JSONResponse({
        "status": "healthy",
        "timestamp": time.time(),
        "service": "yari-2-backend"
    })

@app.get("/ready")
async def readiness_check():
    """Readiness check for K8s/Docker"""
    # Add any dependency checks here if needed
    return JSONResponse({
        "status": "ready",
        "timestamp": time.time(),
        "service": "yari-2-backend"
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
