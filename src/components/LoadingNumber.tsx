import { useEffect, useState } from 'react';

interface LoadingNumberProps {
  value: number | string;
  isLoading?: boolean;
  className?: string;
}

const LoadingNumber = ({ value, isLoading = false, className = "" }: LoadingNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isLoading) {
      setDisplayValue(value);
    }
  }, [value, isLoading]);

  if (isLoading) {
    return (
      <span 
        className={`${className} inline-block bg-gray-200 dark:bg-slate-700 rounded`}
        style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          minWidth: '3rem',
          minHeight: '1.5rem'
        }}
        role="status"
        aria-label="Loading"
      >
        &nbsp;
      </span>
    );
  }

  return (
    <span 
      className={`${className} transition-all duration-300`}
      style={{
        animation: displayValue !== value ? 'fadeIn 0.3s ease-in-out' : 'none'
      }}
    >
      {displayValue}
    </span>
  );
};

export default LoadingNumber;
