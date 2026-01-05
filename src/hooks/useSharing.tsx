import { useState } from 'react';
import * as referralService from '../services/referralService';
import toast from 'react-hot-toast';

/**
 * Custom hook for social sharing functionality
 * Handles sharing referral codes across multiple platforms
 * 
 * @returns Share method and loading state
 */
export const useSharing = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const share = async (platform: 'whatsapp' | 'twitter' | 'email' | 'copy') => {
    setLoading(true);
    try {
      const shareData = await referralService.getShareContent(platform);

      switch (platform) {
        case 'whatsapp':
          if (shareData.content.url) {
            window.open(shareData.content.url, '_blank');
          }
          break;
        case 'twitter':
          if (shareData.content.url) {
            window.open(shareData.content.url, '_blank');
          }
          break;
        case 'email':
          const emailUrl = `mailto:?subject=${encodeURIComponent(shareData.content.subject || '')}&body=${encodeURIComponent(shareData.content.body || '')}`;
          window.location.href = emailUrl;
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareData.content.text || shareData.share_url);
          toast.success('Link copied to clipboard!');
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share referral code';
      
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
                  share(platform);
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

  return { share, loading };
};
