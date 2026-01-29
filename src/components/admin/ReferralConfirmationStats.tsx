import { useEffect, useState } from 'react';
import { CheckCircle, Clock, TrendingUp, Download, BarChart3 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { getApiUrl } from '../../config/api';
import toast from 'react-hot-toast';

interface ConfirmationStats {
  total_pending: number;
  total_confirmed: number;
  confirmation_rate: string;
  confirmation_methods: {
    download: number;
    wishlist: number;
    views: number;
  };
  average_time_to_confirmation_hours: number;
}

interface ConfirmationStatsResponse {
  period_days: number;
  stats: ConfirmationStats;
  generated_at: string;
}

const ReferralConfirmationStats = () => {
  const [stats, setStats] = useState<ConfirmationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(30);

  const fetchConfirmationStats = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('period', period.toString());
      
      const url = `${getApiUrl('/admin/referrals/confirmation-stats')}?${queryParams.toString()}`;
      
      const response = await apiClient(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch confirmation statistics');
      }

      const data: ConfirmationStatsResponse = await response.json();
      setStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch confirmation statistics';
      setError(errorMessage);
      
      toast.error(
        (t) => (
          <div className="flex items-center gap-3">
            <span>{errorMessage}</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                fetchConfirmationStats();
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmationStats();
  }, [period]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-red-200 dark:border-red-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            Error Loading Confirmation Statistics
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchConfirmationStats}
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

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-blue-600" />
          Referral Confirmation Statistics
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {stats.total_pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Confirmations</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
              Confirmed
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stats.total_confirmed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed Referrals</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full">
              Rate
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stats.confirmation_rate}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Confirmation Rate</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
              Avg Time
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {stats.average_time_to_confirmation_hours.toFixed(1)}h
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time to Confirm</div>
        </div>
      </div>

      {/* Confirmation Methods Breakdown - Downloads Only */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Referral Qualification Method
        </h3>
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Downloads Only</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.confirmation_methods.download}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full w-full transition-all duration-500"></div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-semibold">
              100% of referrals qualified through downloads
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Only downloads qualify referrals - wishlist and views are tracked for analytics only
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Confirmation Performance
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Over the last {period} days, {stats.total_confirmed} referrals have been
              confirmed ({stats.confirmation_rate} confirmation rate) through downloads only. 
              The average time to confirmation is {stats.average_time_to_confirmation_hours.toFixed(1)} hours.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                Downloads Only: {stats.confirmation_methods.download}
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                Wishlist & Views: Analytics Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralConfirmationStats;
