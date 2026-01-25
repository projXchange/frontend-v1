import React from 'react';
import { Download, Lock } from 'lucide-react';
import { useDownloadFlow } from '../hooks/useDownloadFlow';
import { useCredits } from '../hooks/useCredits';
import ButtonSpinner from './ButtonSpinner';

interface EnhancedDownloadButtonProps {
  projectId: string;
  projectPrice?: number; // Optional project price for validation
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  showCreditsInfo?: boolean;
}

/**
 * EnhancedDownloadButton Component
 * 
 * Displays a download button with integrated credit checking and unlock modal support.
 * Handles the complete download flow including:
 * - Credit validation
 * - Unlock modal display when credits insufficient
 * - File download with credit consumption
 * - Error handling and user feedback
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 * 
 * @param projectId - The ID of the project to download
 * @param className - Optional additional CSS classes
 * @param size - Button size variant (sm, md, lg)
 * @param variant - Button style variant (primary, secondary)
 * @param showCreditsInfo - Whether to show available credits info
 */
const EnhancedDownloadButton: React.FC<EnhancedDownloadButtonProps> = ({
  projectId,
  projectPrice,
  className = '',
  size = 'md',
  variant = 'primary',
  showCreditsInfo = true,
}) => {
  const { handleDownloadAttempt, isDownloading } = useDownloadFlow();
  const { availableCredits } = useCredits();

  // Check if project exceeds free download limit (₹2000)
  const FREE_DOWNLOAD_LIMIT = 2000;
  const exceedsPriceLimit = projectPrice !== undefined && projectPrice > FREE_DOWNLOAD_LIMIT;
  const canUseCredit = availableCredits > 0 && !exceedsPriceLimit;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3.5 text-base min-h-[48px]',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Variant styles
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:from-blue-700 hover:to-indigo-700
      active:from-blue-800 active:to-indigo-800
      text-white
    `,
    secondary: `
      bg-gradient-to-r from-gray-200 to-gray-300
      dark:from-slate-700 dark:to-slate-600
      hover:from-gray-300 hover:to-gray-400
      dark:hover:from-slate-600 dark:hover:to-slate-500
      active:from-gray-400 active:to-gray-500
      dark:active:from-slate-500 dark:active:to-slate-400
      text-gray-900 dark:text-white
    `,
  };

  const handleClick = () => {
    handleDownloadAttempt(projectId);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isDownloading}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center gap-2
          ${variantClasses[variant]}
          font-medium rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg active:shadow-sm
          touch-manipulation
          ${className}
        `}
        data-testid="enhanced-download-button"
        aria-label={`Download project${canUseCredit ? ' using 1 credit' : ''}`}
      >
        {isDownloading ? (
          <>
            <ButtonSpinner />
            <span className="whitespace-nowrap">Downloading...</span>
          </>
        ) : canUseCredit ? (
          <>
            <Download className={iconSizes[size]} />
            <span className="whitespace-nowrap">Download with Credit</span>
          </>
        ) : (
          <>
            <Lock className={iconSizes[size]} />
            <span className="whitespace-nowrap">
              {exceedsPriceLimit ? 'Purchase to Download' : 'Unlock to Download'}
            </span>
          </>
        )}
      </button>

      {/* Credits Info */}
      {showCreditsInfo && (
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {exceedsPriceLimit ? (
            <span className="text-amber-600 dark:text-amber-400">
              <strong>Projects above ₹2000</strong> require purchase
            </span>
          ) : availableCredits > 0 ? (
            <span>
              You have <strong>{availableCredits}</strong> credit{availableCredits !== 1 ? 's' : ''} available
            </span>
          ) : (
            <span>
              No credits available. <strong>Refer friends</strong> to earn more!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedDownloadButton;
