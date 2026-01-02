import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Optional loading message */
  message?: string;
  /** Whether to blur the background */
  blur?: boolean;
  /** Whether to show as fullscreen or relative to parent */
  fullscreen?: boolean;
}

/**
 * Loading overlay for long-running operations
 * Can be used as fullscreen or relative to a container
 */
const LoadingOverlay = ({
  isLoading,
  message = 'Loading...',
  blur = true,
  fullscreen = false,
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  const positionClass = fullscreen ? 'fixed' : 'absolute';
  const blurClass = blur ? 'backdrop-blur-sm' : '';

  return (
    <div
      className={`${positionClass} inset-0 z-50 flex items-center justify-center bg-black/40 ${blurClass}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <Loader2 
            className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" 
            aria-hidden="true"
          />
          
          {/* Message */}
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center">
            {message}
          </p>
          
          {/* Subtext */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Please wait while we process your request
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
