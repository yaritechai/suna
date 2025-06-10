# Suna Backend Deployment Guide for Render

This guide helps you deploy the Suna backend to Render successfully.

## Key Changes Made to Match Original Suna

Your Dockerfile has been updated to match the original Suna repository exactly, with these optimizations for Render:

1. **Dockerfile Structure**: Now matches the original Suna Dockerfile exactly
2. **Worker Configuration**: Reduced from 33 to 2 workers for Render's typical 1-2 vCPU instances  
3. **Gunicorn Installation**: Added explicit gunicorn dependency to requirements.txt
4. **Configuration**: Kept all original optimization flags but with conservative resource limits
5. **Resource Settings**: Optimized for cloud deployment instead of 16-vCPU dedicated server
6. **Task Queue**: **Updated to use Redis for background tasks instead of RabbitMQ**

## Prerequisites

Before deploying to Render, you need to set up external services since Render doesn't support docker-compose with multiple services.

### Required External Services

1. **Redis** (for caching, pub/sub, and background task queue)
   - Use [Redis Cloud](https://redis.com/redis-enterprise-cloud/) (free tier available)
   - Or [Upstash Redis](https://upstash.com/redis) (serverless)
   - **Note**: Redis now handles both caching AND background task processing

2. **Supabase** (database)
   - Already configured in the original setup

**RabbitMQ is no longer required** - we've switched to Redis for all messaging needs.

## Deployment Steps

### 1. Setup External Redis

#### Option A: Redis Cloud
1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a free database
3. Note down the connection details:
   - Host: `redis-xxxxx.c1.us-east-1-1.ec2.cloud.redislabs.com`
   - Port: `6379`
   - Password: `your-password`

#### Option B: Upstash Redis
1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Note down the connection details

### 2. Deploy to Render

1. Connect your GitHub repository to Render
2. Choose "Web Service"
3. Use these settings:
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Start Command**: Leave empty (uses Dockerfile CMD)
   - **Dockerfile Path**: `Dockerfile.render`

### 3. Environment Variables

Add these environment variables in Render dashboard:

#### Required Variables
```env
# Environment
ENV_MODE=production
LOG_LEVEL=INFO

# Database (Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Redis (external service - handles both caching and task queue)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_SSL=true

# LLM APIs
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Daytona (for agent execution)
DAYTONA_API_KEY=your-daytona-key
DAYTONA_SERVER_URL=your-daytona-server
DAYTONA_TARGET=your-daytona-target
```

#### Optional Variables
```env
# Additional LLM providers
OPENROUTER_API_KEY=your-openrouter-key
GROQ_API_KEY=your-groq-key

# Search and scraping
TAVILY_API_KEY=your-tavily-key
FIRECRAWL_API_KEY=your-firecrawl-key

# Payments
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Monitoring
LANGFUSE_PUBLIC_KEY=your-langfuse-public-key
LANGFUSE_SECRET_KEY=your-langfuse-secret-key
```

## Configuration Options

### Option 1: Full Setup (Recommended)
- Set up Redis Cloud for caching, pub/sub, and background workers
- Deploy both API and worker services
- **No RabbitMQ needed**

### Option 2: Simplified Setup (API Only)
- Set up Redis Cloud for basic caching and task processing
- Deploy only the API service with built-in worker
- **No RabbitMQ needed**

### Option 3: Minimal Setup (No External Services)
- The application will run with degraded functionality
- Redis operations will fail gracefully
- No background processing

## Recent Changes (Important for Existing Deployments)

**Breaking Change**: We've switched from RabbitMQ to Redis for background task processing.

If you have an existing deployment:
1. **Remove RabbitMQ service** from your Render services
2. **Remove these environment variables**:
   - `RABBITMQ_HOST`
   - `RABBITMQ_PORT`  
   - `RABBITMQ_USER`
   - `RABBITMQ_PASSWORD`
3. **Ensure Redis is properly configured** - it now handles both caching AND task queue
4. **Redeploy your services** with the updated code

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   ```
   Failed to initialize Redis connection
   ```
   - Check Redis host, port, and password
   - Ensure SSL is enabled for cloud Redis providers
   - Verify Redis instance is accessible from Render

2. **Agent Initialization Failed** (Previous RabbitMQ Error)
   ```
   RabbitMQ connection failed
   ```
   - **Fixed**: This error should no longer occur after switching to Redis
   - If you still see RabbitMQ errors, ensure you've redeployed with the latest code

3. **Health Check Failing**
   ```
   Health check timeout
   ```
   - Check if all required environment variables are set
   - Review application logs in Render dashboard
   - Verify Supabase connection

4. **High Memory Usage**
   ```
   Worker killed due to memory usage
   ```
   - Reduce worker count in Dockerfile.render
   - Upgrade Render plan for more memory

### Log Analysis

Check Render logs for these patterns:
- `Starting up FastAPI application` - App startup
- `Redis connection initialized successfully` - Redis OK
- `Health check endpoint called` - Health checks working
- **No more RabbitMQ connection messages**

## Performance Optimization

### For Better Performance on Render:

1. **Use the optimized Dockerfile.render**
   - Single worker for basic plans
   - Reduced timeout values
   - Simplified configuration

2. **Environment-specific settings**
   ```env
   ENV_MODE=production
   WORKERS=1  # Start with 1, increase if needed
   ```

3. **Monitor and scale**
   - Monitor response times in Render dashboard
   - Upgrade plan if needed for more resources
   - Redis handles both caching and task processing efficiently

## Differences from Local Development

| Aspect | Local (docker-compose) | Render |
|--------|----------------------|--------|
| Redis | Local container | External Redis Cloud |
| Task Queue | Redis (was RabbitMQ) | Redis via external service |
| Workers | Separate container | Same process or external |
| SSL | Not required | Required for external services |
| Configuration | .env file | Render environment variables |

## Next Steps

After successful deployment:

1. Test the `/api/health` endpoint
2. Verify Redis connectivity in logs
3. Test agent initialization (should no longer fail with RabbitMQ errors)
4. Test basic API functionality  
5. Monitor performance and resource usage
6. Set up monitoring and alerting

## Support

If you encounter issues:
1. Check the [original Suna repository](https://github.com/kortix-ai/suna) for updates
2. Review Render logs thoroughly
3. Verify all environment variables are correctly set
4. Test external services (Redis, Supabase) independently 