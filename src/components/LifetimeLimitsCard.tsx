import React from 'react';
import { Gift, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import type { CreditInfo } from '../types/Referral';

interface LifetimeLimitsCardProps {
  credits: CreditInfo;
}

/**
 * LifetimeLimitsCard Component
 * 
 * Displays user's progress toward lifetime credit limits with visual progress indicators.
 * Shows:
 * - Monthly Credits: X/3 (one per month for first 3 months)
 * - Referral Credits: Y/6 (earned through successful referrals)
 * - Total Free Downloads: Z/10 (1 signup + 3 monthly + 6 referral)
 * 
 * Requirements: 1.5, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7
 * 
 * @param credits - Credit information including lifetime limits
 */
const LifetimeLimitsCard: React.FC<LifetimeLimitsCardProps> = ({ credits }) => {
  /**
   * Calculate progress percentage and color based on usage
   * Green: < 70%, Yellow: 70-90%, Red: > 90%
   */
  const getProgressColor = (used: number, max: number): string => {
    const percentage = (used / max) * 100;
    if (percentage < 70) return 'bg-green-600 dark:bg-green-500';
    if (percentage < 90) return 'bg-yellow-600 dark:bg-yellow-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  const getProgressBgColor = (used: number, max: number): string => {
    const percentage = (used / max) * 100;
    if (percentage < 70) return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
    if (percentage < 90) return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
    return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20';
  };

  const getProgressBorderColor = (used: number, max: number): string => {
    const percentage = (used / max) * 100;
    if (percentage < 70) return 'border-green-200 dark:border-green-800';
    if (percentage < 90) return 'border-yellow-200 dark:border-yellow-800';
    return 'border-red-200 dark:border-red-800';
  };

  const getStatusText = (used: number, max: number): string => {
    const percentage = (used / max) * 100;
    if (percentage < 70) return 'Safe';
    if (percentage < 90) return 'Warning';
    return 'Limit Reached';
  };

  const monthlyUsed = credits.monthly_credits?.used ?? 0;
  const monthlyMax = credits.monthly_credits?.max ?? 3;
  const referralUsed = credits.referral_credits?.used ?? 0;
  const referralMax = credits.referral_credits?.max ?? 6;
  const totalUsed = credits.total_free_downloads?.used ?? 0;
  const totalMax = credits.total_free_downloads?.max ?? 10;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 sm:p-6 shadow-xl border border-purple-200 dark:border-purple-800">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Lifetime Limits</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track your progress toward credit limits</p>
        </div>
      </div>

      {/* Limits Grid */}
      <div className="space-y-4">
        {/* Monthly Credits */}
        <div
          className={`bg-gradient-to-br ${getProgressBgColor(monthlyUsed, monthlyMax)} rounded-xl p-4 border ${getProgressBorderColor(monthlyUsed, monthlyMax)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Credits</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">One per month for first 3 months</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {monthlyUsed}/{monthlyMax}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                monthlyUsed < 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                monthlyUsed < 90 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              }`}>
                {getStatusText(monthlyUsed, monthlyMax)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${getProgressColor(monthlyUsed, monthlyMax)} transition-all duration-500 rounded-full`}
              style={{ width: `${(monthlyUsed / monthlyMax) * 100}%` }}
            />
          </div>

          {/* Tooltip */}
          <div className="mt-2 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>
              {monthlyUsed === monthlyMax
                ? 'You have reached your monthly credit limit. No more monthly credits can be earned.'
                : `You can earn ${monthlyMax - monthlyUsed} more monthly credit${monthlyMax - monthlyUsed !== 1 ? 's' : ''}.`}
            </span>
          </div>
        </div>

        {/* Referral Credits */}
        <div
          className={`bg-gradient-to-br ${getProgressBgColor(referralUsed, referralMax)} rounded-xl p-4 border ${getProgressBorderColor(referralUsed, referralMax)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Referral Credits</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Earned through successful referrals</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {referralUsed}/{referralMax}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                referralUsed < 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                referralUsed < 90 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              }`}>
                {getStatusText(referralUsed, referralMax)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${getProgressColor(referralUsed, referralMax)} transition-all duration-500 rounded-full`}
              style={{ width: `${(referralUsed / referralMax) * 100}%` }}
            />
          </div>

          {/* Tooltip */}
          <div className="mt-2 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>
              {referralUsed === referralMax
                ? 'You have reached your referral credit limit. No more credits can be earned from referrals.'
                : `You can earn ${referralMax - referralUsed} more referral credit${referralMax - referralUsed !== 1 ? 's' : ''}.`}
            </span>
          </div>
        </div>

        {/* Total Free Downloads */}
        <div
          className={`bg-gradient-to-br ${getProgressBgColor(totalUsed, totalMax)} rounded-xl p-4 border ${getProgressBorderColor(totalUsed, totalMax)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Total Free Downloads</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">1 signup + 3 monthly + 6 referral</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {totalUsed}/{totalMax}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                totalUsed < 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                totalUsed < 90 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              }`}>
                {getStatusText(totalUsed, totalMax)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${getProgressColor(totalUsed, totalMax)} transition-all duration-500 rounded-full`}
              style={{ width: `${(totalUsed / totalMax) * 100}%` }}
            />
          </div>

          {/* Tooltip */}
          <div className="mt-2 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>
              {totalUsed === totalMax
                ? 'You have used all your free downloads. Consider purchasing projects to support creators!'
                : `You have ${totalMax - totalUsed} free download${totalMax - totalUsed !== 1 ? 's' : ''} remaining.`}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Tip:</strong> Refer friends to earn more credits! Each successful referral gives you 1 credit (up to 6 total).
        </p>
      </div>
    </div>
  );
};

export default LifetimeLimitsCard;
