import { useEffect } from 'react';
import { useReferralContext } from '../contexts/ReferralContext';

/**
 * Custom hook for accessing referral dashboard data
 * Auto-loads dashboard data on mount if not already loaded
 * 
 * @returns Referral context with dashboard data, loading state, error, and methods
 */
export const useReferrals = () => {
  const context = useReferralContext();

  useEffect(() => {
    // Auto-load dashboard data on mount if not already loaded
    if (!context.dashboardData && !context.loading) {
      context.loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dashboardData, context.loading]);

  return context;
};
