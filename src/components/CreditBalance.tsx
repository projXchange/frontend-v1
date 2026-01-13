import React from 'react';
import { Coins } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';

interface CreditBalanceProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ 
  showLabel = true, 
  size = 'md' 
}) => {
  const { availableCredits, loading, error } = useCredits();

  // Size variants
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      container: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  };

  // Credit state classes
  const getCreditStateClasses = (creditValue: number): string => {
    if (creditValue === 0) {
      return 'credit-empty bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800';
    } else if (creditValue <= 1) {
      return 'credit-low bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
    } else {
      return 'credit-normal bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div 
        className={`flex items-center space-x-2 ${sizeClasses[size].container} rounded-full border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 animate-pulse`}
        data-testid="credit-balance-loading"
      >
        <div className={`${sizeClasses[size].icon} rounded-full bg-gray-300 dark:bg-slate-600`} />
        <div className="h-4 w-12 bg-gray-300 dark:bg-slate-600 rounded" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`flex items-center space-x-2 ${sizeClasses[size].container} rounded-full border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400`}
        data-testid="credit-balance-error"
        title={error}
      >
        <Coins className={sizeClasses[size].icon} />
        <span className={sizeClasses[size].text}>--</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center space-x-2 ${sizeClasses[size].container} rounded-full border ${getCreditStateClasses(availableCredits)} font-medium transition-all duration-200`}
      data-testid="credit-balance"
    >
      <Coins className={sizeClasses[size].icon} />
      <span className={sizeClasses[size].text}>
        {showLabel && 'Credits: '}
        {availableCredits}
      </span>
    </div>
  );
};

export default CreditBalance;
