/**
 * Core Functionality Verification Tests
 * Task 22: Checkpoint - Ensure all core functionality is working
 * 
 * This test suite verifies:
 * 1. Feature flag toggles UI correctly
 * 2. Credit download flow works end-to-end
 * 3. Referral status displays correctly
 * 4. View tracking works
 * 
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Import components and hooks
import { FeatureFlagProvider, useFeatureFlags } from './src/contexts/FeatureFlagContext';
import { CreditProvider, useCreditContext } from './src/contexts/CreditContext';
import { useCredits } from './src/hooks/useCredits';
import { useProjectViewTracking } from './src/hooks/useProjectViewTracking';
import { useReferralStatus } from './src/hooks/useReferralStatus';
import { creditService } from './src/services/creditService';
import { FEATURE_FLAGS } from './src/config/featureFlags';

// Mock the auth context
vi.mock('./src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    isAuthenticated: true,
  }),
}));

// Mock the credit service
vi.mock('./src/services/creditService', () => ({
  creditService: {
    getCreditBalance: vi.fn(),
    downloadWithCredit: vi.fn(),
    getReferralStatus: vi.fn(),
    trackProjectView: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Task 22: Core Functionality Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Feature Flag System', () => {
    it('should read feature flags from environment', () => {
      expect(FEATURE_FLAGS).toBeDefined();
      expect(typeof FEATURE_FLAGS.REFERRAL_ONLY_MODE).toBe('boolean');
      expect(typeof FEATURE_FLAGS.ENABLE_PAYMENTS).toBe('boolean');
      expect(typeof FEATURE_FLAGS.ENABLE_MONTHLY_DRIP).toBe('boolean');
    });

    it('should provide feature flags through context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      );

      const { result } = renderHook(() => useFeatureFlags(), { wrapper });

      expect(result.current.flags).toBeDefined();
      expect(result.current.showPaymentUI).toBeDefined();
      expect(result.current.showCreditUI).toBeDefined();
    });

    it('should compute showPaymentUI correctly based on flags', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      );

      const { result } = renderHook(() => useFeatureFlags(), { wrapper });

      // When REFERRAL_ONLY_MODE is true, showPaymentUI should be false
      if (result.current.flags.REFERRAL_ONLY_MODE) {
        expect(result.current.showPaymentUI).toBe(false);
        expect(result.current.showCreditUI).toBe(true);
      } else {
        expect(result.current.showPaymentUI).toBe(true);
        expect(result.current.showCreditUI).toBe(false);
      }
    });
  });

  describe('2. Credit System Integration', () => {
    it('should load credit balance on mount', async () => {
      const mockBalance = {
        available_credits: 5,
        credits_used: 2,
        signup_bonus_received: true,
        monthly_credits_received: 1,
        referral_credits_earned: 3,
        max_monthly_credits: 3,
        max_referral_credits: 6,
        max_total_credits: 9,
        next_monthly_credit_date: '2026-02-11',
        days_until_next_credit: 30,
      };

      vi.mocked(creditService.getCreditBalance).mockResolvedValue(mockBalance);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CreditProvider>{children}</CreditProvider>
      );

      const { result } = renderHook(() => useCredits(), { wrapper });

      await waitFor(() => {
        expect(result.current.balance).toEqual(mockBalance);
      });

      expect(result.current.availableCredits).toBe(5);
      expect(result.current.creditsUsed).toBe(2);
    });

    it('should handle credit download flow', async () => {
      const mockBalance = {
        available_credits: 5,
        credits_used: 2,
        signup_bonus_received: true,
        monthly_credits_received: 1,
        referral_credits_earned: 3,
        max_monthly_credits: 3,
        max_referral_credits: 6,
        max_total_credits: 9,
        next_monthly_credit_date: '2026-02-11',
        days_until_next_credit: 30,
      };

      const mockDownloadResponse = {
        success: true,
        download_url: 'https://example.com/download/project-123',
        remaining_credits: 4,
        message: 'Download successful',
      };

      vi.mocked(creditService.getCreditBalance).mockResolvedValue(mockBalance);
      vi.mocked(creditService.downloadWithCredit).mockResolvedValue(mockDownloadResponse);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CreditProvider>{children}</CreditProvider>
      );

      const { result } = renderHook(() => useCredits(), { wrapper });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.balance).toBeDefined();
      });

      // Perform download
      let downloadUrl: string = '';
      await act(async () => {
        downloadUrl = await result.current.downloadWithCredit('project-123');
      });

      expect(downloadUrl).toBe('https://example.com/download/project-123');
      expect(creditService.downloadWithCredit).toHaveBeenCalledWith('project-123');
      
      // Verify balance updated optimistically
      expect(result.current.availableCredits).toBe(4);
      expect(result.current.creditsUsed).toBe(3);
    });

    it('should handle insufficient credits error', async () => {
      const mockBalance = {
        available_credits: 0,
        credits_used: 9,
        signup_bonus_received: true,
        monthly_credits_received: 3,
        referral_credits_earned: 6,
        max_monthly_credits: 3,
        max_referral_credits: 6,
        max_total_credits: 9,
        next_monthly_credit_date: null,
        days_until_next_credit: null,
      };

      vi.mocked(creditService.getCreditBalance).mockResolvedValue(mockBalance);
      vi.mocked(creditService.downloadWithCredit).mockRejectedValue(
        new Error('You do not have enough credits to download this project')
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CreditProvider>{children}</CreditProvider>
      );

      const { result } = renderHook(() => useCredits(), { wrapper });

      await waitFor(() => {
        expect(result.current.balance).toBeDefined();
      });

      // Attempt download with no credits
      await expect(async () => {
        await act(async () => {
          await result.current.downloadWithCredit('project-123');
        });
      }).rejects.toThrow('You do not have enough credits to download this project');
    });
  });

  describe('3. Referral Status Display', () => {
    it('should load referral status', async () => {
      const mockReferrals = {
        referrals: [
          {
            id: 'ref-1',
            referral_code: 'ABC123',
            status: 'CONFIRMED' as const,
            referred_user: {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
            },
            created_at: '2026-01-01T00:00:00Z',
            confirmed_at: '2026-01-05T00:00:00Z',
            confirmation_progress: {
              downloads_completed: 1,
              wishlist_adds_completed: 0,
              qualified_views_completed: 0,
              is_confirmed: true,
              confirmation_method: 'download' as const,
            },
            action_needed: null,
          },
          {
            id: 'ref-2',
            referral_code: 'DEF456',
            status: 'PENDING' as const,
            referred_user: {
              id: 'user-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
            },
            created_at: '2026-01-10T00:00:00Z',
            confirmed_at: null,
            confirmation_progress: {
              downloads_completed: 0,
              wishlist_adds_completed: 0,
              qualified_views_completed: 1,
              is_confirmed: false,
              confirmation_method: null,
            },
            action_needed: 'Needs to download a project or add to wishlist',
          },
        ],
      };

      vi.mocked(creditService.getReferralStatus).mockResolvedValue(mockReferrals);

      const { result } = renderHook(() => useReferralStatus());

      await waitFor(() => {
        expect(result.current.referrals).toHaveLength(2);
      });

      expect(result.current.referrals[0].status).toBe('CONFIRMED');
      expect(result.current.referrals[1].status).toBe('PENDING');
      expect(result.current.referrals[1].action_needed).toBe(
        'Needs to download a project or add to wishlist'
      );
    });

    it('should handle empty referral list', async () => {
      vi.mocked(creditService.getReferralStatus).mockResolvedValue({ referrals: [] });

      const { result } = renderHook(() => useReferralStatus());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.referrals).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('4. Project View Tracking', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should track view after 60 seconds', async () => {
      vi.mocked(creditService.trackProjectView).mockResolvedValue();

      const { unmount } = renderHook(() => useProjectViewTracking('project-123'));

      // Fast-forward 60 seconds
      await act(async () => {
        vi.advanceTimersByTime(60000);
      });

      // Wait for tracking call
      await waitFor(() => {
        expect(creditService.trackProjectView).toHaveBeenCalledWith('project-123', 60);
      });

      unmount();
    });

    it('should not track view before 60 seconds', async () => {
      vi.mocked(creditService.trackProjectView).mockResolvedValue();

      const { unmount } = renderHook(() => useProjectViewTracking('project-123'));

      // Fast-forward 30 seconds
      await act(async () => {
        vi.advanceTimersByTime(30000);
      });

      unmount();

      // Should not have tracked yet
      expect(creditService.trackProjectView).not.toHaveBeenCalled();
    });

    it('should track on unmount if >= 60 seconds', async () => {
      vi.mocked(creditService.trackProjectView).mockResolvedValue();

      const { unmount } = renderHook(() => useProjectViewTracking('project-123'));

      // Fast-forward 70 seconds
      await act(async () => {
        vi.advanceTimersByTime(70000);
      });

      unmount();

      // Should have tracked
      await waitFor(() => {
        expect(creditService.trackProjectView).toHaveBeenCalled();
      });
    });

    it('should handle tracking errors silently', async () => {
      vi.mocked(creditService.trackProjectView).mockRejectedValue(
        new Error('Network error')
      );

      const { unmount } = renderHook(() => useProjectViewTracking('project-123'));

      // Fast-forward 60 seconds
      await act(async () => {
        vi.advanceTimersByTime(60000);
      });

      // Should not throw error
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('5. Integration Tests', () => {
    it('should integrate feature flags with credit system', async () => {
      const mockBalance = {
        available_credits: 3,
        credits_used: 1,
        signup_bonus_received: true,
        monthly_credits_received: 0,
        referral_credits_earned: 2,
        max_monthly_credits: 3,
        max_referral_credits: 6,
        max_total_credits: 9,
        next_monthly_credit_date: '2026-02-11',
        days_until_next_credit: 30,
      };

      vi.mocked(creditService.getCreditBalance).mockResolvedValue(mockBalance);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FeatureFlagProvider>
          <CreditProvider>{children}</CreditProvider>
        </FeatureFlagProvider>
      );

      const { result: flagsResult } = renderHook(() => useFeatureFlags(), { wrapper });
      const { result: creditsResult } = renderHook(() => useCredits(), { wrapper });

      await waitFor(() => {
        expect(creditsResult.current.balance).toBeDefined();
      });

      // When REFERRAL_ONLY_MODE is true, credit UI should be shown
      if (flagsResult.current.flags.REFERRAL_ONLY_MODE) {
        expect(flagsResult.current.showCreditUI).toBe(true);
        expect(creditsResult.current.availableCredits).toBe(3);
      }
    });
  });
});
