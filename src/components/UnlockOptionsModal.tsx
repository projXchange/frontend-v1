import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Users, Zap, AlertCircle, Loader } from 'lucide-react';
import { getUnlockOptions } from '../services/referralService';
import type { UnlockOptions } from '../types/Referral';
import toast from 'react-hot-toast';
import { useCredits } from '../hooks/useCredits';

interface UnlockOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onPurchase?: () => void;
  onNavigateToReferrals?: () => void;
  onCreditUsed?: () => void;
}

export const UnlockOptionsModal: React.FC<UnlockOptionsModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onPurchase,
  onNavigateToReferrals,
  onCreditUsed,
}) => {
  const [options, setOptions] = useState<UnlockOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCredit, setIsUsingCredit] = useState(false);
  const { downloadWithCredit } = useCredits();

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

  const handleUseCredit = async () => {
    if (!options?.unlock_options.use_credits.available) return;

    setIsUsingCredit(true);
    try {
      toast.loading('Using credit to unlock project...', { id: 'credit-unlock' });

      // Use credit to unlock/purchase the project (but don't download yet)
      await downloadWithCredit(projectId);

      toast.success('Project unlocked! You can now download it.', { id: 'credit-unlock' });

      // Call the callback to refresh project data
      if (onCreditUsed) {
        onCreditUsed();
      }

      // Close the modal
      onClose();
    } catch (err) {
      console.error('Credit unlock error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to unlock project', { id: 'credit-unlock' });
    } finally {
      setIsUsingCredit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Unlock Project</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={loadUnlockOptions}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
              >
                Retry
              </button>
            </div>
          ) : options ? (
            <div className="space-y-4">
              {/* Credit Status */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Credits</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{options.current_credits}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Monthly: {options.lifetime_limits.monthly_credits.used}/{options.lifetime_limits.monthly_credits.max} • 
                  Referral: {options.lifetime_limits.referral_credits.used}/{options.lifetime_limits.referral_credits.max}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {/* Use Credits */}
                {options.unlock_options.use_credits.available ? (
                  <button
                    onClick={handleUseCredit}
                    disabled={isUsingCredit}
                    className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {isUsingCredit ? 'Unlocking...' : 'Use 1 Credit'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {options.unlock_options.use_credits.credits_available} available
                        </div>
                      </div>
                    </div>
                  </button>
                ) : options.current_credits > 0 ? (
                  <div className="p-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-500 dark:text-gray-400 text-sm">Credits Not Available</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Only for projects under ₹2000</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Purchase */}
                <button
                  onClick={() => {
                    onPurchase?.();
                    onClose();
                  }}
                  className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">Purchase with Money</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Always available</div>
                    </div>
                  </div>
                </button>

                {/* Referrals */}
                {options.unlock_options.referral.available && (
                  <button
                    onClick={() => {
                      onNavigateToReferrals?.();
                      onClose();
                    }}
                    className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">Earn More Credits</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {options.unlock_options.referral.remaining_lifetime_credits} slots remaining
                        </div>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Info */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                1 credit per referral • Max 6 referral credits
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UnlockOptionsModal;
