import React from 'react';
import { Loader2 } from 'lucide-react';

interface PermissionLoadingStateProps {
  className?: string;
}

/**
 * Loading state component for permission data
 * Shows a spinner and message while permissions are being fetched
 */
const PermissionLoadingState: React.FC<PermissionLoadingStateProps> = ({ className = '' }) => {
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading permissions"
    >
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Loading field permissions...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Please wait while we check which fields you can edit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionLoadingState;
