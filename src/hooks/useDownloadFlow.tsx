import { useState, useCallback } from 'react';
import { useCredits } from './useCredits';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing the complete download flow with credit checking
 * Handles credit validation, unlock modal display, and download execution
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 * 
 * @returns Download flow state and handlers
 */
export const useDownloadFlow = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { availableCredits, downloadWithCredit, refresh: refreshCredits } = useCredits();
  
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Handle download attempt with credit checking
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3
   */
  const handleDownloadAttempt = useCallback(
    async (projectId: string) => {
      // Check authentication first
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }

      setSelectedProjectId(projectId);
      setIsDownloading(true);

      try {
        // Check if user has credits
        if (availableCredits > 0) {
          // Proceed with credit download
          const downloadUrl = await downloadWithCredit(projectId);

          if (downloadUrl) {
            // Trigger file download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message with remaining credits
            toast.success(`Download started! Credits remaining: ${availableCredits - 1}`);

            // Refresh credits after successful download
            await refreshCredits();
          }
        } else {
          // No credits - show unlock options modal
          setShowUnlockModal(true);
        }
      } catch (error) {
        // Handle 402 Payment Required error specifically
        if ((error as any).status === 402) {
          setShowUnlockModal(true);
        } else if ((error as any).status === 401) {
          toast.error('Your session has expired. Please log in again.');
          openAuthModal();
        } else if ((error as any).status === 404) {
          toast.error('Project not found.');
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Download failed. Please try again.';
          toast.error(errorMessage);
        }
      } finally {
        setIsDownloading(false);
      }
    },
    [isAuthenticated, availableCredits, downloadWithCredit, refreshCredits, openAuthModal]
  );

  /**
   * Handle purchase action from unlock modal
   * Requirements: 6.7
   */
  const handlePurchase = useCallback(() => {
    setShowUnlockModal(false);
    // Navigate to purchase flow or open payment modal
    // This will be implemented by the component using this hook
    toast.info('Redirecting to purchase...');
  }, []);

  /**
   * Handle navigate to referrals action from unlock modal
   * Requirements: 6.8
   */
  const handleNavigateToReferrals = useCallback(() => {
    setShowUnlockModal(false);
    // Navigate to referrals page
    // This will be implemented by the component using this hook
    toast.info('Navigating to referrals...');
  }, []);

  /**
   * Close unlock modal
   */
  const closeUnlockModal = useCallback(() => {
    setShowUnlockModal(false);
    setSelectedProjectId(null);
  }, []);

  return {
    showUnlockModal,
    selectedProjectId,
    isDownloading,
    availableCredits,
    handleDownloadAttempt,
    handlePurchase,
    handleNavigateToReferrals,
    closeUnlockModal,
  };
};
