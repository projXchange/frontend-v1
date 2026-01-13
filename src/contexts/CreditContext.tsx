// Credit Context - Global state management for credit system in Referral-Only Access Mode

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';
import { creditService } from '../services/creditService';
import { CreditBalance } from '../types/Credit';
import { useAuth } from './AuthContext';
import { parseCreditError, isRetryable } from '../utils/creditErrors';

/**
 * Context type definition for credit operations
 */
interface CreditContextType {
  creditBalance: CreditBalance | null;
  loading: boolean;
  error: string | null;
  loadCreditBalance: () => Promise<void>;
  downloadWithCredit: (projectId: string) => Promise<string>; // returns download URL
  refreshBalance: () => Promise<void>;
}

// Create context with undefined default
const CreditContext = createContext<CreditContextType | undefined>(undefined);

/**
 * CreditProvider component - Manages global credit state
 * Provides credit balance, loading states, and credit operations to child components
 */
export const CreditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Load credit balance from API
   * Sets loading state and handles errors with toast notifications
   */
  const loadCreditBalance = useCallback(async () => {
    if (!user) {
      setCreditBalance(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const balance = await creditService.getCreditBalance();
      setCreditBalance(balance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load credit balance';
      setError(errorMessage);
      
      // Parse error to check if retryable
      const creditError = parseCreditError(err);
      
      if (isRetryable(creditError)) {
        // Show error with instruction to retry
        toast.error(`${errorMessage} Please try refreshing the page.`, {
          duration: 5000,
        });
      } else {
        // Show error without retry
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Download a project using a credit
   * Updates balance optimistically and handles errors
   * @param projectId - The ID of the project to download
   * @returns Promise resolving to download URL
   * @throws Error if download fails
   */
  const downloadWithCredit = useCallback(async (projectId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await creditService.downloadWithCredit(projectId);

      // Update credit balance optimistically
      setCreditBalance((prev) =>
        prev
          ? {
              ...prev,
              available_credits: response.remaining_credits,
              credits_used: prev.credits_used + 1,
            }
          : null
      );

      toast.success('Download started! Credit used.');
      return response.download_url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download with credit';
      setError(errorMessage);
      
      // Parse error to check if retryable
      const creditError = parseCreditError(err);
      
      if (isRetryable(creditError)) {
        // Show error with instruction to retry
        toast.error(`${errorMessage} Please try again.`, {
          duration: 5000,
        });
      } else {
        // Show error without retry (e.g., insufficient credits)
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh credit balance from API
   * Wrapper around loadCreditBalance for explicit refresh calls
   */
  const refreshBalance = useCallback(async () => {
    await loadCreditBalance();
  }, [loadCreditBalance]);

  // Auto-load credit balance on mount when user is authenticated
  useEffect(() => {
    if (user && !creditBalance) {
      loadCreditBalance();
    }
  }, [user, creditBalance, loadCreditBalance]);

  const value: CreditContextType = {
    creditBalance,
    loading,
    error,
    loadCreditBalance,
    downloadWithCredit,
    refreshBalance,
  };

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
};

/**
 * Hook to access credit context
 * Must be used within CreditProvider
 * @throws Error if used outside CreditProvider
 */
export const useCreditContext = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCreditContext must be used within a CreditProvider');
  }
  return context;
};
