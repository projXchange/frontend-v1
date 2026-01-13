import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gift } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';

/**
 * ReferralCTA Component
 * 
 * Call-to-action component displayed when users have no credits available.
 * Encourages users to invite friends to earn more credits.
 * Shows different message if referral credit cap has been reached.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
const ReferralCTA: React.FC = () => {
  const navigate = useNavigate();
  const { balance } = useCredits();

  // Check if user has reached the referral credit cap (Requirements: 7.5)
  const hasReachedReferralCap = 
    (balance?.referral_credits_earned ?? 0) >= (balance?.max_referral_credits ?? 6);

  /**
   * Navigate to referral dashboard
   * Requirements: 7.2, 7.3
   * 
   * Note: The StudentDashboard component has a tab system.
   * Users will need to click on the "Referrals" tab once they reach the dashboard.
   * This is the standard navigation pattern in the application.
   */
  const handleNavigateToReferrals = () => {
    navigate('/dashboard');
  };

  return (
    <div 
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg"
      data-testid="referral-cta"
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        {/* Icon */}
        <div className="bg-blue-100 dark:bg-blue-800 p-3 sm:p-4 rounded-full">
          {hasReachedReferralCap ? (
            <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
          ) : (
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
          )}
        </div>

        {/* Message - Different based on cap status (Requirements: 7.1, 7.5) */}
        {hasReachedReferralCap ? (
          <>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white px-2">
              Maximum referral credits earned
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md px-2">
              You've earned the maximum {balance?.max_referral_credits} referral credits! 
              Wait for your monthly credit or check back later for more ways to earn.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white px-2">
              Invite a friend to unlock more projects
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md px-2">
              You're out of credits! Share your referral link with friends. 
              When they engage with the platform, you'll earn credits to download more projects.
            </p>
          </>
        )}

        {/* CTA Button (Requirements: 7.2, 7.3, 7.4) */}
        {!hasReachedReferralCap && (
          <button
            onClick={handleNavigateToReferrals}
            className="
              w-full sm:w-auto
              px-5 py-3 sm:px-6 sm:py-3.5
              min-h-[44px]
              bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700
              active:from-blue-800 active:to-indigo-800
              text-white font-semibold rounded-lg
              transition-all duration-200
              shadow-md hover:shadow-xl active:shadow-sm
              transform hover:scale-105 active:scale-100
              flex items-center justify-center gap-2
              touch-manipulation
            "
            data-testid="referral-cta-button"
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Go to Referral Dashboard</span>
          </button>
        )}

        {/* Additional info - no pricing mentioned (Requirements: 7.4) */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
          Earn 1 credit for each confirmed referral
        </p>
      </div>
    </div>
  );
};

export default ReferralCTA;
