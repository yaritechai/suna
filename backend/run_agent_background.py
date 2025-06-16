import sentry
import asyncio
import json
import traceback
from datetime import datetime, timezone
from typing import Optional, List
from services import redis
from agent.run import run_agent
from utils.logger import logger
import dramatiq
from agentpress.thread_manager import ThreadManager
from services.supabase import DBConnection
from dramatiq.brokers.redis import RedisBroker
import os
from services.langfuse import langfuse

# Replace RabbitMQ configuration with Redis
redis_host = os.getenv('REDIS_HOST', 'redis')
redis_port = int(os.getenv('REDIS_PORT', 6379))
redis_password = os.getenv('REDIS_PASSWORD', '')
redis_username = os.getenv('REDIS_USERNAME', '')  # Added for Upstash support

# Configure Redis broker for Dramatiq with SSL support for Upstash
# FIX: Default to False for SSL to match local/Docker setup
redis_ssl = os.getenv('REDIS_SSL', 'False').lower() == 'true'  # Changed default to False
ssl_protocol = "rediss" if redis_ssl else "redis"

# FIX: Corrected URL construction with proper f-string and username support
if redis_username and redis_password:
    # Upstash format with username
    redis_url = f"{ssl_protocol}://{redis_username}:{redis_password}@{redis_host}:{redis_port}/0"
elif redis_password:
    # Password only format
    redis_url = f"{ssl_protocol}://:{redis_password}@{redis_host}:{redis_port}/0"
else:
    # No authentication
    redis_url = f"{ssl_protocol}://{redis_host}:{redis_port}/0"

logger.info(f"Dramatiq Redis broker connecting to: {redis_url.replace(redis_password, '*****' if redis_password else 'no-password')}")

# Configure Redis broker with improved error handling and Upstash compatibility
try:
    broker_config = {
        'url': redis_url,
        'middleware': [dramatiq.middleware.AsyncIO()],
        # Add timeout and retry settings for stability
        'socket_timeout': 30.0,  # 30 second timeout for socket operations
        'socket_connect_timeout': 10.0,  # 10 second connection timeout
        'retry_on_timeout': True,  # Retry on timeout
        'health_check_interval': 30,  # Health check every 30 seconds
    }
    
    # Add SSL configuration for Upstash compatibility
    if redis_ssl:
        broker_config.update({
            'ssl_cert_reqs': None,
            'ssl_check_hostname': False,  # Upstash compatibility
        })
        logger.info("🔒 SSL/TLS enabled for Dramatiq broker (Upstash mode)")
    
    redis_broker = RedisBroker(**broker_config)
    dramatiq.set_broker(redis_broker)
    logger.info("✅ Dramatiq Redis broker initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Dramatiq Redis broker: {e}")
    raise

_initialized = False
db = DBConnection()
instance_id = "single"

# Constants for Redis size monitoring
MAX_REDIS_LIST_SIZE_MB = 8.0  # Conservative limit to stay under Upstash 10MB
REDIS_SIZE_CHECK_INTERVAL = 100  # Check size every N responses
REDIS_RESPONSE_LIST_TTL = 3600 * 24  # 24 hours

async def initialize():
    """Initialize database connection."""
    global _initialized
    if not _initialized:
        await db.initialize()
        _initialized = True

async def estimate_redis_list_size(key: str) -> float:
    """Estimate the size of a Redis list in MB."""
    try:
        list_length = await redis.llen(key)
        if list_length == 0:
            return 0.0

        # Sample a few responses to estimate total size
        sample_size = min(10, list_length)
        sample_responses = await redis.lrange(key, 0, sample_size - 1)

        if sample_responses:
            total_sample_size = sum(len(item.encode('utf-8')) for item in sample_responses)
            avg_response_size = total_sample_size / len(sample_responses)
            estimated_total_size = avg_response_size * list_length
            return estimated_total_size / (1024 * 1024)  # Convert to MB
        return 0.0
    except Exception as e:
        logger.warning("Failed to estimate Redis list size for {key}: {e}")
        return 0.0

async def safe_redis_write(operation, *args, operation_name: str = "redis_operation"):
    """Safely execute a Redis write operation with proper error handling."""
    try:
        result = await operation(*args)
        return result
    except Exception as e:
        logger.error("Failed {operation_name}: {e}")
        raise

class RedisWriteManager:
    """Manages Redis writes with size monitoring and error handling."""

    def __init__(self, response_list_key: str, response_channel: str):
        self.response_list_key = response_list_key
        self.response_channel = response_channel
        self.response_count = 0
        self.size_exceeded = False
        self.last_size_check = 0
        self.estimated_current_size = 0.0

    async def write_response(self, response_json: str) -> bool:
        """Write response to Redis with size monitoring."""
        if self.size_exceeded:
            logger.warning(f"Skipping Redis write due to size limit for {self.response_list_key}")
            return False

        # Optimized size checking - only check every 100 responses and estimate in between
        response_size_mb = len(response_json.encode('utf-8')) / (1024 * 1024)
        self.estimated_current_size += response_size_mb

        # Only do expensive size check periodically
        if self.response_count % REDIS_SIZE_CHECK_INTERVAL == 0 and self.response_count > 0:
            try:
                actual_size = await estimate_redis_list_size(self.response_list_key)
                if actual_size > 0:
                    self.estimated_current_size = actual_size  # Sync our estimate with reality
                    
                if actual_size > MAX_REDIS_LIST_SIZE_MB:
                    logger.warning(f"Redis list {self.response_list_key} exceeded size limit: {actual_size:.2f}MB")
                    self.size_exceeded = True
                    # Add a warning message to indicate truncation
                    warning_response = {
                        "type": "status",
                        "status": "warning",
                        "message": f"Response list truncated due to size limit ({actual_size:.1f}MB). Continuing with database-only storage."
                    }
                    try:
                        await safe_redis_write(redis.rpush, self.response_list_key, json.dumps(warning_response), operation_name="rpush_warning")
                        await safe_redis_write(redis.publish, self.response_channel, "new", operation_name="publish_warning")
                    except Exception as warning_error:
                        logger.error(f"Failed to write size warning to Redis: {warning_error}")
                    return False
            except Exception as size_check_error:
                logger.warning(f"Failed to check Redis size, continuing with estimated size: {size_check_error}")
        
        # Fast check using estimated size between full checks
        elif self.estimated_current_size > MAX_REDIS_LIST_SIZE_MB:
            logger.warning(f"Estimated Redis size ({self.estimated_current_size:.2f}MB) exceeds limit, stopping writes")
            self.size_exceeded = True
            return False

        # Write response and notification atomically with better error handling
        try:
            await safe_redis_write(redis.rpush, self.response_list_key, response_json, operation_name="rpush_response")
            await safe_redis_write(redis.publish, self.response_channel, "new", operation_name="publish_response")
            self.response_count += 1
            
            # Log progress every 50 responses
            if self.response_count % 50 == 0:
                logger.debug(f"Redis: {self.response_count} responses written, estimated size: {self.estimated_current_size:.2f}MB")
            
            return True
        except Exception as e:
            logger.error(f"Failed to write response to Redis: {e}")
            # Don't mark as size exceeded for regular Redis errors
            return False

@dramatiq.actor
def run_agent_background(
    agent_run_id: str,
    thread_id: str,
    instance_id: str,
    project_id: str,
    model_name: str,
    enable_thinking: Optional[bool],
    reasoning_effort: Optional[str],
    stream: bool,
    enable_context_manager: bool,
    agent_config: Optional[dict] = None,
    is_agent_builder: Optional[bool] = False,
    target_agent_id: Optional[str] = None
):
    """Run the agent in the background using Redis for state.

    This is a sync function that properly manages the event loop for async operations.
    Dramatiq's AsyncIO middleware requires sync actors.
    """
    # Simplified event loop handling - more reliable
    try:
        # Check if we're already in an async context
        try:
            # Try to get the current running loop
            loop = asyncio.get_running_loop()
            logger.warning(f"Agent {agent_run_id}: Running in existing event loop, creating new thread")
            
            # Use ThreadPoolExecutor to run in a separate thread with its own event loop
            import concurrent.futures
            import threading
            
            def run_in_thread():
                # Create a new event loop for this thread
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                try:
                    logger.info(f"Agent {agent_run_id}: Running in new thread with dedicated event loop")
                    return new_loop.run_until_complete(_run_agent_background_async(
                        agent_run_id, thread_id, instance_id, project_id, model_name,
                        enable_thinking, reasoning_effort, stream, enable_context_manager,
                        agent_config, is_agent_builder, target_agent_id
                    ))
                except Exception as async_error:
                    logger.error(f"Agent {agent_run_id}: Error in async execution: {async_error}", exc_info=True)
                    raise
                finally:
                    new_loop.close()
                    logger.debug(f"Agent {agent_run_id}: Event loop closed successfully")
            
            # Execute in thread pool with timeout
            with concurrent.futures.ThreadPoolExecutor(max_workers=1, thread_name_prefix=f"agent-{agent_run_id}") as executor:
                future = executor.submit(run_in_thread)
                return future.result(timeout=3600)  # 1 hour timeout
                
        except RuntimeError:
            # No event loop running, we can use asyncio.run() directly
            logger.info(f"Agent {agent_run_id}: No existing event loop, running with asyncio.run()")
            return asyncio.run(_run_agent_background_async(
                agent_run_id, thread_id, instance_id, project_id, model_name,
                enable_thinking, reasoning_effort, stream, enable_context_manager,
                agent_config, is_agent_builder, target_agent_id
            ))
    except Exception as e:
        logger.error(f"💥 Critical error in sync actor wrapper for {agent_run_id}: {e}", exc_info=True)
        # Try to update agent status to failed if possible
        try:
            asyncio.run(update_agent_run_status(
                db.client, agent_run_id, "failed", 
                error=f"Worker initialization failed: {str(e)}"
            ))
        except Exception as update_error:
            logger.error(f"Failed to update agent status after critical error: {update_error}")
        raise

async def _run_agent_background_async(
    agent_run_id: str,
    thread_id: str,
    instance_id: str,
    project_id: str,
    model_name: str,
    enable_thinking: Optional[bool],
    reasoning_effort: Optional[str],
    stream: bool,
    enable_context_manager: bool,
    agent_config: Optional[dict] = None,
    is_agent_builder: Optional[bool] = False,
    target_agent_id: Optional[str] = None
):
    """Async implementation of the agent background runner."""
    await initialize()

    sentry.sentry.set_tag("thread_id", thread_id)

    logger.info("Starting background agent run: {agent_run_id} for thread: {thread_id} (Instance: {instance_id})")
    logger.info("🚀 Using model: {model_name} (thinking: {enable_thinking}, reasoning_effort: {reasoning_effort})")
    if agent_config:
        logger.info("Using custom agent: {agent_config.get('name', 'Unknown')}")

    client = await db.client
    start_time = datetime.now(timezone.utc)
    total_responses = 0
    pubsub = None
    stop_checker = None
    stop_signal_received = False

    # Define Redis keys and channels
    response_list_key = "agent_run:{agent_run_id}:responses"
    response_channel = "agent_run:{agent_run_id}:new_response"
    instance_control_channel = "agent_run:{agent_run_id}:control:{instance_id}"
    global_control_channel = "agent_run:{agent_run_id}:control"
    instance_active_key = "active_run:{instance_id}:{agent_run_id}"

    # Initialize Redis write manager
    redis_writer = RedisWriteManager(response_list_key, response_channel)

    async def check_for_stop_signal():
        nonlocal stop_signal_received
        if not pubsub:
            return
        try:
            while not stop_signal_received:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=0.5)
                if message and message.get("type") == "message":
                    data = message.get("data")
                    if isinstance(data, bytes):
                        data = data.decode('utf-8')
                    if data == "STOP":
                        logger.info("Received STOP signal for agent run {agent_run_id} (Instance: {instance_id})")
                        stop_signal_received = True
                        break

                # Periodically refresh the active run key TTL
                if total_responses % 50 == 0:
                    try:
                        await redis.expire(instance_active_key, redis.REDIS_KEY_TTL)
                    except Exception as ttl_err:
                        logger.warning("Failed to refresh TTL for {instance_active_key}: {ttl_err}")

                await asyncio.sleep(0.1)
        except asyncio.CancelledError:
            logger.info("Stop signal checker cancelled for {agent_run_id} (Instance: {instance_id})")
        except Exception as e:
            logger.error("Error in stop signal checker for {agent_run_id}: {e}", exc_info=True)
            stop_signal_received = True

    trace = None
    cleanup_tasks = []

    try:
        # Setup Pub/Sub listener for control signals
        pubsub = await redis.create_pubsub()
        await pubsub.subscribe(instance_control_channel, global_control_channel)
        logger.debug("Subscribed to control channels: {instance_control_channel}, {global_control_channel}")
        stop_checker = asyncio.create_task(check_for_stop_signal())

        # Ensure active run key exists and has TTL
        await redis.set(instance_active_key, "running", ex=redis.REDIS_KEY_TTL)

        # Initialize agent generator
        agent_gen = run_agent(
            thread_id=thread_id, project_id=project_id, stream=stream,
            model_name=model_name,
            enable_thinking=enable_thinking, reasoning_effort=reasoning_effort,
            enable_context_manager=enable_context_manager,
            agent_config=agent_config,
            trace=trace,
            is_agent_builder=is_agent_builder,
            target_agent_id=target_agent_id
        )

        final_status = "running"
        error_message = None

        async for response in agent_gen:
            if stop_signal_received:
                logger.info("Agent run {agent_run_id} stopped by signal.")
                final_status = "stopped"
                break

            # Store response in Redis with proper error handling and size monitoring
            response_json = json.dumps(response)
            redis_success = await redis_writer.write_response(response_json)
            total_responses += 1

            # Check for agent-signaled completion or error
            if response.get('type') == 'status':
                status_val = response.get('status')
                if status_val in ['completed', 'failed', 'stopped']:
                    logger.info("Agent run {agent_run_id} finished via status message: {status_val}")
                    final_status = status_val
                    if status_val == 'failed' or status_val == 'stopped':
                        error_message = response.get('message', "Run ended with status: {status_val}")
                    break

        # Handle completion
        if final_status == "running":
            final_status = "completed"
            duration = (datetime.now(timezone.utc) - start_time).total_seconds()
            logger.info(f"Agent run {agent_run_id} completed normally (duration: {duration:.2f}s, responses: {total_responses})")
            completion_message = {"type": "status", "status": "completed", "message": "Agent run completed successfully"}

            # Write completion message to Redis
            completion_json = json.dumps(completion_message)
            await redis_writer.write_response(completion_json)

        # Fetch final responses from Redis for DB update (with size limit)
        all_responses_json = await redis.lrange_chunked(response_list_key, 0, -1, max_size_mb=8.0)
        all_responses = [json.loads(r) for r in all_responses_json]

        # Update DB status
        await update_agent_run_status(client, agent_run_id, final_status, error=error_message, responses=all_responses)

        # Publish final control signal
        control_signal = "END_STREAM" if final_status == "completed" else "ERROR" if final_status == "failed" else "STOP"
        try:
            await safe_redis_write(redis.publish, global_control_channel, control_signal, operation_name="publish_control_signal")
            logger.debug("Published final control signal '{control_signal}' to {global_control_channel}")
        except Exception as e:
            logger.warning("Failed to publish final control signal {control_signal}: {str(e)}")

    except Exception as e:
        error_message = str(e)
        traceback_str = traceback.format_exc()
        duration = (datetime.now(timezone.utc) - start_time).total_seconds()
        logger.error("Error in agent run {agent_run_id} after {duration:.2f}s: {error_message}\n{traceback_str} (Instance: {instance_id})")
        final_status = "failed"

        # Push error message to Redis
        error_response = {"type": "status", "status": "error", "message": error_message}
        try:
            error_json = json.dumps(error_response)
            await redis_writer.write_response(error_json)
        except Exception as redis_err:
            logger.error("Failed to push error response to Redis for {agent_run_id}: {redis_err}")

        # Fetch final responses (including the error, with size limit)
        all_responses = []
        try:
            all_responses_json = await redis.lrange_chunked(response_list_key, 0, -1, max_size_mb=8.0)
            all_responses = [json.loads(r) for r in all_responses_json]
        except Exception as fetch_err:
            logger.error("Failed to fetch responses from Redis after error for {agent_run_id}: {fetch_err}")
            all_responses = [error_response]

        # Update DB status
        await update_agent_run_status(client, agent_run_id, "failed", error="{error_message}\n{traceback_str}", responses=all_responses)

        # Publish ERROR signal
        try:
            await safe_redis_write(redis.publish, global_control_channel, "ERROR", operation_name="publish_error_signal")
            logger.debug("Published ERROR signal to {global_control_channel}")
        except Exception as e:
            logger.warning("Failed to publish ERROR signal: {str(e)}")

    finally:
        # Cleanup with proper task management
        cleanup_tasks = []

        # Cleanup stop checker task
        if stop_checker and not stop_checker.done():
            cleanup_tasks.append(_cleanup_task(stop_checker, "stop_checker"))

        # Close pubsub connection
        if pubsub:
            cleanup_tasks.append(_cleanup_pubsub(pubsub, agent_run_id))

        # Execute cleanup tasks concurrently
        if cleanup_tasks:
            cleanup_results = await asyncio.gather(*cleanup_tasks, return_exceptions=True)
            for i, result in enumerate(cleanup_results):
                if isinstance(result, Exception):
                    logger.warning("Cleanup task {i} failed: {result}")

        # Set TTL on the response list in Redis
        await _cleanup_redis_response_list(agent_run_id)

        # Remove the instance-specific active run key
        await _cleanup_redis_instance_key(agent_run_id, instance_id)

        logger.info("Agent run background task fully completed for: {agent_run_id} (Instance: {instance_id}) with final status: {final_status}")

async def _cleanup_task(task: asyncio.Task, task_name: str):
    """Safely cleanup an asyncio task."""
    try:
        task.cancel()
        await task
    except asyncio.CancelledError:
        logger.debug("Task {task_name} cancelled successfully")
    except Exception as e:
        logger.warning("Error during {task_name} cancellation: {e}")

async def _cleanup_pubsub(pubsub, agent_run_id: str):
    """Safely cleanup pubsub connection."""
    try:
        await pubsub.unsubscribe()
        await pubsub.close()
        logger.debug("Closed pubsub connection for {agent_run_id}")
    except Exception as e:
        logger.warning("Error closing pubsub for {agent_run_id}: {str(e)}")

async def _cleanup_redis_response_list(agent_run_id: str):
    """Set TTL on the Redis response list."""
    response_list_key = "agent_run:{agent_run_id}:responses"
    try:
        await redis.expire(response_list_key, REDIS_RESPONSE_LIST_TTL)
        logger.debug("Set TTL ({REDIS_RESPONSE_LIST_TTL}s) on response list: {response_list_key}")
    except Exception as e:
        logger.warning("Failed to set TTL on response list {response_list_key}: {str(e)}")

async def _cleanup_redis_instance_key(agent_run_id: str, instance_id: str):
    """Clean up the instance-specific Redis key for an agent run."""
    if not instance_id:
        logger.warning("Instance ID not set, cannot clean up instance key.")
        return
    key = "active_run:{instance_id}:{agent_run_id}"
    logger.debug("Cleaning up Redis instance key: {key}")
    try:
        await redis.delete(key)
        logger.debug("Successfully cleaned up Redis key: {key}")
    except Exception as e:
        logger.warning("Failed to clean up Redis key {key}: {str(e)}")

async def update_agent_run_status(
    client,
    agent_run_id: str,
    status: str,
    error: Optional[str] = None,
    responses: Optional[List[dict]] = None
) -> bool:
    """Update agent run status with enhanced error handling and retries."""
    max_retries = 3

    for retry in range(max_retries):
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            if error:
                update_data["error"] = error

            if responses:
                update_data["responses"] = responses

            result = await client.table('agent_runs').update(update_data).eq("id", agent_run_id).execute()

            if result.data:
                logger.info("Successfully updated agent run status to '{status}' for {agent_run_id}")
                return True
            else:
                logger.warning("No rows updated for agent run {agent_run_id} (status: {status})")
                return False

        except Exception as db_error:
            logger.error("Database error on retry {retry + 1} updating status for {agent_run_id}: {str(db_error)}")
            if retry < max_retries - 1:
                await asyncio.sleep(0.5 * (2 ** retry))  # Exponential backoff
            else:
                logger.error("Failed to update agent run status after all retries: {agent_run_id}", exc_info=True)
                return False

    return False
