import { useState, useEffect, useCallback } from 'react';
import * as referralService from '../services/referralService';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing user credit balance
 * Auto-loads credits on mount and provides refresh functionality
 * 
 * @returns Credit balance, loading state, error, and refresh method
 */
export const useCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCredits = useCallback(async () => {
    setLoading(true);
    try {
      const data = await referralService.getUserCredits();
      setCredits(data.download_credits);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load credits';
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
                  loadCredits();
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

  useEffect(() => {
    // Auto-load credits on mount
    loadCredits();
  }, [loadCredits]);

  return { credits, loading, error, refresh: loadCredits };
};
