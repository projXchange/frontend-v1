import { useState, useEffect } from 'react';
import { Calendar, Share2, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useReferralContext } from '../contexts/ReferralContext';
import { SharingModal } from './SharingModal';
import type { ReferralCode } from '../types/Referral';

const ReferralHistory = () => {
  const { referralHistory, loading, error, loadHistory } = useReferralContext();
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedReferralCode, setSelectedReferralCode] = useState('');

  useEffect(() => {
    // Load history on mount if not already loaded
    if (referralHistory.length === 0 && !loading) {
      loadHistory();
    }
  }, []);

  const handleShareAgain = (referralCode: string) => {
    setSelectedReferralCode(referralCode);
    setShowSharingModal(true);
  };

  const getStatusBadge = (status: 'unused' | 'pending' | 'qualified') => {
    switch (status) {
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Qualified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'unused':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <AlertCircle className="w-3 h-3" />
            Unused
          </span>
        );
    }
  };

  if (loading && referralHistory.length === 0) {
    return (
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-700"
        role="status"
        aria-live="polite"
        aria-label="Loading referral history"
      >
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" aria-hidden="true" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading referral history...</p>
        </div>
      </div>
    );
  }

  if (error && referralHistory.length === 0) {
    return (
      <div 
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 sm:p-6"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-sm sm:text-base text-red-800 dark:text-red-200">Failed to load referral history. Please try again.</p>
      </div>
    );
  }

  if (referralHistory.length === 0) {
    return (
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-700"
        role="status"
      >
        <div className="text-center py-8 sm:py-12">
          <Share2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No Referrals Yet</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            You haven't created any referral codes yet. Start sharing and earn credits!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            Referral History
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track all your referral codes and their status
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-slate-700" role="list" aria-label="Referral history list">
          {referralHistory.map((referral: ReferralCode) => (
            <div
              key={referral.id}
              className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              role="listitem"
            >
              <div className="flex flex-col gap-4">
                {/* Left Section: Code and Status */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div 
                      className="font-mono text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg"
                      aria-label={`Referral code ${referral.referral_code}`}
                    >
                      {referral.referral_code}
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>

                  {/* Referred User Info */}
                  {referral.referred_user && (
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {referral.referred_user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {referral.referred_user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
                          {referral.referred_user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                      <span>Created: <time dateTime={referral.created_at}>{new Date(referral.created_at).toLocaleDateString()}</time></span>
                    </div>
                    {referral.qualified_at && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                        <span>Qualified: <time dateTime={referral.qualified_at}>{new Date(referral.qualified_at).toLocaleDateString()}</time></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section: Share Again Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleShareAgain(referral.referral_code)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    aria-label={`Share referral code ${referral.referral_code} again`}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    Share Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sharing Modal */}
      <SharingModal
        isOpen={showSharingModal}
        onClose={() => setShowSharingModal(false)}
        referralCode={selectedReferralCode}
      />
    </>
  );
};

export default ReferralHistory;
