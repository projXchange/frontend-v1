import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'launch-period-banner-dismissed';

export const LaunchPeriodBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={20} />
      </button>
      
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          🚀 Launch Period: Credit-Only Access
        </h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
          Welcome to ProjXchange! During our launch period, all downloads are credit-based. 
          Earn credits through signup bonuses, monthly rewards, and by inviting friends. 
          This creates a premium, ethical experience while building our community together.
        </p>
      </div>
    </div>
  );
};
