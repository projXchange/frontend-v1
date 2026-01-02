import { Loader2 } from 'lucide-react';

interface ButtonSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Spinner component for button loading states
 */
const ButtonSpinner = ({ size = 'md', className = '' }: ButtonSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Loader2 
      className={`${sizeClasses[size]} animate-spin ${className}`}
      aria-hidden="true"
    />
  );
};

export default ButtonSpinner;
