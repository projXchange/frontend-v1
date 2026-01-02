import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  /** Loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to center in container */
  centered?: boolean;
  /** Whether to show as inline */
  inline?: boolean;
}

/**
 * Generic loading state component
 * Can be used for inline loading, centered loading, or as a placeholder
 */
const LoadingState = ({
  message = 'Loading...',
  size = 'md',
  centered = true,
  inline = false,
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  const containerClasses = inline
    ? 'inline-flex items-center'
    : centered
    ? 'flex flex-col items-center justify-center min-h-[200px]'
    : 'flex flex-col items-center';

  return (
    <div 
      className={`${containerClasses} ${gapClasses[size]}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2 
        className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 animate-spin`}
        aria-hidden="true"
      />
      <span className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300`}>
        {message}
      </span>
    </div>
  );
};

export default LoadingState;
