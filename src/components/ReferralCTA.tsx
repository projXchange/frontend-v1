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
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm"
      data-testid="referral-cta"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
          {hasReachedReferralCap ? (
            <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          ) : (
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Message */}
        {hasReachedReferralCap ? (
          <>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Max credits earned
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Wait for monthly credit or check back later
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              No Credits
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invite friends to earn credits
            </p>
          </>
        )}

        {/* CTA Button */}
        {!hasReachedReferralCap && (
          <button
            onClick={handleNavigateToReferrals}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            data-testid="referral-cta-button"
          >
            Earn Credits
          </button>
        )}

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          1 credit per referral
        </p>
      </div>
    </div>
  );
};

export default ReferralCTA;
