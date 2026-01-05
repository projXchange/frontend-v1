import { useEffect, useState } from 'react';
import { Users, TrendingUp, UserCheck, UserX, Clock, Target, Activity } from 'lucide-react';
import { getAdminReferralStats } from '../../services/referralService';
import type { AdminReferralStats } from '../../types/Referral';
import toast from 'react-hot-toast';

const ReferralStatsPanel = () => {
  const [stats, setStats] = useState<AdminReferralStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(30);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReferralStats(period);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referral statistics';
      setError(errorMessage);
      
      // Check if error is retryable
      const isRetryable = (err as any).retryable ?? false;
      
      if (isRetryable) {
        toast.error(
          (t) => (
            <div className="flex items-center gap-3">
              <span>{errorMessage}</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  fetchStats();
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ),
          { duration: 5000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-red-200 dark:border-red-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Statistics</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { stats: referralStats } = stats;

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Activity className="w-7 h-7 text-blue-600" />
          Referral System Statistics
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Period:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {referralStats.overview.total_referrals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-green-600 dark:text-green-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
              Qualified
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {referralStats.overview.qualified_referrals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Qualified</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-yellow-600 dark:text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded-full">
              Pending
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {referralStats.overview.pending_referrals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 dark:text-gray-400">
              <UserX className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/40 px-2 py-1 rounded-full">
              Unused
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {referralStats.overview.unused_referrals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unused</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-purple-600 dark:text-purple-400">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full">
              Rate
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {referralStats.overview.conversion_rate}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
        </div>
      </div>

      {/* Period-Specific Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Period Performance ({period} days)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Referrals</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {referralStats.period_stats.new_referrals}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-slate-800 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Qualifications</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {referralStats.period_stats.new_qualifications}
            </div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Top Referrers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Total Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Qualified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {referralStats.top_referrers.length > 0 ? (
                referralStats.top_referrers.map((referrer, index) => (
                  <tr
                    key={referrer.referrerId}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {referrer.referrerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {referrer.referrerName}
                          </div>
                          {index === 0 && (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                              🏆 Top Referrer
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {referrer.referrerEmail}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {referrer.totalReferrals}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold">
                        {referrer.qualifiedReferrals}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No referrers found for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Referral Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {referralStats.recent_activity.length > 0 ? (
            referralStats.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {activity.referrerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {activity.referrerName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          referred {activity.referredUserName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {activity.referralCode}
                      </span>
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      {activity.qualifiedAt && (
                        <span className="text-green-600 dark:text-green-400">
                          Qualified: {new Date(activity.qualifiedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.isQualified
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
                      }`}
                    >
                      {activity.isQualified ? 'Qualified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No recent activity for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralStatsPanel;
