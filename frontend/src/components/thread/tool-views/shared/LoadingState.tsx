import React, { useState, useEffect } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  title: string;
  subtitle?: string;
  filePath?: string | null;
  showProgress?: boolean;
  progressText?: string;
  autoProgress?: boolean;
  initialProgress?: number;
}

export function LoadingState({
  icon: Icon = Loader2,
  iconColor = 'text-purple-500 dark:text-purple-400',
  bgColor = 'bg-gradient-to-b from-purple-100 to-purple-50 shadow-inner dark:from-purple-800/40 dark:to-purple-900/60 dark:shadow-purple-950/20',
  title,
  subtitle,
  filePath,
  showProgress = true,
  progressText,
  autoProgress = true,
  initialProgress = 0,
}: LoadingStateProps): JSX.Element {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    if (showProgress && autoProgress) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(timer);
            return prevProgress;
          }
          return prevProgress + Math.random() * 10 + 5;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [showProgress, autoProgress]);
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] overflow-hidden scrollbar-hide py-12 px-6">
      <div className="text-center w-full max-w-md">
        <div className={cn("w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg border border-primary/20", bgColor)}>
          <Icon className={cn("h-10 w-10", iconColor, Icon === Loader2 && "animate-spin")} />
        </div>
        
        <h3 className="text-2xl font-bold mb-6 text-base-content tracking-tight">
          {title}
        </h3>
        
        {filePath && (
          <div className="bg-base-200/60 border border-base-300/50 rounded-2xl p-5 w-full text-center mb-8 shadow-sm backdrop-blur-sm">
            <code className="text-sm font-mono font-medium text-base-content/80 break-all leading-relaxed">
              {filePath}
            </code>
          </div>
        )}
        
        {showProgress && (
          <div className="space-y-4">
            <Progress value={Math.min(progress, 100)} className="w-full h-2 bg-base-300/50 rounded-full" />
            <div className="flex justify-between items-center text-sm text-base-content/70 font-medium">
              <span>{progressText || 'Processing...'}</span>
              <span className="font-mono text-primary">{Math.round(Math.min(progress, 100))}%</span>
            </div>
          </div>
        )}
        
        {subtitle && (
          <p className="text-base text-base-content/60 mt-6 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
} 