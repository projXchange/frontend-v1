import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, User, Mail, Globe, Calendar, CheckCircle } from 'lucide-react';
import { getSuspiciousReferrals } from '../../services/referralService';
import type { SuspiciousReferral } from '../../types/Referral';
import toast from 'react-hot-toast';

const SuspiciousReferralsPanel = () => {
  const [suspiciousReferrals, setSuspiciousReferrals] = useState<SuspiciousReferral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchSuspiciousReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuspiciousReferrals(limit, offset);
      setSuspiciousReferrals(data.suspicious_referrals);
      setTotalCount(data.suspicious_referrals.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suspicious referrals';
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
                  fetchSuspiciousReferrals();
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
    fetchSuspiciousReferrals();
  }, [offset]);

  const handleNextPage = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-red-200 dark:border-red-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Suspicious Referrals</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchSuspiciousReferrals}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Shield className="w-7 h-7 text-red-600" />
          Suspicious Referrals
        </h2>
        {suspiciousReferrals.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {suspiciousReferrals.length} Flagged Referral{suspiciousReferrals.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {suspiciousReferrals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Suspicious Activity Detected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All referrals appear to be legitimate. The system will continue monitoring for suspicious patterns.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Suspicious Referrals List */}
          <div className="space-y-4">
            {suspiciousReferrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-red-200 dark:border-red-800 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">
                          {referral.referralCode}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Created: {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          referral.isQualified
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {referral.isQualified ? 'Qualified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Referrer Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Referrer
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {referral.referrerName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {referral.referrerId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{referral.referrerEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Referred User Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-slate-800 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          Referred User
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {referral.referredUserName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {referral.referredUserId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{referral.referredUserEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Signup IP: <span className="font-mono font-semibold">{referral.signupIp}</span></span>
                    </div>
                    {referral.qualifiedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Qualified: {new Date(referral.qualifiedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Suspicious Reasons */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        Suspicious Indicators
                      </span>
                    </div>
                    <div className="space-y-2">
                      {referral.suspiciousReasons.map((reason, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {offset + 1} - {Math.min(offset + limit, offset + totalCount)} of {offset + totalCount}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={suspiciousReferrals.length < limit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuspiciousReferralsPanel;
