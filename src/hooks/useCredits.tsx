import { useCreditContext } from '../contexts/CreditContext';

/**
 * Custom hook for accessing credit balance and operations
 * Provides simplified access to CreditContext with computed values
 * 
 * Requirements: 1.3, 6.1, 8.1
 * 
 * @returns Credit balance data, loading state, error, and methods
 */
export const useCredits = () => {
  const context = useCreditContext();

  return {
    balance: context.creditBalance,
    availableCredits: context.creditBalance?.available_credits ?? 0,
    creditsUsed: context.creditBalance?.credits_used ?? 0,
    loading: context.loading,
    error: context.error,
    refresh: context.refreshBalance,
    downloadWithCredit: context.downloadWithCredit,
  };
};
