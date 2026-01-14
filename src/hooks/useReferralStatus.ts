import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getReferralHistory } from '../services/referralService';
import { ReferralCode } from '../types/Referral';
import { parseCreditError, isRetryable } from '../utils/creditErrors';

/**
 * Custom hook for accessing referral history data
 * Auto-loads referral history on mount and provides refresh functionality
 * 
 * Note: This hook uses /referrals/history endpoint which returns individual referral records
 * For aggregate statistics, use the /referrals/status endpoint directly
 * 
 * Requirements: 3.1, 5.1, 9.1, 9.2, 9.3
 * 
 * @returns Referral history data, loading state, error, and refresh method
 */
export const useReferralStatus = () => {
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load referral history from API
   * Sets loading state and handles errors
   */
  const loadReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReferralHistory();
      setReferrals(data.referrals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load referrals';
      setError(errorMessage);
      console.error('Error loading referral history:', err);
      
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
