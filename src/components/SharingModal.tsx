import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Share2, Copy, Check } from 'lucide-react';
import { useSharing } from '../hooks/useSharing.tsx';
import { mixpanel } from '../services/mixpanelService';

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export const SharingModal: React.FC<SharingModalProps> = ({
  isOpen,
  onClose,
  referralCode,
}) => {
  const { share, loading } = useSharing();
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Reset copied state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Focus management and keyboard navigation
  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when modal opens
      const timer = setTimeout(() => {
        firstFocusableRef.current?.focus();
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
            '[data-modal="sharing"] button:not(:disabled), [data-modal="sharing"] [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShare = async (platform: 'whatsapp' | 'twitter' | 'email' | 'copy') => {
    await share(platform);

    // Track referral sharing in Mixpanel
    if (platform === 'copy') {
      mixpanel.trackReferralCodeCopied(referralCode);
      setCopied(true);
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } else {
      mixpanel.trackReferralLinkShared(referralCode, platform);
    }
  };

  const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sharing-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-slate-700 animate-slideInUp transform transition-all duration-500 scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
        data-modal="sharing"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 id="sharing-modal-title" className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Share Your Referral
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 truncate">
                Invite friends and earn credits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            ref={closeButtonRef}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
            tabIndex={0}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {/* Referral Code Display */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Referral Code
            </label>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-wider font-mono break-all">
                {referralCode}
              </p>
            </div>
          </div>

          {/* Sharing Options */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Share via
            </p>

            {/* WhatsApp */}
            <button
              ref={firstFocusableRef}
              onClick={() => handleShare('whatsapp')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Share on WhatsApp"
              tabIndex={0}
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">WhatsApp</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Share with your contacts</p>
              </div>
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-200 dark:border-sky-800 hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Share on Twitter"
              tabIndex={0}
            >
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 transition-colors">
                <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Twitter</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Post to your followers</p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={() => handleShare('email')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Share via Email"
              tabIndex={0}
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Email</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Send via email client</p>
              </div>
            </button>

            {/* Copy Link */}
            <button
              onClick={() => handleShare('copy')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Copy link to clipboard"
              tabIndex={0}
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                {copied ? (
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                  {copied ? 'Copied!' : 'Copy Link'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {copied ? 'Link copied to clipboard' : 'Copy referral link'}
                </p>
              </div>
            </button>
          </div>

          {/* Referral URL Display */}
          <div className="mt-4 sm:mt-6 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Referral Link</p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
              {shareUrl}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
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
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};
