import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { creditService } from '../services/creditService';
import { ReferralWithStatus } from '../types/Referral';
import { parseCreditError, isRetryable } from '../utils/creditErrors';

/**
 * Custom hook for accessing referral status data
 * Auto-loads referral status on mount and provides refresh functionality
 * 
 * Requirements: 3.1, 5.1, 9.1, 9.2, 9.3
 * 
 * @returns Referral status data, loading state, error, and refresh method
 */
export const useReferralStatus = () => {
  const [referrals, setReferrals] = useState<ReferralWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load referral status from API
   * Sets loading state and handles errors
   */
  const loadReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await creditService.getReferralStatus();
      setReferrals(data.referrals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load referrals';
      setError(errorMessage);
      console.error('Error loading referral status:', err);
      
      // Parse error to check if retryable
      const creditError = parseCreditError(err);
      
      if (isRetryable(creditError)) {
        // Show error with instruction to retry
        toast.error(`${errorMessage} Please try refreshing.`, {
          duration: 5000,
        });
      } else {
        // Show error without retry
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load referrals on mount
  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  return {
    referrals,
    loading,
    error,
    refresh: loadReferrals,
  };
};
