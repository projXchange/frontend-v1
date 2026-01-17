import { useState } from "react";
import { Users, Gift, TrendingUp, Calendar, Share2, Loader } from "lucide-react";
import { useReferrals } from "../hooks/useReferrals";
import { SharingModal } from "./SharingModal";
import LifetimeLimitsCard from "./LifetimeLimitsCard";
import LimitReachedBanners from "./LimitReachedBanners";

const ReferralDashboard = () => {
  const { dashboardData, loading, error, generateReferral } = useReferrals();
  const [generating, setGenerating] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [newReferralCode, setNewReferralCode] = useState("");

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const result = await generateReferral();
      setNewReferralCode(result.referral_code);
      setShowSharingModal(true);
    } catch (err) {
      // Error already handled by context with toast
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="space-y-4 sm:space-y-6" role="status" aria-live="polite" aria-label="Loading referral dashboard">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 animate-pulse"
              aria-hidden="true"
            >
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 animate-pulse" aria-hidden="true">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading referral dashboard data...</span>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div 
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 sm:p-6"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm sm:text-base text-red-800 dark:text-red-200">Failed to load referral dashboard. Please try again.</p>
      </div>
    );
  }

  const credits = dashboardData?.credits;
  const stats = dashboardData?.referral_stats;
  const recentReferrals = dashboardData?.recent_qualified_referrals || [];
  const canCreate = dashboardData?.can_create_referral ?? false;

  // Extract values from new credit structure
  const downloadCredits = credits?.current_credits ?? 0;
  const monthlyReferrals = credits?.monthly_referrals?.current ?? 0;
  const remainingReferralSlots = credits?.monthly_referrals?.remaining ?? 0;
  const lifetimeReferralCredits = credits?.referral_credits?.used ?? 0;
  const maxLifetimeReferralCredits = credits?.referral_credits?.max ?? 6;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Limit Reached Banners */}
      {credits && <LimitReachedBanners credits={credits} />}

      {/* Credit Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-4 sm:p-6 shadow-xl border border-blue-100 dark:border-slate-700">
        <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          Credit Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Download Credits</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {downloadCredits}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Available to use</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Referrals</p>
            <p className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
              {monthlyReferrals}/3
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This month</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Slots</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {remainingReferralSlots}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Available this month</p>
          </div>
        </div>
      </div>

      {/* Lifetime Limits Card */}
      {credits && <LifetimeLimitsCard credits={credits} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Referral Stats Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700">
          <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            Referral Statistics
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Referrals</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {stats?.totalReferrals ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Qualified Referrals</span>
              <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                {stats?.qualifiedReferrals ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly Referrals</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.monthlyReferrals ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Generate Referral Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 sm:p-6 shadow-xl border border-purple-100 dark:border-slate-700">
          <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            Generate Referral Code
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your referral code with friends and earn download credits when they sign up and make their first
              purchase or download one project!
            </p>

            {!canCreate && remainingReferralSlots === 0 && (
              <div 
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
                role="status"
                aria-live="polite"
              >
                <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                  You've reached your monthly referral limit (3/3). Limit resets next month.
                </p>
              </div>
            )}

            {!canCreate && lifetimeReferralCredits >= maxLifetimeReferralCredits && (
              <div 
                className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3"
                role="status"
                aria-live="polite"
              >
                <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-200">
                  You've reached the maximum lifetime referral credits ({lifetimeReferralCredits}/{maxLifetimeReferralCredits}). No more credits can be earned from
                  referrals.
                </p>
              </div>
            )}

            <button
              onClick={handleGenerateCode}
              disabled={!canCreate || generating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                canCreate && !generating
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500"
                  : "bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              aria-label={canCreate ? "Generate new referral code" : "Cannot generate referral code - limit reached"}
              aria-disabled={!canCreate || generating}
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Generate Referral Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Referrals Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700">
        <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          Recent Qualified Referrals
        </h3>

        {recentReferrals.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">No qualified referrals yet</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              Start sharing your referral codes to earn credits!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {referral.referred_user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{referral.referred_user_name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Code: {referral.referral_code}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {new Date(referral.qualified_at).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Qualified</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sharing Modal */}
      <SharingModal
        isOpen={showSharingModal}
        onClose={() => setShowSharingModal(false)}
        referralCode={newReferralCode}
      />
    </div>
  );
};

export default ReferralDashboard;
