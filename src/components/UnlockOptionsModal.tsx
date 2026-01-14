import React, { useState, useEffect } from 'react';
import { X, Lock, ShoppingCart, Users, Zap, AlertCircle, Loader } from 'lucide-react';
import { getUnlockOptions } from '../services/referralService';
import type { UnlockOptions } from '../types/Referral';
import toast from 'react-hot-toast';

interface UnlockOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onPurchase?: () => void;
  onNavigateToReferrals?: () => void;
}

export const UnlockOptionsModal: React.FC<UnlockOptionsModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onPurchase,
  onNavigateToReferrals,
}) => {
  const [options, setOptions] = useState<UnlockOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      loadUnlockOptions();
    }
  }, [isOpen, projectId]);

  const loadUnlockOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnlockOptions(projectId);
      setOptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load unlock options';
      setError(errorMessage);
      
      const isRetryable = (err as any).retryable ?? false;
      if (isRetryable) {
        toast.error(
          (t) => (
            <div className="flex items-center gap-3">
              <span>{errorMessage}</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  loadUnlockOptions();
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
      aria-describedby="unlock-modal-description"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700 animate-slideInUp transform transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 id="unlock-modal-title" className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Unlock This Project
              </h2>
              <p id="unlock-modal-description" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                Choose how you'd like to access this project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading unlock options...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">Error Loading Options</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={loadUnlockOptions}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : options ? (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Your Status</h3>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {options.current_credits}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {options.current_credits > 0
                    ? `You have ${options.current_credits} credit${options.current_credits !== 1 ? 's' : ''} available`
                    : 'You have no credits available'}
                </p>

                {/* Lifetime Limits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Credits</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {options.lifetime_limits.monthly_credits.used}/{options.lifetime_limits.monthly_credits.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(options.lifetime_limits.monthly_credits.used / options.lifetime_limits.monthly_credits.max) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm mt-4">
                    <span className="text-gray-600 dark:text-gray-400">Referral Credits</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {options.lifetime_limits.referral_credits.used}/{options.lifetime_limits.referral_credits.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(options.lifetime_limits.referral_credits.used / options.lifetime_limits.referral_credits.max) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Unlock Options */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">How to Unlock</h3>

                {/* Use Credits Option */}
                <div
                  className={`rounded-xl border-2 p-4 sm:p-6 transition-all ${
                    options.unlock_options.use_credits.available
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:shadow-lg hover:scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        options.unlock_options.use_credits.available
                          ? 'bg-green-100 dark:bg-green-900/40'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    >
                      <Zap
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${
                          options.unlock_options.use_credits.available
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Use Credits</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {options.unlock_options.use_credits.available
                          ? `Use 1 credit to download instantly (${options.unlock_options.use_credits.credits_available} available)`
                          : 'No credits available'}
                      </p>
                      <button
                        disabled={!options.unlock_options.use_credits.available}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                          options.unlock_options.use_credits.available
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Use 1 credit to download"
                      >
                        Use 1 Credit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase Option */}
                <div
                  className={`rounded-xl border-2 p-4 sm:p-6 transition-all ${
                    options.unlock_options.purchase.available
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:shadow-lg hover:scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        options.unlock_options.purchase.available
                          ? 'bg-blue-100 dark:bg-blue-900/40'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    >
                      <ShoppingCart
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${
                          options.unlock_options.purchase.available
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Purchase Project</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {options.unlock_options.purchase.message}
                      </p>
                      <button
                        onClick={() => {
                          onPurchase?.();
                          onClose();
                        }}
                        disabled={!options.unlock_options.purchase.available}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                          options.unlock_options.purchase.available
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Purchase this project"
                      >
                        Purchase Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Referral Option */}
                <div
                  className={`rounded-xl border-2 p-4 sm:p-6 transition-all ${
                    options.unlock_options.referral.available
                      ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:shadow-lg hover:scale-[1.02]'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        options.unlock_options.referral.available
                          ? 'bg-purple-100 dark:bg-purple-900/40'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    >
                      <Users
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${
                          options.unlock_options.referral.available
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Earn More Credits</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {options.unlock_options.referral.available
                          ? `${options.unlock_options.referral.message} (${options.unlock_options.referral.remaining_lifetime_credits} slots remaining)`
                          : 'You have reached your referral credit limit'}
                      </p>
                      <button
                        onClick={() => {
                          onNavigateToReferrals?.();
                          onClose();
                        }}
                        disabled={!options.unlock_options.referral.available}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                          options.unlock_options.referral.available
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Go to referrals to earn more credits"
                      >
                        Go to Referrals
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                  <strong>💡 Tip:</strong> Refer friends to earn free credits! Each successful referral gives you 1 credit (up to 6 total).
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex gap-3 justify-end rounded-b-3xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.3s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
};

export default UnlockOptionsModal;
