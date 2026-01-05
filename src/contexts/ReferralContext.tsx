import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as referralService from '../services/referralService';
import { ReferralDashboardData, ReferralCode } from '../types/Referral';
import toast from 'react-hot-toast';

interface ReferralContextType {
  dashboardData: ReferralDashboardData | null;
  referralHistory: ReferralCode[];
  credits: number;
  loading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
  loadHistory: () => Promise<void>;
  generateReferral: () => Promise<{ referral_code: string; shareable_link: string }>;
  refreshCredits: () => Promise<void>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<ReferralDashboardData | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralCode[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await referralService.getReferralDashboard();
      setDashboardData(data);
      setCredits(data.credits.downloadCredits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      
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
                  loadDashboard();
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
  }, []);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await referralService.getReferralHistory();
      setReferralHistory(data.referrals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load history';
      setError(errorMessage);
      
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
                  loadHistory();
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
  }, []);

  const generateReferral = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await referralService.generateReferralCode();
      toast.success('Referral code generated successfully!');
      // Refresh dashboard to update stats
      await loadDashboard();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate referral';
      setError(errorMessage);
      
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
                  generateReferral();
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadDashboard]);

  const refreshCredits = useCallback(async () => {
    try {
      const data = await referralService.getUserCredits();
      setCredits(data.download_credits);
    } catch (err) {
      // Silently fail for credit refresh - don't show error toast
      // as this is a background operation
      console.error('Failed to refresh credits:', err);
      
      // Only show error if it's not a network error
      const isNetworkError = err instanceof Error && 
        (err.message.includes('network') || err.message.includes('fetch'));
      
      if (!isNetworkError) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to refresh credits';
        toast.error(errorMessage, { duration: 3000 });
      }
    }
  }, []);

  const value: ReferralContextType = {
    dashboardData,
    referralHistory,
    credits,
    loading,
    error,
    loadDashboard,
    loadHistory,
    generateReferral,
    refreshCredits
  };

  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>;
};

export const useReferralContext = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferralContext must be used within a ReferralProvider');
  }
  return context;
};
