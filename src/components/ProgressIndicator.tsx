import { useEffect, useState } from 'react';

interface ProgressIndicatorProps {
  /** Progress value between 0 and 100 */
  value?: number;
  /** Show indeterminate progress (animated) */
  indeterminate?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label */
  label?: string;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

/**
 * Progress indicator for long-running operations
 */
const ProgressIndicator = ({
  value = 0,
  indeterminate = false,
  size = 'md',
  label,
  variant = 'primary',
}: ProgressIndicatorProps) => {
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-600 dark:bg-yellow-500',
    error: 'bg-red-600 dark:bg-red-500',
  };

  return (
    <div className="w-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {!indeterminate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        {indeterminate ? (
          <div
            className={`h-full ${variantClasses[variant]} rounded-full`}
            style={{
              width: '40%',
              animation: 'indeterminate 1.5s ease-in-out infinite',
            }}
          />
        ) : (
          <div
            className={`h-full ${variantClasses[variant]} rounded-full transition-all duration-300 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        )}
      </div>

      <style>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(250%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressIndicator;
