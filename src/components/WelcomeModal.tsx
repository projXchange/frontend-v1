import React, { useEffect, useState } from 'react';
import { X, Gift, Calendar, Users, CheckCircle } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { useCredits } from '../hooks/useCredits';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_MODAL_DISMISSED_KEY = 'welcomeModalDismissed';

/**
 * WelcomeModal component for first-time users in referral-only mode
 * Explains the credit system and how to earn more credits
 * 
 * Requirements: 1.2, 15.1, 15.3
 */
const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { flags } = useFeatureFlags();
  const { balance } = useCredits();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Store dismissal in local storage
      localStorage.setItem(WELCOME_MODAL_DISMISSED_KEY, 'true');
      onClose();
    }, 300);
  };

  // Don't render if not visible or not in referral-only mode
  if (!isVisible || !flags.REFERRAL_ONLY_MODE) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-4 transition-opacity duration-300 ease-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative transform transition-all duration-500 ease-in-out ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 px-6 py-8 sm:px-10 sm:py-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Gift className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome to ProjXchange!</h2>
          </div>
          <p className="text-blue-100 text-lg">
            You've received <span className="font-bold text-white">1 free credit</span> to get started!
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 space-y-6">
          {/* Launch Period Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              🚀 <span className="font-bold">Launch Period:</span> We're in credit-only mode for our first 3 months. 
              This creates a premium, ethical experience while we build our community.
            </p>
          </div>

          {/* How to Earn More Credits */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              How to Earn More Credits
            </h3>
            
            <div className="space-y-4">
              {/* Monthly Drip */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Monthly Bonus
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive <span className="font-semibold text-gray-900 dark:text-gray-100">1 credit every month</span> for your first 3 months (3 credits total)
                  </p>
                </div>
              </div>

              {/* Referrals */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Invite Friends
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn <span className="font-semibold text-gray-900 dark:text-gray-100">1 credit per confirmed referral</span>, up to 6 credits
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Confirmation Criteria */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              When Does a Referral Get Confirmed?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your friend needs to complete <span className="font-semibold text-gray-900 dark:text-gray-100">one</span> of these actions:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Download 1 project</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Add 1 project to their wishlist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>View 2 different projects for 60 seconds each</span>
              </li>
            </ul>
          </div>

          {/* Total Credits Available */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              <span className="font-bold text-gray-900 dark:text-gray-100">Total Available:</span> Up to 10 credits 
              <span className="text-gray-600 dark:text-gray-400"> (1 signup + 3 monthly + 6 referrals)</span>
            </p>
          </div>

          {/* Got it button */}
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

/**
 * Hook to check if welcome modal should be shown
 * Returns true if user is new (has signup bonus) and hasn't dismissed the modal
 */
export const useShouldShowWelcomeModal = (): boolean => {
  const { flags } = useFeatureFlags();
  const { balance } = useCredits();
  
  // Don't show if not in referral-only mode
  if (!flags.REFERRAL_ONLY_MODE) return false;
  
  // Don't show if already dismissed
  const dismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_KEY);
  if (dismissed === 'true') return false;
  
  // Show if user has received signup bonus (indicates new user)
  return balance?.signup_bonus_received === true;
};
