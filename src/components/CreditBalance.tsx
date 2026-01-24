import React, { useState } from 'react';
import { Coins, Info } from 'lucide-react';
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
  const [showTooltip, setShowTooltip] = useState(false);

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
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div
        className={`flex items-center space-x-2 ${sizeClasses[size].container} rounded-full border ${getCreditStateClasses(availableCredits)} font-medium transition-all duration-200 cursor-help hover:scale-105`}
        data-testid="credit-balance"
      >
        <Coins className={`${sizeClasses[size].icon} animate-pulse`} />
        <span className={sizeClasses[size].text}>
          {showLabel && 'Credits: '}
          {availableCredits}
        </span>
        <Info className={`${sizeClasses[size].icon} opacity-60`} />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <>
          {/* Backdrop for mobile - close on click */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
          />

          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 top-full lg:top-full">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Coins className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                    Download Credits
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Use credits to download projects. 1 credit = 1 download.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-300 text-center font-medium">
                  Balance: <span className="font-bold">{availableCredits} credit{availableCredits !== 1 ? 's' : ''}</span>
                </p>
              </div>
            </div>

            {/* Arrow - hidden on mobile */}
            <div className="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-gray-200 dark:border-slate-700 rotate-45"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreditBalance;
