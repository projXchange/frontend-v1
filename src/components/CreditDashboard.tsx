import React from 'react';
import { Coins, TrendingUp, Clock, Users } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';
import { useReferrals } from '../hooks/useReferrals';

/**
 * CreditDashboard Component
 * 
 * Displays comprehensive credit statistics including:
 * - Available credits
 * - Total downloads
 * - Monthly credit timer
 * - Referral credit stats
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

const CreditDashboard: React.FC = () => {
  const { balance, loading: creditsLoading, error: creditsError } = useCredits();
  const { dashboardData, loading: referralsLoading } = useReferrals();
  
  const loading = creditsLoading || referralsLoading;
  const error = creditsError;

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
            </div>
            <div className="h-7 sm:h-8 w-12 sm:w-16 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-2.5 sm:h-3 w-24 sm:w-32 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <p className="text-sm sm:text-base text-red-800 dark:text-red-200 text-center">
          Failed to load credit information. Please try again later.
        </p>
      </div>
    );
  }

  // No balance data
  if (!balance) {
    return null;
  }

  const {
    available_credits,
    referral_credits_earned,
    max_referral_credits,
    monthly_credits_received,
    max_monthly_credits,
    days_until_next_credit,
  } = balance;

  // Get accurate download count from ReferralContext
  // This comes from the backend's total_free_downloads.allocated field
  const displayDownloads = dashboardData?.credits?.total_free_downloads?.allocated ?? 0;

  // Determine if all monthly credits have been received
  const allMonthlyCreditsReceived = monthly_credits_received >= max_monthly_credits;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Available Credits Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-green-100 dark:border-green-800 hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium mb-1 truncate">
              Available Credits
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-green-900 dark:text-green-100">
              {available_credits}
            </p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2">
            <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 truncate">
          Ready to download
        </p>
      </div>

      {/* Total Downloads Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-blue-100 dark:border-blue-800 hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium mb-1 truncate">
              Total Downloads
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100">
              {displayDownloads}
            </p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 truncate">
          Using free credits
        </p>
      </div>

      {/* Monthly Timer Card - Hide if all monthly credits received */}
      {!allMonthlyCreditsReceived && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-purple-100 dark:border-purple-800 hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium mb-1 truncate">
                Next Credit In
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-purple-900 dark:text-purple-100">
                {days_until_next_credit !== null ? days_until_next_credit : '--'}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 truncate">
            {days_until_next_credit === 1 ? 'day remaining' : 'days remaining'}
          </p>
        </div>
      )}

      {/* Referral Stats Card */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-orange-100 dark:border-orange-800 hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium mb-1 truncate">
              Referral Credits
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-orange-900 dark:text-orange-100">
              {referral_credits_earned}
              <span className="text-xl sm:text-2xl text-orange-600 dark:text-orange-400">
                /{max_referral_credits}
              </span>
            </p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 truncate">
          From confirmed referrals
        </p>
      </div>
    </div>
  );
};

export default CreditDashboard;
