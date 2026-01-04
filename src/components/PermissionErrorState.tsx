import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface PermissionErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Error state component for permission loading failures
 * Shows error message with optional retry button
 */
const PermissionErrorState: React.FC<PermissionErrorStateProps> = ({ 
  error, 
  onRetry,
  className = '' 
}) => {
  return (
    <div 
      className={`px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-1">
            Failed to Load Permissions
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mb-2">
            {error || 'Unable to fetch field permissions. Some fields may not be editable.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Loading Permissions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionErrorState;
