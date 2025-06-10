# Render Two-Service Deployment Guide

## Problem: Background Tasks Not Executing

If your agent initialization works but responses never come back (stuck on "Yari is thinking..."), you need **two separate services** on Render:

1. **API Service** - Handles HTTP requests
2. **Worker Service** - Processes background tasks via Dramatiq

## Quick Setup

### 1. Create API Service
- **Type**: Web Service
- **Dockerfile Path**: `Dockerfile.render`
- **Port**: 8000
- **Environment Variables**: (your existing Redis, Supabase, LLM keys)

### 2. Create Worker Service  
- **Type**: Background Worker
- **Dockerfile Path**: `Dockerfile.render.worker`
- **Environment Variables**: (same as API service)

### 3. Environment Variables (Both Services)

```env
# Redis (required for both services)
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_SSL=true

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# LLM APIs
ANTHROPIC_API_KEY=your-anthropic-key
MODEL_TO_USE=anthropic/claude-3-5-sonnet-latest

# Daytona
DAYTONA_API_KEY=your-daytona-key
DAYTONA_SERVER_URL=your-daytona-server
DAYTONA_TARGET=your-daytona-target

# Environment
ENV_MODE=production
LOG_LEVEL=INFO
```

## Expected Results

**Before (Single Service)**:
- ✅ Agent initiation works (200)
- ✅ Stream connects (200)  
- ❌ No responses (background task never executes)

**After (Two Services)**:
- ✅ Agent initiation works (200)
- ✅ Stream connects (200)
- ✅ **Background worker processes tasks**
- ✅ **Agent responses stream back**

## Verification

1. **Check worker logs** for "Starting background agent run"
2. **Test debug endpoint**: `https://your-api.onrender.com/api/agent/debug/env`
3. **Send test message**: Should get actual responses, not just "thinking..."

## Architecture

```
User Request → API Service → Redis Queue → Worker Service → Agent Execution → Redis Responses → API Service → User
```

Both services share the same Redis instance for task coordination.

## Troubleshooting

**Worker not starting:**
- Check Dockerfile.render.worker exists
- Verify all environment variables are set on worker service
- Check worker logs for import errors

**Tasks not processing:**
- Verify Redis connection on both services
- Check that both services use same Redis credentials
- Monitor Redis queue size

**Still no responses:**
- Test Redis connection: `curl https://your-api.onrender.com/api/agent/debug/env`
- Check Daytona configuration for agent execution environment
- Verify LLM API keys are working 