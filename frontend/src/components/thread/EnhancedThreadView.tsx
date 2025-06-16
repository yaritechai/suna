'use client'

import React, { useState, useEffect } from 'react'
import { useEnhancedAgent } from '@/hooks/useEnhancedAgent'
import { ThreadContent } from './content/ThreadContent'
import { ChatInput } from './chat-input/ChatInput'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Zap, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Download,
  Trash2,
  RotateCcw
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EnhancedThreadViewProps {
  threadId: string
  onToggleMode?: (enhanced: boolean) => void
  showEnhancedToggle?: boolean
  className?: string
}

interface PerformanceIndicatorProps {
  value: number
  label: string
  unit: string
  status: 'excellent' | 'good' | 'poor'
}

function PerformanceIndicator({ value, label, unit, status }: PerformanceIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor()}`}>
      {value}{unit} {label}
    </div>
  )
}

export function EnhancedThreadView({ 
  threadId, 
  onToggleMode, 
  showEnhancedToggle = true,
  className = ""
}: EnhancedThreadViewProps) {
  const {
    messages,
    streamingResponse,
    agentStatus,
    isConnected,
    sendMessage,
    performanceMetrics,
    connectionAttempts,
    retryConnection,
    getConnectionStatus,
    exportConversation,
    clearConversation,
    connectionQuality
  } = useEnhancedAgent(threadId)
  
  const [showPerformancePanel, setShowPerformancePanel] = useState(false)
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
  }
  
  const getConnectionIcon = () => {
    switch (getConnectionStatus()) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-600" />
      case 'processing':
        return <Activity className="h-3 w-3 animate-pulse text-blue-600" />
      case 'error':
      case 'disconnected':
        return <WifiOff className="h-3 w-3 text-red-600" />
      default:
        return <AlertCircle className="h-3 w-3 text-yellow-600" />
    }
  }
  
  const getPerformanceStatus = (ms: number) => {
    if (ms < 500) return 'excellent'
    if (ms < 2000) return 'good'
    return 'poor'
  }
  
  const handleExportConversation = () => {
    const data = exportConversation()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enhanced-conversation-${threadId}-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <TooltipProvider>
      <div className={`flex flex-col h-full bg-background ${className}`}>
        {/* Enhanced Mode Header */}
        {showEnhancedToggle && (
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-green-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-green-950/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="font-semibold text-blue-900 dark:text-blue-100">Enhanced Agent V2</span>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      {getConnectionIcon()}
                      <span className="text-xs font-medium">
                        {getConnectionStatus()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connection: {getConnectionStatus()}</p>
                    <p>Quality: {connectionQuality}</p>
                    {connectionAttempts > 0 && <p>Attempts: {connectionAttempts}</p>}
                  </TooltipContent>
                </Tooltip>
                
                {/* Performance Indicators */}
                {performanceMetrics && (
                  <div className="flex items-center gap-1">
                    <PerformanceIndicator
                      value={Math.round(performanceMetrics.responseTime)}
                      label="resp"
                      unit="ms"
                      status={getPerformanceStatus(performanceMetrics.responseTime)}
                    />
                    <PerformanceIndicator
                      value={Math.round(performanceMetrics.totalDuration)}
                      label="total"
                      unit="ms"
                      status={getPerformanceStatus(performanceMetrics.totalDuration)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Advanced Controls Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              >
                <Cpu className="h-4 w-4" />
                {showAdvancedControls ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
              
              {/* Mode Toggle */}
              {onToggleMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleMode(false)}
                >
                  Classic Mode
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Advanced Controls Panel */}
        <Collapsible open={showAdvancedControls}>
          <CollapsibleContent>
            <div className="p-3 bg-muted/30 border-b">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Enhanced Controls</h4>
                <Badge variant="secondary" className="text-xs">
                  V2.0
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* Connection Controls */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryConnection}
                  disabled={isConnected}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reconnect
                </Button>
                
                {/* Performance Panel Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPerformancePanel(!showPerformancePanel)}
                  className="flex items-center gap-1"
                >
                  <Activity className="h-3 w-3" />
                  Metrics
                </Button>
                
                {/* Export Conversation */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportConversation}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Export
                </Button>
                
                {/* Clear Conversation */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearConversation}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
              
              {/* Performance Panel */}
              <Collapsible open={showPerformancePanel}>
                <CollapsibleContent>
                  <Separator className="my-3" />
                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-muted-foreground">Performance Metrics</h5>
                    
                    {performanceMetrics ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <div className="text-muted-foreground">Response Time</div>
                          <div className="font-mono font-medium">
                            {Math.round(performanceMetrics.responseTime)}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Duration</div>
                          <div className="font-mono font-medium">
                            {Math.round(performanceMetrics.totalDuration)}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tools Used</div>
                          <div className="font-mono font-medium">
                            {performanceMetrics.toolExecutions.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Success Rate</div>
                          <div className="font-mono font-medium">
                            {performanceMetrics.toolExecutions.length > 0
                              ? Math.round(
                                  (performanceMetrics.toolExecutions.filter(t => t.success).length / 
                                   performanceMetrics.toolExecutions.length) * 100
                                )
                              : 100}%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Send a message to see performance metrics
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Thread Content with Enhanced Features */}
        <div className="flex-1 overflow-hidden">
          <ThreadContent
            messages={messages}
            streamingTextContent={streamingResponse}
            agentStatus={agentStatus.status}
            handleToolClick={(messageId, toolName) => {
              console.log('Enhanced tool interaction:', { messageId, toolName })
              // Could implement enhanced tool result viewer here
            }}
            handleOpenFileViewer={(filePath) => {
              console.log('Enhanced file viewer:', filePath)
              // Could implement enhanced file viewer here
            }}
            // Enhanced branding
            agentName="Enhanced Yari"
            agentAvatar={
              <div className="relative">
                <Zap className="h-4 w-4 text-blue-600" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
              </div>
            }
            // Enhanced empty state
            emptyStateComponent={
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="relative">
                  <Zap className="h-12 w-12 text-blue-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Enhanced Agent V2 Ready</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Experience 30x faster responses with real-time streaming, 
                    parallel tool execution, and smart caching.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Sub-second browser operations</span>
                    <Separator orientation="vertical" className="h-3" />
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Real-time streaming</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
        
        {/* Enhanced Chat Input */}
        <div className="border-t bg-background">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected || agentStatus.status === 'processing'}
            placeholder={
              !isConnected 
                ? "Connecting to Enhanced Agent..." 
                : agentStatus.status === 'processing'
                ? "Enhanced Agent is processing..."
                : "Message Enhanced Agent V2 (30x faster!)..."
            }
          />
        </div>
        
        {/* Real-time Status Bar */}
        {(agentStatus.currentTool || agentStatus.progress) && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border-t px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>
                  {agentStatus.currentTool 
                    ? `Running ${agentStatus.currentTool}...`
                    : 'Processing...'
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {agentStatus.progress && (
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${agentStatus.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                      {agentStatus.progress}%
                    </span>
                  </div>
                )}
                
                {connectionQuality && (
                  <Badge variant="outline" className="text-xs">
                    {connectionQuality}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Connection Error State */}
        {!isConnected && connectionAttempts > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border-t px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-3 w-3" />
                <span>Connection lost. Retrying... ({connectionAttempts}/5)</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={retryConnection}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Retry Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
} 