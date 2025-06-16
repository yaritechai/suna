'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAdvancedWebSocket } from '@/hooks/useAdvancedWebSocket'
import { useAgentStreaming } from '@/hooks/useAgentStreaming'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { 
  Play, 
  Square, 
  Zap, 
  Activity, 
  Code, 
  Terminal, 
  Globe, 
  FileText,
  Clock,
  Cpu,
  Wifi,
  WifiOff
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import heavy components
const CodeEditor = dynamic(() => import('./CodeEditor'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-slate-900 text-white">Loading Editor...</div>
})

const TerminalView = dynamic(() => import('./TerminalView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-black text-green-400">Initializing Terminal...</div>
})

const BrowserView = dynamic(() => import('./BrowserView'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-gray-100">Loading Browser...</div>
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  thinking?: string
  toolResults?: any[]
  streaming?: boolean
}

interface PerformanceMetrics {
  latency: number
  bandwidth: number
  cpuUsage: number
  memoryUsage: number
  activeConnections: number
  requestsPerSecond: number
}

interface AgentStatus {
  isProcessing: boolean
  currentTool?: string
  taskProgress: number
  estimatedCompletion?: Date
  queueLength: number
}

export function NextGenAgentInterface() {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Real-time hooks
  const { 
    streamingResponse, 
    isProcessing, 
    toolResults, 
    agentThinking,
    taskProgress,
    queueLength
  } = useAgentStreaming()
  
  const { 
    sendMessage, 
    isConnected, 
    latency,
    bandwidth,
    messageQueue,
    connectionQuality
  } = useAdvancedWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
    reconnect: true,
    compression: true,
    priority: 'high'
  })

  // Performance monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    latency: 0,
    bandwidth: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 1,
    requestsPerSecond: 0
  })

  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    isProcessing: false,
    taskProgress: 0,
    queueLength: 0
  })

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, streamingResponse])

  // Update performance metrics
  useEffect(() => {
    setPerformanceMetrics(prev => ({
      ...prev,
      latency,
      bandwidth,
      activeConnections: isConnected ? 1 : 0
    }))
  }, [latency, bandwidth, isConnected])

  // Update agent status
  useEffect(() => {
    setAgentStatus({
      isProcessing,
      currentTool: toolResults?.activeTools?.[0]?.name,
      taskProgress,
      queueLength
    })
  }, [isProcessing, toolResults, taskProgress, queueLength])

  // Handle message submission
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !isConnected) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Send to agent
    await sendMessage({
      type: 'chat_message',
      content: newMessage.content,
      messageId: newMessage.id
    })

    // Focus input
    inputRef.current?.focus()
  }, [inputValue, isConnected, sendMessage])

  // Handle streaming response
  useEffect(() => {
    if (streamingResponse) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
          // Update existing streaming message
          return prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, content: streamingResponse, thinking: agentThinking }
              : msg
          )
        } else {
          // Create new streaming message
          return [...prev, {
            id: `stream-${Date.now()}`,
            role: 'assistant',
            content: streamingResponse,
            timestamp: new Date(),
            thinking: agentThinking,
            toolResults: toolResults?.results,
            streaming: true
          }]
        }
      })
    }
  }, [streamingResponse, agentThinking, toolResults])

  // Performance indicator color
  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-500'
    if (value <= thresholds[1]) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Panel Group */}
      <ResizablePanelGroup direction="horizontal" className="h-full">
        
        {/* Chat Panel */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <Card className="h-full rounded-none border-0 bg-slate-900/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  AI Agent Chat
                </CardTitle>
                
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <Wifi className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className={getPerformanceColor(latency, [50, 200])}>
                    {latency}ms
                  </Badge>
                </div>
              </div>
              
              {/* Agent Status */}
              {agentStatus.isProcessing && (
                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">
                      {agentStatus.currentTool ? `Running ${agentStatus.currentTool}` : 'Processing...'}
                    </span>
                    <span className="text-blue-400">{Math.round(agentStatus.taskProgress)}%</span>
                  </div>
                  <div className="w-full bg-blue-900/50 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${agentStatus.taskProgress}%` }}
                    />
                  </div>
                  {agentThinking && (
                    <div className="text-xs text-blue-300 mt-2 italic">
                      💭 {agentThinking}
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="h-full flex flex-col pb-4">
              {/* Messages */}
              <ScrollArea 
                ref={chatContainerRef}
                className="flex-1 pr-4"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        
                        {/* Tool Results */}
                        {message.toolResults && message.toolResults.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.toolResults.map((result, index) => (
                              <div key={index} className="bg-slate-800 rounded p-2 text-xs">
                                <div className="text-green-400 font-medium">{result.tool}</div>
                                <div className="text-slate-300">{result.summary}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="flex gap-2 mt-4">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask the AI agent anything..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !isConnected || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Queue Status */}
              {agentStatus.queueLength > 0 && (
                <div className="text-xs text-slate-400 mt-2">
                  {agentStatus.queueLength} tasks in queue
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle className="bg-slate-700" />
        
        {/* Tool Output Panel */}
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b border-slate-700 bg-slate-900/50">
              <TabsList className="bg-transparent">
                <TabsTrigger value="chat" className="text-slate-300">
                  <FileText className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="code" className="text-slate-300">
                  <Code className="h-4 w-4 mr-2" />
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="terminal" className="text-slate-300">
                  <Terminal className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="browser" className="text-slate-300">
                  <Globe className="h-4 w-4 mr-2" />
                  Browser
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="h-full m-0">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <div className="h-full p-4 bg-slate-900/30">
                    <h3 className="text-white font-semibold mb-4">Agent Activity Overview</h3>
                    
                    {/* Recent Tool Results */}
                    {toolResults?.results && toolResults.results.length > 0 && (
                      <div className="space-y-4">
                        {toolResults.results.map((result, index) => (
                          <Card key={index} className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm text-white">
                                  {result.tool || 'Unknown Tool'}
                                </CardTitle>
                                <Badge variant="outline" className={
                                  result.success ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                                }>
                                  {result.success ? 'Success' : 'Failed'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {result.screenshot && (
                                <img 
                                  src={`data:image/png;base64,${result.screenshot}`}
                                  alt="Tool Result"
                                  className="w-full rounded border border-slate-600 mb-2"
                                />
                              )}
                              {result.output && (
                                <pre className="text-xs text-slate-300 bg-slate-900 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(result.output, null, 2)}
                                </pre>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </ResizablePanel>
                
                <ResizableHandle className="bg-slate-700" />
                
                <ResizablePanel defaultSize={30}>
                  {/* Performance Dashboard */}
                  <div className="h-full p-4 bg-slate-800/50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Metrics
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">Latency</span>
                            <span className={`text-sm font-mono ${getPerformanceColor(performanceMetrics.latency, [50, 200])}`}>
                              {performanceMetrics.latency}ms
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">Bandwidth</span>
                            <span className="text-blue-400 text-sm font-mono">
                              {(performanceMetrics.bandwidth / 1024).toFixed(1)}KB/s
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">Queue</span>
                            <span className="text-yellow-400 text-sm font-mono">
                              {messageQueue?.length || 0}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm">Quality</span>
                            <Badge variant="outline" className={
                              connectionQuality === 'excellent' ? 'text-green-400 border-green-400' :
                              connectionQuality === 'good' ? 'text-yellow-400 border-yellow-400' :
                              'text-red-400 border-red-400'
                            }>
                              {connectionQuality}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0">
              <CodeEditor 
                files={toolResults?.files || []}
                onChange={(content) => {
                  // Handle code changes
                }}
                realTimeSync={true}
                theme="dark"
              />
            </TabsContent>
            
            <TabsContent value="terminal" className="h-full m-0">
              <TerminalView 
                sessions={toolResults?.terminal || []}
                interactive={true}
                onCommand={(command) => {
                  // Handle terminal commands
                }}
              />
            </TabsContent>
            
            <TabsContent value="browser" className="h-full m-0">
              <BrowserView 
                screenshot={toolResults?.browser?.screenshot}
                url={toolResults?.browser?.url}
                interactive={true}
                onNavigate={(url) => {
                  // Handle browser navigation
                }}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date().toLocaleTimeString()}
            </span>
            
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              Agent Ready
            </span>
            
            {agentStatus.isProcessing && (
              <span className="flex items-center gap-1 text-blue-400">
                <Activity className="h-3 w-3 animate-pulse" />
                Processing...
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span>WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</span>
            <span>Latency: {latency}ms</span>
            <span>Tools: {toolResults?.activeTools?.length || 0} active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NextGenAgentInterface 