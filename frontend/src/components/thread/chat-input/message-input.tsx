import React, { forwardRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Square, Loader2, ArrowUp, Paperclip, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile } from './chat-input';
import { FileUploadHandler } from './file-upload-handler';
import { VoiceRecorder } from './voice-recorder';
import { ModelSelector } from './model-selector';
import { SubscriptionStatus } from './_use-model-selection';
import { isLocalMode } from '@/lib/config';
import { TooltipContent } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTranscription: (text: string) => void;
  placeholder: string;
  loading: boolean;
  disabled: boolean;
  isAgentRunning: boolean;
  onStopAgent?: () => void;
  isDraggingOver: boolean;
  uploadedFiles: UploadedFile[];

  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  sandboxId?: string;
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  hideAttachments?: boolean;
  messages?: any[]; // Add messages prop

  selectedModel: string;
  onModelChange: (model: string) => void;
  modelOptions: any[];
  subscriptionStatus: SubscriptionStatus;
  canAccessModel: (modelId: string) => boolean;
  refreshCustomModels?: () => void;
}

export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onTranscription,
      placeholder,
      loading,
      disabled,
      isAgentRunning,
      onStopAgent,
      isDraggingOver,
      uploadedFiles,

      fileInputRef,
      isUploading,
      sandboxId,
      setPendingFiles,
      setUploadedFiles,
      setIsUploading,
      hideAttachments = false,
      messages = [],

      selectedModel,
      onModelChange,
      modelOptions,
      subscriptionStatus,
      canAccessModel,
      refreshCustomModels,
    },
    ref,
  ) => {
    useEffect(() => {
      const textarea = ref as React.RefObject<HTMLTextAreaElement>;
      if (!textarea.current) return;

      const adjustHeight = () => {
        // Reset height to auto to get proper scrollHeight
        textarea.current!.style.height = 'auto';
        
        // Calculate new height with better constraints
        const scrollHeight = textarea.current!.scrollHeight;
        const minHeight = 40; // Minimum height
        const maxHeight = 120; // Maximum height before scrolling
        
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        textarea.current!.style.height = `${newHeight}px`;
        
        // If content exceeds maxHeight, enable scrolling
        if (scrollHeight > maxHeight) {
          textarea.current!.style.overflowY = 'auto';
        } else {
          textarea.current!.style.overflowY = 'hidden';
        }
      };

      // Adjust height immediately
      adjustHeight();
      
      // Use requestAnimationFrame for smoother updates
      const timeoutId = setTimeout(adjustHeight, 0);

      window.addEventListener('resize', adjustHeight);
      return () => {
        window.removeEventListener('resize', adjustHeight);
        clearTimeout(timeoutId);
      };
    }, [value, ref]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        if (
          (value.trim() || uploadedFiles.length > 0) &&
          !loading &&
          (!disabled || isAgentRunning)
        ) {
          onSubmit(e as unknown as React.FormEvent);
        }
      }
    };

    const handleFileClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <div className="flex flex-col w-full h-auto">
        {/* Textarea at the top */}
        <div className={cn(
          "relative w-full transition-all duration-200 mb-4",
          isDraggingOver && "ring-2 ring-blue-300 dark:ring-blue-600"
        )}>
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || loading}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent border-0",
              "px-4 pt-1 pb-3 text-sm text-base-content",
              "placeholder:text-base-content/60",
              "focus:outline-none focus:ring-0 focus:bg-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "leading-5 transition-all duration-200",
              // Clean scrolling without visible scrollbar
              "scrollbar-none overflow-y-auto",
              // Mobile responsive text size
              "text-base sm:text-sm"
            )}
            style={{
              minHeight: '40px',
              maxHeight: '120px'
            }}
          />
        </div>

        {/* Action buttons container at the bottom */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Left side - Model selector (hidden on small screens, shown as icon) */}
          <div className="flex items-center">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
              modelOptions={modelOptions}
              subscriptionStatus={subscriptionStatus}
              canAccessModel={canAccessModel}
              refreshCustomModels={refreshCustomModels}
            />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-1.5">
            {!hideAttachments && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileClick}
                disabled={disabled || loading}
                className={cn(
                  "h-8 w-8 p-0 text-base-content/60 hover:text-base-content",
                  "hover:bg-base-200 rounded-lg transition-all duration-200",
                  "focus-visible:ring-2 focus-visible:ring-primary/50"
                )}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            )}

            <VoiceRecorder
              onTranscription={onTranscription}
              disabled={disabled || loading}
            />

            <Button
              type="submit"
              onClick={isAgentRunning && onStopAgent ? onStopAgent : onSubmit}
              size="sm"
              disabled={
                (!value.trim() && uploadedFiles.length === 0 && !isAgentRunning) ||
                loading ||
                (disabled && !isAgentRunning)
              }
              className={cn(
                "h-8 w-8 p-0 rounded-lg transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                isAgentRunning
                  ? "bg-error hover:bg-error/90 text-error-content focus-visible:ring-error/50"
                  : "bg-primary hover:bg-primary/90 text-primary-content disabled:bg-base-300 disabled:text-base-content/50 focus-visible:ring-primary/50"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAgentRunning ? (
                <Square className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        {!hideAttachments && (
          <FileUploadHandler
            ref={fileInputRef}
            loading={loading}
            disabled={disabled}
            isAgentRunning={isAgentRunning}
            isUploading={isUploading}
            sandboxId={sandboxId}
            setPendingFiles={setPendingFiles}
            setUploadedFiles={setUploadedFiles}
            setIsUploading={setIsUploading}
            messages={messages}
          />
        )}

        {/* Subscription status notification */}
        {subscriptionStatus === 'no_subscription' && !isLocalMode() && (
          <div className="flex justify-center mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-amber-500 cursor-help">
                    Upgrade for full performance
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The free tier is severely limited by inferior models; upgrade to experience the true full Yari experience.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    );
  },
);

MessageInput.displayName = 'MessageInput';