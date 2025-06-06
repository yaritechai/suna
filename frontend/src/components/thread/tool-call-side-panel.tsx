'use client';

import { Project } from '@/lib/api';
import { getToolIcon, getUserFriendlyToolName } from '@/components/thread/utils';
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ApiMessageType } from '@/components/thread/types';
import { CircleDashed, X, ChevronLeft, ChevronRight, Computer, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ToolView } from './tool-views/wrapper';

export interface ToolCallInput {
  assistantCall: {
    content?: string;
    name?: string;
    timestamp?: string;
  };
  toolResult?: {
    content?: string;
    isSuccess?: boolean;
    timestamp?: string;
  };
  messages?: ApiMessageType[];
}

interface ToolCallSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  toolCalls: ToolCallInput[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
  externalNavigateToIndex?: number;
  messages?: ApiMessageType[];
  agentStatus: string;
  project?: Project;
  renderAssistantMessage?: (
    assistantContent?: string,
    toolContent?: string,
  ) => React.ReactNode;
  renderToolResult?: (
    toolContent?: string,
    isSuccess?: boolean,
  ) => React.ReactNode;
  isLoading?: boolean;
  agentName?: string;
  onFileClick?: (filePath: string) => void;
}

interface ToolCallSnapshot {
  id: string;
  toolCall: ToolCallInput;
  index: number;
  timestamp: number;
}

export function ToolCallSidePanel({
  isOpen,
  onClose,
  toolCalls,
  currentIndex,
  onNavigate,
  messages,
  agentStatus,
  project,
  isLoading = false,
  externalNavigateToIndex,
  agentName,
  onFileClick,
}: ToolCallSidePanelProps) {
  const [dots, setDots] = React.useState('');
  const [internalIndex, setInternalIndex] = React.useState(0);
  const [navigationMode, setNavigationMode] = React.useState<'live' | 'manual'>('live');
  const [toolCallSnapshots, setToolCallSnapshots] = React.useState<ToolCallSnapshot[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    const newSnapshots = toolCalls.map((toolCall, index) => ({
      id: `${index}-${toolCall.assistantCall.timestamp || Date.now()}`,
      toolCall,
      index,
      timestamp: Date.now(),
    }));

    const hadSnapshots = toolCallSnapshots.length > 0;
    const hasNewSnapshots = newSnapshots.length > toolCallSnapshots.length;
    setToolCallSnapshots(newSnapshots);

    if (!isInitialized && newSnapshots.length > 0) {
      const completedCount = newSnapshots.filter(s =>
        s.toolCall.toolResult?.content &&
        s.toolCall.toolResult.content !== 'STREAMING'
      ).length;

      if (completedCount > 0) {
        let lastCompletedIndex = -1;
        for (let i = newSnapshots.length - 1; i >= 0; i--) {
          const snapshot = newSnapshots[i];
          if (snapshot.toolCall.toolResult?.content &&
            snapshot.toolCall.toolResult.content !== 'STREAMING') {
            lastCompletedIndex = i;
            break;
          }
        }
        setInternalIndex(Math.max(0, lastCompletedIndex));
      } else {
        setInternalIndex(Math.max(0, newSnapshots.length - 1));
      }
      setIsInitialized(true);
    } else if (hasNewSnapshots && navigationMode === 'live') {
      const latestSnapshot = newSnapshots[newSnapshots.length - 1];
      const isLatestStreaming = latestSnapshot?.toolCall.toolResult?.content === 'STREAMING';
      if (isLatestStreaming) {
        let lastCompletedIndex = -1;
        for (let i = newSnapshots.length - 1; i >= 0; i--) {
          const snapshot = newSnapshots[i];
          if (snapshot.toolCall.toolResult?.content &&
            snapshot.toolCall.toolResult.content !== 'STREAMING') {
            lastCompletedIndex = i;
            break;
          }
        }
        if (lastCompletedIndex >= 0) {
          setInternalIndex(lastCompletedIndex);
        } else {
          setInternalIndex(newSnapshots.length - 1);
        }
      } else {
        setInternalIndex(newSnapshots.length - 1);
      }
    } else if (hasNewSnapshots && navigationMode === 'manual') {
    }
  }, [toolCalls, navigationMode, toolCallSnapshots.length, isInitialized]);

  React.useEffect(() => {
    if (isOpen && !isInitialized && toolCallSnapshots.length > 0) {
      setInternalIndex(Math.min(currentIndex, toolCallSnapshots.length - 1));
    }
  }, [isOpen, currentIndex, isInitialized, toolCallSnapshots.length]);

  const safeInternalIndex = Math.min(internalIndex, Math.max(0, toolCallSnapshots.length - 1));
  const currentSnapshot = toolCallSnapshots[safeInternalIndex];
  const currentToolCall = currentSnapshot?.toolCall;
  const totalCalls = toolCallSnapshots.length;

  // Extract meaningful tool name, especially for MCP tools
  const extractToolName = (toolCall: any) => {
    const rawName = toolCall?.assistantCall?.name || 'Tool Call';

    // Handle MCP tools specially
    if (rawName === 'call-mcp-tool') {
      const assistantContent = toolCall?.assistantCall?.content;
      if (assistantContent) {
        try {
          // Try to extract the actual MCP tool name from the content
          const toolNameMatch = assistantContent.match(/tool_name="([^"]+)"/);
          if (toolNameMatch && toolNameMatch[1]) {
            const mcpToolName = toolNameMatch[1];
            // Use the MCP tool name for better display
            return getUserFriendlyToolName(mcpToolName);
          }
        } catch (e) {
          // Fall back to generic name if parsing fails
        }
      }
      return 'External Tool';
    }

    // For all other tools, use the friendly name
    return getUserFriendlyToolName(rawName);
  };

  const completedToolCalls = toolCallSnapshots.filter(snapshot =>
    snapshot.toolCall.toolResult?.content &&
    snapshot.toolCall.toolResult.content !== 'STREAMING'
  );
  const totalCompletedCalls = completedToolCalls.length;

  let displayToolCall = currentToolCall;
  let displayIndex = safeInternalIndex;
  let displayTotalCalls = totalCalls;

  const isCurrentToolStreaming = currentToolCall?.toolResult?.content === 'STREAMING';
  if (isCurrentToolStreaming && totalCompletedCalls > 0) {
    const lastCompletedSnapshot = completedToolCalls[completedToolCalls.length - 1];
    displayToolCall = lastCompletedSnapshot.toolCall;
    displayIndex = totalCompletedCalls - 1;
    displayTotalCalls = totalCompletedCalls;
  } else if (!isCurrentToolStreaming) {
    const completedIndex = completedToolCalls.findIndex(snapshot => snapshot.id === currentSnapshot?.id);
    if (completedIndex >= 0) {
      displayIndex = completedIndex;
      displayTotalCalls = totalCompletedCalls;
    }
  }

  const currentToolName = displayToolCall?.assistantCall?.name || 'Tool Call';
  const CurrentToolIcon = getToolIcon(
    displayToolCall?.assistantCall?.name || 'unknown',
  );
  const isStreaming = displayToolCall?.toolResult?.content === 'STREAMING';

  // Extract actual success value from tool content with fallbacks
  const getActualSuccess = (toolCall: any): boolean => {
    const content = toolCall?.toolResult?.content;
    if (!content) return toolCall?.toolResult?.isSuccess ?? true;

    const safeParse = (data: any) => {
      try { return typeof data === 'string' ? JSON.parse(data) : data; }
      catch { return null; }
    };

    const parsed = safeParse(content);
    if (!parsed) return toolCall?.toolResult?.isSuccess ?? true;

    if (parsed.content) {
      const inner = safeParse(parsed.content);
      if (inner?.tool_execution?.result?.success !== undefined) {
        return inner.tool_execution.result.success;
      }
    }
    const success = parsed.tool_execution?.result?.success ??
      parsed.result?.success ??
      parsed.success;

    return success !== undefined ? success : (toolCall?.toolResult?.isSuccess ?? true);
  };

  const isSuccess = isStreaming ? true : getActualSuccess(displayToolCall);

  const internalNavigate = React.useCallback((newIndex: number, source: string = 'internal') => {
    if (newIndex < 0 || newIndex >= totalCalls) return;

    const isNavigatingToLatest = newIndex === totalCalls - 1;

    console.log(`[INTERNAL_NAV] ${source}: ${internalIndex} -> ${newIndex}, mode will be: ${isNavigatingToLatest ? 'live' : 'manual'}`);

    setInternalIndex(newIndex);

    if (isNavigatingToLatest) {
      setNavigationMode('live');
    } else {
      setNavigationMode('manual');
    }

    if (source === 'user_explicit') {
      onNavigate(newIndex);
    }
  }, [internalIndex, totalCalls, onNavigate]);

  const isLiveMode = navigationMode === 'live';
  const showJumpToLive = navigationMode === 'manual' && agentStatus === 'running';
  const showJumpToLatest = navigationMode === 'manual' && agentStatus !== 'running';

  const navigateToPrevious = React.useCallback(() => {
    if (displayIndex > 0) {
      const targetCompletedIndex = displayIndex - 1;
      const targetSnapshot = completedToolCalls[targetCompletedIndex];
      if (targetSnapshot) {
        const actualIndex = toolCallSnapshots.findIndex(s => s.id === targetSnapshot.id);
        if (actualIndex >= 0) {
          setNavigationMode('manual');
          internalNavigate(actualIndex, 'user_explicit');
        }
      }
    }
  }, [displayIndex, completedToolCalls, toolCallSnapshots, internalNavigate]);

  const navigateToNext = React.useCallback(() => {
    if (displayIndex < displayTotalCalls - 1) {
      const targetCompletedIndex = displayIndex + 1;
      const targetSnapshot = completedToolCalls[targetCompletedIndex];
      if (targetSnapshot) {
        const actualIndex = toolCallSnapshots.findIndex(s => s.id === targetSnapshot.id);
        if (actualIndex >= 0) {
          const isLatestCompleted = targetCompletedIndex === completedToolCalls.length - 1;
          if (isLatestCompleted) {
            setNavigationMode('live');
          } else {
            setNavigationMode('manual');
          }
          internalNavigate(actualIndex, 'user_explicit');
        }
      }
    }
  }, [displayIndex, displayTotalCalls, completedToolCalls, toolCallSnapshots, internalNavigate]);

  const jumpToLive = React.useCallback(() => {
    setNavigationMode('live');
    internalNavigate(totalCalls - 1, 'user_explicit');
  }, [totalCalls, internalNavigate]);

  const jumpToLatest = React.useCallback(() => {
    setNavigationMode('manual');
    internalNavigate(totalCalls - 1, 'user_explicit');
  }, [totalCalls, internalNavigate]);

  const renderStatusButton = React.useCallback(() => {
    const baseClasses = "flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-full w-[116px]";
    const dotClasses = "w-1.5 h-1.5 rounded-full";
    const textClasses = "text-xs font-medium";

    if (isLiveMode) {
      if (agentStatus === 'running') {
        return (
          <div className={`${baseClasses} bg-success/10 border border-success/20`}>
            <div className={`${dotClasses} bg-success animate-pulse`} />
            <span className={`${textClasses} text-success`}>Live Updates</span>
          </div>
        );
      } else {
        return (
          <div className={`${baseClasses} bg-base-200 border border-base-300`}>
            <div className={`${dotClasses} bg-base-content/50`} />
            <span className={`${textClasses} text-base-content/70`}>Latest Tool</span>
          </div>
        );
      }
    } else {
      if (agentStatus === 'running') {
        return (
          <div
            className={`${baseClasses} bg-success/10 border border-success/20 hover:bg-success/20 transition-colors cursor-pointer`}
            onClick={jumpToLive}
          >
            <div className={`${dotClasses} bg-success animate-pulse`} />
            <span className={`${textClasses} text-success`}>Jump to Live</span>
          </div>
        );
      } else {
        return (
          <div
            className={`${baseClasses} bg-info/10 border border-info/20 hover:bg-info/20 transition-colors cursor-pointer`}
            onClick={jumpToLatest}
          >
            <div className={`${dotClasses} bg-info`} />
            <span className={`${textClasses} text-info`}>Jump to Latest</span>
          </div>
        );
      }
    }
  }, [isLiveMode, agentStatus, jumpToLive, jumpToLatest]);

  const handleSliderChange = React.useCallback(([newValue]: [number]) => {
    const targetSnapshot = completedToolCalls[newValue];
    if (targetSnapshot) {
      const actualIndex = toolCallSnapshots.findIndex(s => s.id === targetSnapshot.id);
      if (actualIndex >= 0) {
        const isLatestCompleted = newValue === completedToolCalls.length - 1;
        if (isLatestCompleted) {
          setNavigationMode('live');
        } else {
          setNavigationMode('manual');
        }

        internalNavigate(actualIndex, 'user_explicit');
      }
    }
  }, [completedToolCalls, toolCallSnapshots, internalNavigate]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleSidebarToggle = (event: CustomEvent) => {
      if (event.detail.expanded) {
        onClose();
      }
    };

    window.addEventListener(
      'sidebar-left-toggled',
      handleSidebarToggle as EventListener,
    );
    return () =>
      window.removeEventListener(
        'sidebar-left-toggled',
        handleSidebarToggle as EventListener,
      );
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (externalNavigateToIndex !== undefined && externalNavigateToIndex >= 0 && externalNavigateToIndex < totalCalls) {
      internalNavigate(externalNavigateToIndex, 'external_click');
    }
  }, [externalNavigateToIndex, totalCalls, internalNavigate]);

  React.useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div
        className={cn(
          'fixed inset-y-0 right-0 flex flex-col z-30 h-screen transition-all duration-200 ease-in-out bg-base-100 shadow-2xl',
          isMobile
            ? 'w-full'
            : 'w-[90%] sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[650px]',
          !isOpen && 'translate-x-full',
        )}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-end p-4 bg-base-100 border-b border-base-300/50 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-xl transition-all duration-200 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 p-8 bg-base-50">
              <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-info/10 to-info/5 border border-info/20 rounded-full flex items-center justify-center shadow-lg">
                    <CircleDashed className="h-10 w-10 text-info animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 px-2 py-1 bg-info text-info-content text-xs font-medium rounded-full shadow-sm">
                    Loading
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-base-content">
                    Starting up...
                  </h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    Yari Computer is initializing. Please wait a moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!displayToolCall && toolCallSnapshots.length === 0) {
      return (
        <div className="flex flex-col h-full bg-base-50">
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center shadow-lg">
                  <Computer className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-base-100 border-2 border-base-200 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-base-content">
                  Getting ready...
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Yari Computer is initializing. Tool results will appear here shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!displayToolCall && toolCallSnapshots.length > 0) {
      const firstStreamingTool = toolCallSnapshots.find(s => s.toolCall.toolResult?.content === 'STREAMING');
      if (firstStreamingTool && totalCompletedCalls === 0) {
        return (
          <div className="flex flex-col h-full bg-base-50">
            <div className="flex flex-col items-center justify-center flex-1 p-8">
              <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-info/10 to-info/5 border border-info/20 rounded-full flex items-center justify-center shadow-lg">
                    <CircleDashed className="h-10 w-10 text-info animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 px-2 py-1 bg-info text-info-content text-xs font-medium rounded-full shadow-sm">
                    Running
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-base-content">
                    Tool is running
                  </h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {getUserFriendlyToolName(firstStreamingTool.toolCall.assistantCall.name || 'Tool')} is currently executing. Results will appear when complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col h-full bg-base-50">
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center shadow-lg">
                  <Computer className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-base-100 border-2 border-base-200 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 bg-warning rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-base-content">
                  Preparing tools...
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Yari Computer is setting up the workspace. Tool results will appear here shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const toolView = (
      <ToolView
        name={displayToolCall.assistantCall.name}
        assistantContent={displayToolCall.assistantCall.content}
        toolContent={displayToolCall.toolResult?.content}
        assistantTimestamp={displayToolCall.assistantCall.timestamp}
        toolTimestamp={displayToolCall.toolResult?.timestamp}
        isSuccess={isSuccess}
        isStreaming={isStreaming}
        project={project}
        messages={messages}
        agentStatus={agentStatus}
        currentIndex={displayIndex}
        totalCalls={displayTotalCalls}
        onFileClick={onFileClick}
      />
    );

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto bg-base-50">
          <div className="p-4">
            {toolView}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 flex flex-col z-30 h-screen transition-all duration-200 ease-in-out bg-base-200/95 backdrop-blur-xl shadow-2xl rounded-l-2xl',
        isMobile
          ? 'w-full rounded-l-none'
          : 'w-[40vw] sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[650px]',
        !isOpen && 'translate-x-full',
      )}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex h-screen">
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>

      {(displayTotalCalls > 1 || (isCurrentToolStreaming && totalCompletedCalls > 0)) && (
        <div
          className={cn(
            'border-t border-base-300/50 bg-base-100/80 backdrop-blur-sm',
            isMobile ? 'p-3' : 'px-4 py-3',
          )}
        >
          {isMobile ? (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPrevious}
                disabled={displayIndex <= 0}
                className="h-8 px-3 text-xs border-base-300 hover:bg-base-200"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span>Prev</span>
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/70 font-medium tabular-nums min-w-[44px] bg-base-200 px-2 py-1 rounded-md">
                  {displayIndex + 1}/{displayTotalCalls}
                </span>
                {renderStatusButton()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={navigateToNext}
                disabled={displayIndex >= displayTotalCalls - 1}
                className="h-8 px-3 text-xs border-base-300 hover:bg-base-200"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateToPrevious}
                  disabled={displayIndex <= 0}
                  className="h-7 w-7 text-base-content/60 hover:text-base-content hover:bg-base-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-base-content/70 font-medium tabular-nums px-2 py-1 min-w-[44px] text-center bg-base-200 rounded-md">
                  {displayIndex + 1}/{displayTotalCalls}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateToNext}
                  disabled={displayIndex >= displayTotalCalls - 1}
                  className="h-7 w-7 text-base-content/60 hover:text-base-content hover:bg-base-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 relative">
                <Slider
                  min={0}
                  max={displayTotalCalls - 1}
                  step={1}
                  value={[displayIndex]}
                  onValueChange={handleSliderChange}
                  className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-base-300 [&>span:first-child>span]:bg-primary [&>span:first-child>span]:h-1.5"
                />
              </div>

              <div className="flex items-center gap-2">
                {renderStatusButton()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}