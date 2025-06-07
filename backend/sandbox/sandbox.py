from daytona_sdk import Daytona, DaytonaConfig, CreateSandboxParams, Sandbox, SessionExecuteRequest
from daytona_api_client.models.workspace_state import WorkspaceState
from dotenv import load_dotenv
from utils.logger import logger
from utils.config import config
from utils.config import Configuration
import asyncio
import time

load_dotenv()

logger.debug("Initializing Daytona sandbox configuration")
daytona_config = DaytonaConfig(
    api_key=config.DAYTONA_API_KEY,
    api_url=config.DAYTONA_SERVER_URL,  # Use api_url instead of deprecated server_url
    target=config.DAYTONA_TARGET
)

if daytona_config.api_key:
    logger.debug("Daytona API key configured successfully")
else:
    logger.warning("No Daytona API key found in environment variables")

if daytona_config.api_url:
    logger.debug(f"Daytona server URL set to: {daytona_config.api_url}")
else:
    logger.warning("No Daytona server URL found in environment variables")

if daytona_config.target:
    logger.debug(f"Daytona target set to: {daytona_config.target}")
else:
    logger.warning("No Daytona target found in environment variables")

daytona = Daytona(daytona_config)
logger.debug("Daytona client initialized")

async def get_or_start_sandbox(sandbox_id: str):
    """Retrieve a sandbox by ID, check its state, and start it if needed."""
    
    logger.info(f"Getting or starting sandbox with ID: {sandbox_id}")
    
    try:
        # Try to get the current sandbox
    try:
        sandbox = daytona.get_current_sandbox(sandbox_id)
            logger.debug(f"Found existing sandbox {sandbox_id}")
        except Exception as get_error:
            logger.error(f"Failed to get sandbox {sandbox_id}: {str(get_error)}")
            # If we can't get the sandbox, it might not exist or be accessible
            raise Exception(f"Sandbox {sandbox_id} not found or not accessible")
        
        # Check if sandbox needs to be started
        current_state = sandbox.instance.state
        logger.debug(f"Sandbox {sandbox_id} current state: {current_state}")
        
        if current_state in [WorkspaceState.ARCHIVED, WorkspaceState.STOPPED]:
            logger.info(f"Sandbox is in {current_state} state. Starting...")
            try:
                daytona.start(sandbox)
                logger.info(f"Started sandbox {sandbox_id}, waiting for initialization...")
                
                # Wait for the sandbox to be ready
                max_wait_time = 30  # Maximum wait time in seconds
                wait_interval = 2   # Check every 2 seconds
                elapsed_time = 0
                
                while elapsed_time < max_wait_time:
                    await asyncio.sleep(wait_interval)
                    elapsed_time += wait_interval
                    
                    try:
                        # Refresh sandbox state
                sandbox = daytona.get_current_sandbox(sandbox_id)
                        if sandbox.instance.state == WorkspaceState.STARTED:
                            logger.info(f"Sandbox {sandbox_id} is now started after {elapsed_time}s")
                            break
                    except Exception as state_check_error:
                        logger.warning(f"Error checking sandbox state during startup: {state_check_error}")
                        continue
                
                if elapsed_time >= max_wait_time:
                    logger.warning(f"Sandbox {sandbox_id} startup timeout after {max_wait_time}s")
                
                # Start supervisord in a session when restarting
                try:
                start_supervisord_session(sandbox)
                except Exception as supervisord_error:
                    logger.warning(f"Failed to start supervisord session: {supervisord_error}")
                    # Continue anyway, supervisord failure shouldn't block the sandbox
                    
            except Exception as start_error:
                logger.error(f"Error starting sandbox {sandbox_id}: {start_error}")
                raise Exception(f"Failed to start sandbox: {str(start_error)}")
        
        elif current_state == WorkspaceState.STARTED:
            logger.info(f"Sandbox {sandbox_id} is already running")
        else:
            logger.warning(f"Sandbox {sandbox_id} is in unexpected state: {current_state}")
        
        logger.info(f"Sandbox {sandbox_id} is ready")
        return sandbox
        
    except Exception as e:
        error_msg = f"Failed to get or start sandbox {sandbox_id}: {str(e)}"
        logger.error(error_msg)
        
        # Check for specific error types to provide better error messages
        if "not found" in str(e).lower():
            raise Exception(f"Sandbox {sandbox_id} does not exist")
        elif "connection" in str(e).lower():
            raise Exception(f"Unable to connect to Daytona service: {str(e)}")
        else:
            raise Exception(error_msg)

def start_supervisord_session(sandbox: Sandbox):
    """Start supervisord in a session."""
    session_id = "supervisord-session"
    try:
        logger.info(f"Creating session {session_id} for supervisord")
        sandbox.process.create_session(session_id)
        
        # Execute supervisord command
        sandbox.process.execute_session_command(session_id, SessionExecuteRequest(
            command="exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf",
            var_async=True
        ))
        logger.info(f"Supervisord started in session {session_id}")
    except Exception as e:
        logger.error(f"Error starting supervisord session: {str(e)}")
        raise e

def create_sandbox(password: str, project_id: str = None):
    """Create a new sandbox with all required services configured and running."""
    
    logger.debug("Creating new Daytona sandbox environment")
    logger.debug("Configuring sandbox with browser-use image and environment variables")
    
    labels = None
    if project_id:
        logger.debug(f"Using sandbox_id as label: {project_id}")
        labels = {'id': project_id}
        
    params = CreateSandboxParams(
        image=Configuration.SANDBOX_IMAGE_NAME,
        public=True,
        labels=labels,
        env_vars={
            "CHROME_PERSISTENT_SESSION": "true",
            "RESOLUTION": "1024x768x24",
            "RESOLUTION_WIDTH": "1024",
            "RESOLUTION_HEIGHT": "768",
            "VNC_PASSWORD": password,
            "ANONYMIZED_TELEMETRY": "false",
            "CHROME_PATH": "",
            "CHROME_USER_DATA": "",
            "CHROME_DEBUGGING_PORT": "9222",
            "CHROME_DEBUGGING_HOST": "localhost",
            "CHROME_CDP": ""
        },
        resources={
            "cpu": 1,
            "memory": 2,  # Reduced from 4GB to 2GB to prevent quota issues
            "disk": 3,    # Reduced disk space as well
        }
    )
    
    # Create the sandbox
    sandbox = daytona.create(params)
    logger.debug(f"Sandbox created with ID: {sandbox.id}")
    
    # Start supervisord in a session for new sandbox
    start_supervisord_session(sandbox)
    
    logger.debug(f"Sandbox environment successfully initialized")
    return sandbox

async def delete_sandbox(sandbox_id: str):
    """Delete a sandbox by its ID."""
    logger.info(f"Deleting sandbox with ID: {sandbox_id}")
    
    try:
        # Get the sandbox
        sandbox = daytona.get_current_sandbox(sandbox_id)
        
        # Delete the sandbox
        daytona.remove(sandbox)
        
        logger.info(f"Successfully deleted sandbox {sandbox_id}")
        return True
    except Exception as e:
        logger.error(f"Error deleting sandbox {sandbox_id}: {str(e)}")
        raise e

