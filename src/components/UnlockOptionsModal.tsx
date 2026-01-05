import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Gift, Coins, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUnlockOptions } from '../services/referralService';
import type { UnlockOptions } from '../types/Referral';
import toast from 'react-hot-toast';

interface UnlockOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const UnlockOptionsModal: React.FC<UnlockOptionsModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const navigate = useNavigate();
  const [options, setOptions] = useState<UnlockOptions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchUnlockOptions();
    }
  }, [isOpen, projectId]);

  // Focus management and keyboard navigation
  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when modal opens
      const timer = setTimeout(() => {
        if (!loading && !error) {
          firstFocusableRef.current?.focus();
        }
      }, 100);

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      
      // Trap focus within modal
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = document.querySelectorAll(
            '[data-modal="unlock-options"] button:not(:disabled), [data-modal="unlock-options"] [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen, onClose, loading, error]);

  const fetchUnlockOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnlockOptions(projectId);
      setOptions(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load unlock options';
      setError(errorMessage);
      
      // Check if error is retryable
      const isRetryable = err.retryable ?? false;
      
      if (isRetryable) {
        toast.error(
          (t) => (
            <div className="flex items-center gap-3">
              <span>{errorMessage}</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  fetchUnlockOptions();
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

  const handleGoToReferrals = () => {
    onClose();
    navigate('/dashboard?tab=referrals');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-options-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700 animate-slideInUp transform transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
        data-modal="unlock-options"
      >
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
              <h2 id="unlock-options-modal-title" className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Unlock This Project
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                Choose how you'd like to access this project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            ref={closeButtonRef}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            aria-label="Close modal"
            tabIndex={0}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading unlock options...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchUnlockOptions}
                ref={firstFocusableRef}
                className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                tabIndex={0}
              >
                Try Again
              </button>
            </div>
          )}

          {options && !loading && !error && (
            <>
              {/* Current Status */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Current Credits
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {options.current_credits}
                    </p>
                  </div>
                  {options.has_purchased && (
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                      Already Purchased
                    </div>
                  )}
                </div>
              </div>

              {/* Unlock Options */}
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Available Options
                </p>

                {/* Use Credits Option */}
                <div
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    options.unlock_options.use_credits.available
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700 hover:shadow-md cursor-pointer'
                      : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        options.unlock_options.use_credits.available
                          ? 'bg-green-100 dark:bg-green-900/40'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    >
                      <Coins
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          options.unlock_options.use_credits.available
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Use Credits
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {options.unlock_options.use_credits.available
                          ? `Use 1 credit to download this project (${options.unlock_options.use_credits.credits_available} available)`
                          : 'No credits available'}
                      </p>
                      {!options.unlock_options.use_credits.available && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          Earn credits through referrals or monthly bonuses
                        </p>
                      )}
                    </div>
                    {options.unlock_options.use_credits.available && (
                      <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 hidden sm:block" />
                    )}
                  </div>
                </div>

                {/* Purchase Option */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Purchase Project
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {options.unlock_options.purchase.message}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 hidden sm:block" />
                  </div>
                </div>

                {/* Earn Credits Option */}
                <div
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    options.unlock_options.referral.available
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700 hover:shadow-md cursor-pointer'
                      : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        options.unlock_options.referral.available
                          ? 'bg-purple-100 dark:bg-purple-900/40'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    >
                      <Gift
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          options.unlock_options.referral.available
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Earn Credits
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {options.unlock_options.referral.message}
                      </p>
                      {options.unlock_options.referral.available && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <span>
                            Monthly slots: {options.unlock_options.referral.remaining_monthly_slots}/3
                          </span>
                          <span>
                            Lifetime credits: {options.unlock_options.referral.remaining_lifetime_credits}/6
                          </span>
                        </div>
                      )}
                      {options.unlock_options.referral.available && (
                        <button
                          onClick={handleGoToReferrals}
                          ref={firstFocusableRef}
                          className="mt-3 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                          tabIndex={0}
                        >
                          Go to Referrals
                        </button>
                      )}
                    </div>
                    {options.unlock_options.referral.available && (
                      <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 hidden sm:block" />
                    )}
                  </div>
                </div>
              </div>

              {/* Lifetime Limits Info */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Lifetime Progress
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Monthly Credits</p>
                    <p>
                      {options.lifetime_limits.monthly_credits.used} / {options.lifetime_limits.monthly_credits.max} used
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Referral Credits</p>
                    <p>
                      {options.lifetime_limits.referral_credits.used} / {options.lifetime_limits.referral_credits.max} used
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex gap-3 justify-end rounded-b-3xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            tabIndex={0}
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
