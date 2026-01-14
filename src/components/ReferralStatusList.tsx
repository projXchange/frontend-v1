import React from 'react';
import { Users, Calendar, Loader, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useReferralStatus } from '../hooks/useReferralStatus';

const ReferralStatusList: React.FC = () => {
  const { referrals, loading, error, refresh } = useReferralStatus();

  // Loading skeleton
  if (loading && referrals.length === 0) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700"
        role="status"
        aria-live="polite"
        aria-label="Loading referral status"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Referral Status</h3>
        </div>
        <div className="space-y-3 sm:space-y-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading referral status data...</span>
      </div>
    );
  }

  // Error state
  if (error && referrals.length === 0) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Referral Status</h3>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-red-800 dark:text-red-200 mb-2 break-words">{error}</p>
              <button
                onClick={refresh}
                className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (referrals.length === 0) {
    return (
      <div
        className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700"
        role="status"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Referral Status</h3>
        </div>
        <div className="text-center py-8 sm:py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No Referrals Yet</h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 px-4">
            Start inviting friends to earn credits!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 px-4">
            Share your referral link and track your referrals here.
          </p>
        </div>
      </div>
    );
  }

  // Referral list
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">Referral Status</h3>
          </div>
          {loading && (
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" aria-label="Refreshing" />
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track your referrals and their confirmation status
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-slate-700" role="list" aria-label="Referral status list">
        {referrals.map((referral) => (
          <div
            key={referral.id}
            className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            role="listitem"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* User Avatar and Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                  {referral.referred_user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {referral.referred_user?.name || 'Pending User'}
                    </h4>
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      referral.status === 'qualified' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : referral.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                    }`}>
                      {referral.status === 'qualified' && <CheckCircle className="w-3 h-3" />}
                      {referral.status === 'pending' && <Clock className="w-3 h-3" />}
                      {referral.status === 'unused' && <XCircle className="w-3 h-3" />}
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                  </div>
                  
                  {referral.referred_user?.email && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 break-all">
                      {referral.referred_user.email}
                    </p>
                  )}

                  {/* Status Messages */}
                  {referral.status === 'pending' && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Pending Qualification
                      </p>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                        This user has signed up but hasn't completed the required actions yet.
                      </p>
                    </div>
                  )}

                  {/* Qualification Date for qualified status */}
                  {referral.status === 'qualified' && referral.qualified_at && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                      <span className="break-words">
                        Qualified on{' '}
                        <time dateTime={referral.qualified_at}>
                          {new Date(referral.qualified_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </span>
                    </div>
                  )}

                  {/* Unused Status Message */}
                  {referral.status === 'unused' && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        This referral code hasn't been used yet. Share it to earn credits!
                      </p>
                    </div>
                  )}

                  {/* Referral Code */}
                  <div className="mt-2 sm:mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-500 break-all">
                      Referral Code:{' '}
                      <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                        {referral.referral_code}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Created on {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferralStatusList;
