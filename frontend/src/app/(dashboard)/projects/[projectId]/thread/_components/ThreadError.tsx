import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ThreadErrorProps {
  error: string;
}

export function ThreadError({ error }: ThreadErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-6 text-center shadow-lg">
        <div className="rounded-full bg-error/10 p-3 border border-error/20">
          <AlertTriangle className="h-6 w-6 text-error" />
        </div>
        <h2 className="text-lg font-semibold text-base-content">
          Thread Not Found
        </h2>
        <p className="text-sm text-base-content/60 leading-relaxed">
          {error.includes(
            'JSON object requested, multiple (or no) rows returned',
          )
            ? 'This thread either does not exist or you do not have access to it.'
            : error
          }
        </p>
      </div>
    </div>
  );
} 