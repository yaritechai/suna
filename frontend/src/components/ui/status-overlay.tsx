import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDeleteOperation } from '@/contexts/DeleteOperationContext';

export function StatusOverlay() {
  const { state } = useDeleteOperation();

  if (state.operation === 'none' || !state.isDeleting) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-base-100 border border-base-300 backdrop-blur-sm p-3 rounded-lg shadow-lg">
      {state.operation === 'pending' && (
        <>
          <Loader2 className="h-5 w-5 text-base-content/70 animate-spin" />
          <span className="text-sm text-base-content">Processing...</span>
        </>
      )}

      {state.operation === 'success' && (
        <>
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="text-sm text-base-content">Completed</span>
        </>
      )}

      {state.operation === 'error' && (
        <>
          <AlertCircle className="h-5 w-5 text-error" />
          <span className="text-sm text-base-content">Failed</span>
        </>
      )}
    </div>
  );
}
