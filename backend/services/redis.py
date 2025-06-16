import redis.asyncio as redis
import os
from dotenv import load_dotenv
import asyncio
from utils.logger import logger
from typing import List, Any, Optional

# Redis configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
redis_password = os.getenv('REDIS_PASSWORD', '')
redis_username = os.getenv('REDIS_USERNAME', '')  # Added for Upstash
redis_ssl = os.getenv('REDIS_SSL', 'False').lower() == 'true'

logger.info(f"Initializing Redis connection to {redis_host}:{redis_port} (SSL: {redis_ssl})")
logger.info(f"Redis config - Host: {redis_host}, Port: {redis_port}, SSL: {redis_ssl}, Username: {'SET' if redis_username else 'NOT SET'}, Password: {'SET' if redis_password else 'NOT SET'}")

# Initialize Redis client with proper Upstash support
redis_config = {
    'host': redis_host,
    'port': redis_port,
    'decode_responses': True,
    'socket_connect_timeout': 10,
    'socket_timeout': 10,
    'retry_on_timeout': True,
    'retry_on_error': [ConnectionError, TimeoutError],
    'health_check_interval': 30,
}

# Add authentication if provided
if redis_username:
    redis_config['username'] = redis_username
if redis_password:
    redis_config['password'] = redis_password

# Add SSL configuration for Upstash
if redis_ssl:
    redis_config.update({
        'ssl': True,
        'ssl_check_hostname': False,  # Upstash doesn't require hostname verification
        'ssl_cert_reqs': 'none',      # Upstash doesn't require certificate verification
    })
    logger.info("✅ SSL/TLS enabled for Redis connection (Upstash mode)")

client: Optional[redis.Redis] = redis.Redis(**redis_config)

# Connection state
_initialized = False
_init_lock = asyncio.Lock()

# Constants
REDIS_KEY_TTL = 3600 * 24  # 24 hour TTL as safety mechanism


def initialize():
    """Initialize Redis connection synchronously."""
    global client, _initialized
    if not _initialized:
        logger.info("Initializing Redis connection")
        # Client is already created above
        _initialized = True


async def initialize_async():
    """Initialize Redis connection asynchronously with retry logic."""
    global client, _initialized

    async with _init_lock:
        if not _initialized:
            logger.info("🔄 Initializing Redis connection...")
            initialize()

            # Retry logic for connection with exponential backoff
            max_retries = 5  # Increased retries
            for attempt in range(max_retries):
                try:
                    logger.info(f"📡 Attempting Redis connection (attempt {attempt + 1}/{max_retries})")
                    await client.ping()
                    logger.info("✅ Successfully connected to Redis")
                    _initialized = True
                    
                    # Test basic operations
                    test_key = "health_check"
                    await client.set(test_key, "ok", ex=10)
                    result = await client.get(test_key)
                    if result == "ok":
                        logger.info("✅ Redis read/write operations verified")
                        await client.delete(test_key)
                    else:
                        logger.warning("⚠️ Redis read/write verification failed")
                    
                    return client
                except Exception as e:
                    logger.error(f"❌ Redis connection attempt {attempt + 1} failed: {e}")
                    if attempt < max_retries - 1:
                        wait_time = min(2 ** attempt, 30)  # Cap at 30 seconds
                        logger.info(f"⏳ Retrying in {wait_time} seconds...")
                        await asyncio.sleep(wait_time)
                    else:
                        logger.error("💥 All Redis connection attempts failed")
                        client = None
                        _initialized = False
                        raise Exception(f"Failed to connect to Redis after {max_retries} attempts: {e}")

    return client


async def close():
    """Close Redis connection."""
    global client, _initialized
    if client:
        logger.info("Closing Redis connection")
        await client.aclose()
        client = None
        _initialized = False
        logger.info("Redis connection closed")


async def get_client():
    """Get the Redis client, initializing if necessary."""
    global client, _initialized
    if client is None or not _initialized:
        await initialize_async()
    return client


# Basic Redis operations
async def set(key: str, value: str, ex: int = None):
    """Set a Redis key."""
    redis_client = await get_client()
    return await redis_client.set(key, value, ex=ex)


async def get(key: str, default: str = None):
    """Get a Redis key."""
    redis_client = await get_client()
    result = await redis_client.get(key)
    return result if result is not None else default


async def delete(key: str):
    """Delete a Redis key."""
    redis_client = await get_client()
    return await redis_client.delete(key)


async def publish(channel: str, message: str):
    """Publish a message to a Redis channel."""
    redis_client = await get_client()
    return await redis_client.publish(channel, message)


async def create_pubsub():
    """Create a Redis pubsub object with connection retry."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            redis_client = await get_client()
            pubsub = redis_client.pubsub()
            # Test the pubsub connection
            await pubsub.ping()
            logger.debug("Created Redis pubsub successfully on attempt {attempt + 1}")
            return pubsub
        except Exception as e:
            logger.warning("Failed to create Redis pubsub (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
            else:
                logger.error("Failed to create Redis pubsub after all retries")
                raise


async def publish_with_retry(channel: str, message: str, max_retries: int = 3):
    """Publish a message to a Redis channel with retry logic."""
    for attempt in range(max_retries):
        try:
            redis_client = await get_client()
            result = await redis_client.publish(channel, message)
            logger.debug("Published message to {channel} successfully on attempt {attempt + 1}")
            return result
        except Exception as e:
            logger.warning("Failed to publish to {channel} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
            else:
                logger.error("Failed to publish to {channel} after all retries")
                raise


# List operations
async def rpush(key: str, *values: Any):
    """Append one or more values to a list."""
    redis_client = await get_client()
    return await redis_client.rpush(key, *values)


async def lrange(key: str, start: int, end: int) -> List[str]:
    """Get a range of elements from a list."""
    redis_client = await get_client()
    return await redis_client.lrange(key, start, end)


async def llen(key: str) -> int:
    """Get the length of a list."""
    redis_client = await get_client()
    return await redis_client.llen(key)


# Key management
async def expire(key: str, time: int):
    """Set a key's time to live in seconds."""
    redis_client = await get_client()
    return await redis_client.expire(key, time)


async def keys(pattern: str) -> List[str]:
    """Get keys matching a pattern."""
    redis_client = await get_client()
    return await redis_client.keys(pattern)


async def lrange_chunked(key: str, start: int, end: int, max_size_mb: float = 8.0) -> List[str]:
    """Get a range of elements from a list with size limit to prevent Upstash 10MB request limit."""
    redis_client = await get_client()
    max_size_bytes = int(max_size_mb * 1024 * 1024)  # Convert MB to bytes

    # If end is -1, get the actual list length
    if end == -1:
        list_length = await redis_client.llen(key)
        if list_length == 0:
            return []
        end = list_length - 1

    # Calculate chunk size based on estimated average response size
    # Start with small chunks and adjust based on actual data
    chunk_size = 50  # Start with 50 responses per chunk
    all_results = []
    current_pos = start
    total_size = 0

    logger.debug("Fetching Redis list {key} from {start} to {end} with {max_size_mb}MB limit")

    while current_pos <= end:
        chunk_end = min(current_pos + chunk_size - 1, end)

        try:
            chunk_data = await redis_client.lrange(key, current_pos, chunk_end)
            if not chunk_data:
                break

            # Calculate chunk size in bytes
            chunk_size_bytes = sum(len(item.encode('utf-8')) for item in chunk_data)

            # Check if adding this chunk would exceed the limit
            if total_size + chunk_size_bytes > max_size_bytes and all_results:
                logger.warning("Redis list {key}: Stopping at position {current_pos} to avoid {max_size_mb}MB limit (current: {total_size / 1024 / 1024:.1f}MB)")
                break

            all_results.extend(chunk_data)
            total_size += chunk_size_bytes
            current_pos = chunk_end + 1

            # Adjust chunk size based on average item size
            if chunk_data:
                avg_item_size = chunk_size_bytes / len(chunk_data)
                # Aim for ~1MB chunks
                optimal_chunk_size = max(10, min(200, int(1024 * 1024 / avg_item_size)))
                chunk_size = optimal_chunk_size

        except Exception as e:
            logger.error("Error fetching chunk {current_pos}-{chunk_end} from Redis list {key}: {e}")
            break

    logger.debug("Fetched {len(all_results)} items from Redis list {key} (total size: {total_size / 1024 / 1024:.1f}MB)")
    return all_results


async def lrange_latest(key: str, max_count: int = 100, max_size_mb: float = 8.0) -> List[str]:
    """Get the latest N items from a Redis list with size limit."""
    redis_client = await get_client()
    max_size_bytes = int(max_size_mb * 1024 * 1024)

    # Get list length
    list_length = await redis_client.llen(key)
    if list_length == 0:
        return []

    # Calculate start position for latest items
    start_pos = max(0, list_length - max_count)

    logger.debug("Fetching latest {max_count} items from Redis list {key} (total length: {list_length})")

    return await lrange_chunked(key, start_pos, -1, max_size_mb)
