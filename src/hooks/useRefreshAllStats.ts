import { useCallback } from 'react';
import { useCreditContext } from '../contexts/CreditContext';
import { useReferralContext } from '../contexts/ReferralContext';

/**
 * Hook to refresh all stats across the application
 * Use this after any action that modifies credits or referrals
 * to ensure all UI components show consistent, up-to-date data
 */
export const useRefreshAllStats = () => {
  const { refreshBalance } = useCreditContext();
  const { loadDashboard } = useReferralContext();

  const refreshAll = useCallback(async () => {
    try {
      // Refresh credit balance and referral dashboard in parallel
      await Promise.all([
        refreshBalance(),
        loadDashboard(),
      ]);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      // Don't throw - individual contexts will handle their own errors
    }
  }, [refreshBalance, loadDashboard]);

  return { refreshAll };
};
