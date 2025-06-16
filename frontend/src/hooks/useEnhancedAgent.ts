'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'

interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolResults?: any[]
  streaming?: boolean
  metadata?: any
}

interface AgentStatus {
  status: 'idle' | 'connecting' | 'processing' | 'error'
  currentTool?: string
  progress?: number
  latency?: number
  connectionQuality?: 'excellent' | 'good' | 'poor'
}

interface ToolExecution {
  toolName: string
  parameters: any
  startTime: Date
  endTime?: Date
  result?: any
  success?: boolean
}

interface PerformanceMetrics {
  responseTime: number
  toolExecutions: ToolExecution[]
  totalDuration: number
  tokensProcessed?: number
}

export function useEnhancedAgent(threadId: string) {
  const { user } = useAuth()
  const supabase = createClient()
  
  // State
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({ status: 'idle' })
  const [streamingResponse, setStreamingResponse] = useState('')
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  
  // WebSocket connection
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageStartTimeRef = useRef<Date | null>(null)
  
  useEffect(() => {
    if (!user || !threadId) return
    
    // Load existing messages from Supabase
    loadExistingMessages()
    
    // Establish WebSocket connection
    connectToEnhancedAgent()
    
    return () => {
      if (socket) {
        socket.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [user, threadId])
  
  const loadExistingMessages = async () => {
    try {
      // Try to load from messages table first
      let { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
      
      // If no messages table, fallback to thread data
      if (!messages || messages.length === 0) {
        const { data: threadData } = await supabase
          .from('threads')
          .select('*')
          .eq('id', threadId)
          .single()
          
        if (threadData?.last_message) {
          messages = [{
            id: 'thread-preview',
            role: 'assistant',
            content: threadData.last_message,
            created_at: threadData.updated_at
          }]
        }
      }
      
      if (messages) {
        setMessages(messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          toolResults: typeof msg.tool_results === 'string' 
            ? JSON.parse(msg.tool_results || '[]') 
            : (msg.tool_results || []),
          metadata: typeof msg.metadata === 'string'
            ? JSON.parse(msg.metadata || '{}')
            : (msg.metadata || {})
        })))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }
  
  const connectToEnhancedAgent = () => {
    if (!user) return
    
    const wsUrl = `${process.env.NEXT_PUBLIC_ENHANCED_AGENT_WS_URL || 'ws://localhost:8000'}/ws/${user.id}`
    console.log('Connecting to Enhanced Agent:', wsUrl)
    
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      setIsConnected(true)
      setAgentStatus({ 
        status: 'idle',
        connectionQuality: 'excellent'
      })
      setConnectionAttempts(0)
      console.log('Enhanced Agent connected successfully')
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    ws.onclose = () => {
      setIsConnected(false)
      setAgentStatus({ status: 'error' })
      
      // Attempt to reconnect
      if (connectionAttempts < 5) {
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000)
        console.log(`Reconnecting in ${delay}ms...`)
        
        reconnectTimeoutRef.current = setTimeout(() => {
          setConnectionAttempts(prev => prev + 1)
          connectToEnhancedAgent()
        }, delay)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setAgentStatus({ status: 'error' })
    }
    
    setSocket(ws)
  }
  
  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'connection_established':
        console.log('Enhanced Agent connection confirmed:', data.message)
        break
        
      case 'enhanced_agent_stream':
        handleStreamingResponse(data.data)
        break
        
      case 'status_update':
        setAgentStatus(data.status)
        break
        
      case 'error':
        console.error('Agent error:', data.data)
        setAgentStatus({ status: 'error' })
        break
    }
  }
  
  const handleStreamingResponse = (streamData: any) => {
    const now = new Date()
    
    switch (streamData.response_type) {
      case 'thinking':
        setAgentStatus({
          status: 'processing',
          currentTool: 'thinking',
          progress: 10,
          connectionQuality: 'excellent'
        })
        break
        
      case 'tool_start':
        const toolName = streamData.metadata?.tool?.tool_name || 'unknown'
        setAgentStatus({
          status: 'processing',
          currentTool: toolName,
          progress: 30,
          connectionQuality: 'good'
        })
        
        // Track tool execution start
        setPerformanceMetrics(prev => ({
          ...prev,
          toolExecutions: [
            ...(prev?.toolExecutions || []),
            {
              toolName,
              parameters: streamData.metadata?.tool?.parameters || {},
              startTime: now
            }
          ]
        }))
        break
        
      case 'tool_result':
        setAgentStatus({
          status: 'processing',
          progress: 70,
          connectionQuality: 'good'
        })
        
        // Update tool execution with result
        setPerformanceMetrics(prev => {
          const toolExecutions = [...(prev?.toolExecutions || [])]
          const lastToolIndex = toolExecutions.length - 1
          
          if (lastToolIndex >= 0) {
            toolExecutions[lastToolIndex] = {
              ...toolExecutions[lastToolIndex],
              endTime: now,
              result: streamData.metadata?.result,
              success: streamData.metadata?.success !== false
            }
          }
          
          return {
            ...prev,
            toolExecutions
          }
        })
        break
        
      case 'text':
        setStreamingResponse(streamData.content)
        setCurrentStreamingId(streamData.task_id)
        setAgentStatus({
          status: 'processing',
          progress: 90,
          connectionQuality: 'excellent'
        })
        break
        
      case 'complete':
        // Calculate final performance metrics
        const endTime = now
        const startTime = messageStartTimeRef.current || now
        const totalDuration = endTime.getTime() - startTime.getTime()
        
        // Add final message
        const newMessage: AgentMessage = {
          id: streamData.task_id,
          role: 'assistant',
          content: streamData.content,
          timestamp: now,
          toolResults: streamData.metadata?.tool_results || [],
          metadata: {
            ...streamData.metadata,
            enhanced_mode: true,
            performance: {
              total_duration_ms: totalDuration,
              response_time_ms: streamData.metadata?.response_time || 0
            }
          }
        }
        
        setMessages(prev => [...prev, newMessage])
        setStreamingResponse('')
        setCurrentStreamingId(null)
        setAgentStatus({ 
          status: 'idle',
          connectionQuality: 'excellent'
        })
        
        // Final performance metrics
        setPerformanceMetrics(prev => ({
          responseTime: streamData.metadata?.response_time || 0,
          toolExecutions: prev?.toolExecutions || [],
          totalDuration,
          tokensProcessed: streamData.metadata?.tokens_processed
        }))
        
        messageStartTimeRef.current = null
        break
    }
  }
  
  const sendMessage = useCallback(async (content: string) => {
    if (!socket || !isConnected || !user) return
    
    messageStartTimeRef.current = new Date()
    
    // Add user message immediately
    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setAgentStatus({ 
      status: 'processing',
      connectionQuality: 'good'
    })
    setStreamingResponse('')
    setPerformanceMetrics(null)
    
    // Send to enhanced agent
    socket.send(JSON.stringify({
      type: 'chat_message',
      content,
      thread_id: threadId,
      user_id: user.id
    }))
    
  }, [socket, isConnected, threadId, user])
  
  const retryConnection = useCallback(() => {
    setConnectionAttempts(0)
    connectToEnhancedAgent()
  }, [])
  
  const getLatestToolResults = useCallback(() => {
    const latestMessage = messages[messages.length - 1]
    return latestMessage?.toolResults || []
  }, [messages])
  
  const getConnectionStatus = useCallback(() => {
    if (!isConnected) return 'disconnected'
    if (agentStatus.status === 'error') return 'error'
    if (agentStatus.status === 'connecting') return 'connecting'
    if (agentStatus.status === 'processing') return 'processing'
    return 'connected'
  }, [isConnected, agentStatus.status])
  
  // Enhanced features
  const exportConversation = useCallback(() => {
    return {
      threadId,
      messages,
      performanceMetrics,
      timestamp: new Date().toISOString(),
      enhanced_mode: true
    }
  }, [threadId, messages, performanceMetrics])
  
  const clearConversation = useCallback(async () => {
    try {
      // Clear from Supabase
      await supabase
        .from('messages')
        .delete()
        .eq('thread_id', threadId)
      
      // Clear local state
      setMessages([])
      setStreamingResponse('')
      setPerformanceMetrics(null)
      
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }, [threadId, supabase])
  
  return {
    // Core functionality
    messages,
    streamingResponse,
    agentStatus,
    isConnected,
    sendMessage,
    
    // Enhanced features
    performanceMetrics,
    connectionAttempts,
    retryConnection,
    getLatestToolResults,
    getConnectionStatus,
    exportConversation,
    clearConversation,
    
    // Compatibility with existing ThreadContent interface
    streamingTextContent: streamingResponse,
    streamingToolCall: currentStreamingId ? { id: currentStreamingId } : null,
    handleToolClick: (messageId: string, toolName: string) => {
      // Enhanced tool interaction - could open detailed view
      console.log('Tool clicked:', { messageId, toolName })
    },
    
    // Real-time status
    currentStreamingId,
    isStreamingText: !!streamingResponse,
    
    // Connection quality indicator
    connectionQuality: agentStatus.connectionQuality || 'unknown'
  }
} 