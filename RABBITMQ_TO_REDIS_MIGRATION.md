# RabbitMQ to Redis Migration Guide

## Overview
We've switched from RabbitMQ to Redis for background task processing to resolve deployment issues on Render and simplify the architecture.

## What Changed
- **Before**: Dramatiq used RabbitMQ broker for background tasks
- **After**: Dramatiq uses Redis broker for background tasks
- **Benefit**: Single Redis instance handles both caching AND task queue

## Files Modified
- `backend/run_agent_background.py` - Switch from RabbitMQ to Redis broker
- `backend/docker-compose.yml` - Remove RabbitMQ dependencies  
- `docker-compose.yaml` - Remove RabbitMQ dependencies
- `backend/RENDER_DEPLOYMENT.md` - Updated deployment guide

## Immediate Actions Needed

### 1. For Render Deployment
If you have existing services on Render:

1. **Remove RabbitMQ environment variables** from your Render service:
   - `RABBITMQ_HOST`
   - `RABBITMQ_PORT`
   - `RABBITMQ_USER` (if set)
   - `RABBITMQ_PASSWORD` (if set)

2. **Ensure Redis is configured** (these should already exist):
   - `REDIS_HOST` - your Redis Cloud/Upstash host
   - `REDIS_PORT` - typically 6379
   - `REDIS_PASSWORD` - your Redis password
   - `REDIS_SSL` - set to true for cloud Redis

3. **Delete any RabbitMQ/CloudAMQP services** from Render dashboard

4. **Redeploy your services** - this will pick up the new Redis-based code

### 2. For Local Development
If you're running locally:

1. **Option A: Use updated docker-compose** (recommended)
   ```bash
   cd backend
   docker compose down
   docker compose up --build
   ```
   RabbitMQ will still be available but won't be used.

2. **Option B: Run Redis-only services**
   ```bash
   cd backend
   docker compose up redis  # Only start Redis
   ```
   Then run API and worker manually:
   ```bash
   python api.py  # In one terminal
   python -m dramatiq run_agent_background  # In another terminal
   ```

## Expected Results

### Before Migration (RabbitMQ Error)
```
2025-06-10 01:04:51 File "/usr/local/lib/python3.11/site-packages/dramatiq/brokers/rabbitmq.py", line 163, in channel
2025-06-10 01:04:51 channel = self.state.channel = self.connection.channel()
```

### After Migration (Should Work)
```
2025-06-10 01:04:51 Starting background agent run: xyz for thread: abc
2025-06-10 01:04:51 🚀 Using model: claude-3-5-sonnet-20241022
```

## Testing the Fix

1. **Deploy the updated code** to Render
2. **Test agent initialization** by:
   - Creating a new agent conversation
   - Checking logs for successful agent startup
   - Verifying no RabbitMQ connection errors

3. **Monitor for success patterns**:
   - `Redis connection initialized successfully`
   - `Starting background agent run:`
   - No `RabbitMQ` or `connection.channel()` errors

## Rollback Plan (if needed)

If for any reason you need to rollback:

1. **Revert the file changes**:
   ```bash
   git checkout HEAD~1 backend/run_agent_background.py
   ```

2. **Re-add RabbitMQ environment variables** to Render

3. **Set up CloudAMQP** service again

But the Redis solution should be more reliable for cloud deployment.

## Benefits of This Change

1. **Simplified Architecture**: One Redis instance instead of Redis + RabbitMQ
2. **Reduced Costs**: No need for separate RabbitMQ/CloudAMQP service
3. **Better Render Compatibility**: Redis cloud services are more reliable
4. **Easier Local Development**: Fewer services to manage
5. **Same Functionality**: All background processing still works

## Support

If you encounter any issues:
1. Check Render logs for Redis connection messages
2. Verify Redis credentials are correct
3. Ensure Redis service is accessible from Render
4. Test locally first if needed

The agent initialization errors should be completely resolved after this migration. 