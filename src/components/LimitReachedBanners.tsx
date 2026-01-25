import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import type { CreditInfo } from '../types/Referral';

interface LimitReachedBannersProps {
  credits: CreditInfo;
}

/**
 * LimitReachedBanners Component
 * 
 * Displays dismissible banners when users reach lifetime limits.
 * Shows appropriate messages for:
 * - Monthly limit reached (3/3)
 * - Referral limit reached (6/6)
 * - Total downloads limit reached (10/10)
 * 
 * Requirements: 1.3, 1.4, 11.4, 11.5, 11.6
 * 
 * @param credits - Credit information including lifetime limits
 */
const LimitReachedBanners: React.FC<LimitReachedBannersProps> = ({ credits }) => {
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners((prev) => new Set(prev).add(bannerId));
  };

  const monthlyLimitReached = (credits.monthly_credits?.used ?? 0) >= (credits.monthly_credits?.max ?? 3);
  const referralLimitReached = (credits.referral_credits?.used ?? 0) >= (credits.referral_credits?.max ?? 6);
  const totalLimitReached = (credits.total_free_downloads?.allocated ?? 0) >= (credits.total_free_downloads?.max ?? 10);

  return (
    <div className="space-y-3">
      {/* Monthly Limit Reached Banner */}
      {monthlyLimitReached && !dismissedBanners.has('monthly') && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3 animate-slideInDown">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Monthly Credit Limit Reached</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You have reached the maximum monthly credits (3/3). You can no longer earn monthly credits, but you can still earn credits through referrals!
            </p>
          </div>
          <button
            onClick={() => dismissBanner('monthly')}
            className="flex-shrink-0 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Referral Limit Reached Banner */}
      {referralLimitReached && !dismissedBanners.has('referral') && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start gap-3 animate-slideInDown">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Referral Credit Limit Reached</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              You have reached the maximum referral credits (6/6). You can no longer earn credits from referrals, but you can still purchase projects to support creators!
            </p>
          </div>
          <button
            onClick={() => dismissBanner('referral')}
            className="flex-shrink-0 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Total Downloads Limit Reached Banner */}
      {totalLimitReached && !dismissedBanners.has('total') && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 animate-slideInDown">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Free Downloads Limit Reached</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              You have used all 10 free downloads (1 signup + 3 monthly + 6 referral). You can continue enjoying ProjXchange by purchasing projects to support our amazing creators!
            </p>
          </div>
          <button
            onClick={() => dismissBanner('total')}
            className="flex-shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInDown { animation: slideInDown 0.3s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
};

export default LimitReachedBanners;
