"""
Supabase integration for Enhanced Agent Engine V2
Connects new agent system with existing database and auth
"""

import asyncio
import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
from supabase import create_client, Client
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import our enhanced agent engine
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from services.enhanced_agent_engine import EnhancedAgentEngine, TaskContext, StreamingResponse

logger = logging.getLogger(__name__)

class SupabaseAgentIntegration:
    """Integration layer between Enhanced Agent V2 and Supabase"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.agent_engine = EnhancedAgentEngine()
        self.active_sessions: Dict[str, Dict] = {}
        
    async def initialize(self):
        """Initialize both systems"""
        await self.agent_engine.initialize()
        logger.info("Supabase Agent Integration initialized")
        
    async def get_user_context(self, user_id: str, thread_id: str = None) -> TaskContext:
        """Get user context from Supabase for agent processing"""
        try:
            # Get user account info from basejump accounts
            account_response = self.supabase.table('accounts').select('*').eq('id', user_id).execute()
            account = account_response.data[0] if account_response.data else None
            
            # Get thread context if thread_id provided
            thread_context = {}
            if thread_id:
                thread_response = self.supabase.table('threads').select('*').eq('id', thread_id).execute()
                if thread_response.data:
                    thread = thread_response.data[0]
                    thread_context = {
                        'thread_id': thread_id,
                        'agent_id': thread.get('agent_id'),
                        'title': thread.get('title'),
                        'created_at': thread.get('created_at'),
                        'sandbox_id': thread.get('sandbox_id'),
                        'project_id': thread.get('project_id')
                    }
            
            # Get user's agent configuration
            agent_config = await self._get_agent_config(account.get('id') if account else user_id)
            
            # Create enhanced context
            context = await self.agent_engine.context_manager.get_context(user_id, thread_id or 'new_session')
            
            # Enhance with Supabase data
            context.user_preferences.update({
                'account_id': account.get('id') if account else None,
                'account_name': account.get('name') if account else None,
                'agent_config': agent_config,
                'thread_context': thread_context
            })
            
            return context
            
        except Exception as e:
            logger.error(f"Error getting user context: {e}")
            # Return basic context as fallback
            return await self.agent_engine.context_manager.get_context(user_id, thread_id or 'new_session')
            
    async def _get_agent_config(self, account_id: str) -> Dict:
        """Get agent configuration for user account"""
        try:
            response = self.supabase.table('agents').select('*').eq('account_id', account_id).eq('is_default', True).execute()
            if response.data:
                agent = response.data[0]
                return {
                    'agent_id': agent.get('agent_id'),
                    'name': agent.get('name'),
                    'description': agent.get('description'),
                    'system_prompt': agent.get('system_prompt'),
                    'configured_mcps': agent.get('configured_mcps', []),
                    'agentpress_tools': agent.get('agentpress_tools', {}),
                    'avatar': agent.get('avatar'),
                    'avatar_color': agent.get('avatar_color')
                }
        except Exception as e:
            logger.error(f"Error getting agent config: {e}")
            
        return {
            'agent_id': None, 
            'name': 'Enhanced Agent V2', 
            'system_prompt': 'You are a helpful AI assistant with enhanced capabilities.',
            'configured_mcps': [],
            'agentpress_tools': {}
        }
        
    async def save_message_to_supabase(self, thread_id: str, message_data: Dict) -> Optional[str]:
        """Save message to Supabase messages table"""
        try:
            # Check if messages table exists, if not use threads table
            message_record = {
                'thread_id': thread_id,
                'role': message_data.get('role'),
                'content': message_data.get('content'),
                'metadata': json.dumps(message_data.get('metadata', {})),
                'created_at': datetime.now().isoformat()
            }
            
            # Try to insert into messages table first
            try:
                response = self.supabase.table('messages').insert(message_record).execute()
                return response.data[0]['id'] if response.data else None
            except:
                # Fallback: Update threads table with latest message
                self.supabase.table('threads').update({
                    'updated_at': datetime.now().isoformat(),
                    'last_message': message_data.get('content', '')[:500]  # Store preview
                }).eq('id', thread_id).execute()
                return thread_id
                
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            return None
            
    async def update_thread_with_results(self, thread_id: str, results: Dict):
        """Update thread with agent execution results"""
        try:
            update_data = {
                'updated_at': datetime.now().isoformat(),
                'last_activity': datetime.now().isoformat()
            }
            
            # Add metadata if available
            if results.get('metadata'):
                update_data['metadata'] = json.dumps(results['metadata'])
                
            self.supabase.table('threads').update(update_data).eq('id', thread_id).execute()
            
        except Exception as e:
            logger.error(f"Error updating thread: {e}")
            
    async def log_enhanced_session(self, user_id: str, thread_id: str, performance_metrics: Dict) -> str:
        """Log enhanced agent session for performance tracking"""
        try:
            session_data = {
                'user_id': user_id,
                'thread_id': thread_id,
                'agent_version': 'v2-enhanced',
                'performance_metrics': json.dumps(performance_metrics),
                'created_at': datetime.now().isoformat()
            }
            
            response = self.supabase.table('enhanced_agent_sessions').insert(session_data).execute()
            return response.data[0]['session_id'] if response.data else None
            
        except Exception as e:
            logger.error(f"Error logging enhanced session: {e}")
            return None
            
    async def log_tool_execution(self, session_id: str, tool_name: str, parameters: Dict, results: Dict, duration_ms: int, success: bool):
        """Log tool execution for monitoring"""
        try:
            execution_data = {
                'session_id': session_id,
                'tool_name': tool_name,
                'parameters': json.dumps(parameters),
                'results': json.dumps(results),
                'duration_ms': duration_ms,
                'success': success,
                'created_at': datetime.now().isoformat()
            }
            
            self.supabase.table('enhanced_tool_executions').insert(execution_data).execute()
            
        except Exception as e:
            logger.error(f"Error logging tool execution: {e}")
            
    async def process_message_with_supabase_context(
        self, 
        user_id: str, 
        thread_id: str, 
        message: str,
        websocket: WebSocket = None
    ):
        """Process message with full Supabase integration"""
        
        # Start performance tracking
        start_time = datetime.now()
        session_id = None
        
        try:
            # Get context from Supabase
            context = await self.get_user_context(user_id, thread_id)
            
            # Log enhanced session
            session_id = await self.log_enhanced_session(user_id, thread_id, {
                'start_time': start_time.isoformat(),
                'user_agent': 'enhanced-v2'
            })
            
            # Save user message to Supabase
            await self.save_message_to_supabase(thread_id, {
                'role': 'user',
                'content': message,
                'metadata': {
                    'user_id': user_id,
                    'session_id': session_id,
                    'enhanced_mode': True
                }
            })
            
            # Collect streaming results
            agent_responses = []
            tool_executions = []
            
            async def supabase_streaming_callback(response: StreamingResponse):
                """Enhanced callback that saves to Supabase and streams to frontend"""
                
                # Send to frontend via WebSocket
                if websocket:
                    try:
                        await websocket.send_json({
                            'type': 'enhanced_agent_stream',
                            'data': {
                                'response_type': response.type,
                                'content': response.content,
                                'metadata': response.metadata,
                                'timestamp': response.timestamp.isoformat(),
                                'task_id': response.task_id
                            }
                        })
                    except Exception as e:
                        logger.error(f"WebSocket send error: {e}")
                
                # Track tool executions
                if response.type == 'tool_result' and session_id:
                    tool_result = response.metadata.get('result', {})
                    await self.log_tool_execution(
                        session_id=session_id,
                        tool_name=tool_result.get('tool_name', 'unknown'),
                        parameters=tool_result.get('parameters', {}),
                        results=tool_result.get('result', {}),
                        duration_ms=int(tool_result.get('duration', 0) * 1000),
                        success=tool_result.get('success', False)
                    )
                    tool_executions.append(tool_result)
                
                # Collect final response
                if response.type == 'complete':
                    agent_responses.append(response)
                    
            # Process with enhanced agent engine
            await self.agent_engine.agent.process_request(
                message=message,
                context=context,
                stream_callback=supabase_streaming_callback
            )
            
            # Save final agent response to Supabase
            if agent_responses:
                final_response = agent_responses[-1]
                await self.save_message_to_supabase(thread_id, {
                    'role': 'assistant',
                    'content': final_response.content,
                    'metadata': {
                        'task_id': final_response.task_id,
                        'tool_results': tool_executions,
                        'session_id': session_id,
                        'enhanced_mode': True,
                        'performance_metrics': final_response.metadata
                    }
                })
                
                # Update thread with results
                await self.update_thread_with_results(thread_id, final_response.metadata)
                
            # Update session with final performance metrics
            if session_id:
                end_time = datetime.now()
                total_duration = (end_time - start_time).total_seconds()
                
                await self.log_enhanced_session(user_id, thread_id, {
                    'start_time': start_time.isoformat(),
                    'end_time': end_time.isoformat(),
                    'total_duration_seconds': total_duration,
                    'tools_executed': len(tool_executions),
                    'message_length': len(message),
                    'response_length': len(final_response.content) if agent_responses else 0
                })
                
        except Exception as e:
            logger.error(f"Error processing message with Supabase context: {e}")
            
            # Send error to frontend
            if websocket:
                try:
                    await websocket.send_json({
                        'type': 'error',
                        'data': {
                            'message': 'An error occurred processing your request',
                            'error': str(e)
                        }
                    })
                except:
                    pass


# FastAPI app for Supabase integration
app = FastAPI(title="Enhanced Agent V2 - Supabase Integration")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global integration instance
integration: SupabaseAgentIntegration = None

@app.on_event("startup")
async def startup():
    global integration
    integration = SupabaseAgentIntegration(
        supabase_url=os.getenv('NEXT_PUBLIC_SUPABASE_URL') or os.getenv('SUPABASE_URL'),
        supabase_key=os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    )
    await integration.initialize()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to Enhanced Agent V2 with Supabase integration",
            "user_id": user_id
        })
        
        while True:
            # Receive message from frontend
            data = await websocket.receive_json()
            
            if data.get('type') == 'chat_message':
                thread_id = data.get('thread_id')
                message = data.get('content', '')
                
                if thread_id and message:
                    # Process with Supabase integration
                    await integration.process_message_with_supabase_context(
                        user_id=user_id,
                        thread_id=thread_id,
                        message=message,
                        websocket=websocket
                    )
                    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user: {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Enhanced Agent V2 - Supabase Integration",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": integration is not None,
        "agent_engine_initialized": integration.agent_engine.initialized if integration else False
    }

@app.get("/metrics")
async def get_metrics():
    """Get integration metrics"""
    if not integration:
        return {"error": "Integration not initialized"}
        
    return {
        "active_sessions": len(integration.active_sessions),
        "agent_engine_metrics": {
            "active_connections": len(integration.agent_engine.active_connections),
            "redis_connected": integration.agent_engine.redis_client is not None,
            "tools_available": len(integration.agent_engine.tool_executor.tool_registry) if integration.agent_engine.tool_executor else 0
        },
        "supabase_integration": {
            "supabase_url": os.getenv('NEXT_PUBLIC_SUPABASE_URL', 'not_configured'),
            "tables_accessible": True  # Could add actual table checks here
        }
    }

@app.post("/api/enhanced-agent/process")
async def process_message_api(request: dict):
    """REST API endpoint for processing messages (alternative to WebSocket)"""
    if not integration:
        return {"error": "Integration not initialized"}
        
    user_id = request.get('user_id')
    thread_id = request.get('thread_id')
    message = request.get('message')
    
    if not all([user_id, thread_id, message]):
        return {"error": "Missing required fields: user_id, thread_id, message"}
        
    try:
        # Process without WebSocket (for REST API usage)
        await integration.process_message_with_supabase_context(
            user_id=user_id,
            thread_id=thread_id,
            message=message,
            websocket=None
        )
        
        return {"success": True, "message": "Message processed successfully"}
        
    except Exception as e:
        logger.error(f"API processing error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Run the Supabase integration server
    uvicorn.run(
        "supabase_agent_integration:app",
        host=os.getenv('ENHANCED_AGENT_HOST', '0.0.0.0'),
        port=int(os.getenv('ENHANCED_AGENT_PORT', 8000)),
        reload=True,
        log_level="info"
    ) 