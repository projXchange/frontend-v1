// Credit Service - API client for credit operations in Referral-Only Access Mode

import { apiClient } from '../utils/apiClient';
import { getApiUrl } from '../config/api';
import { CreditBalance, CreditBalanceResponse, CreditDownloadResponse } from '../types/Credit';
import { ReferralWithStatus } from '../types/Referral';
import { parseCreditError } from '../utils/creditErrors';

/**
 * Service class for handling credit-related API operations
 */
class CreditService {
  /**
   * Get authentication headers with JWT token
   * @returns Headers object with Authorization token if available
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Fetch the user's current credit balance
   * Calls GET /credits/balance endpoint and normalizes the response
   * @returns Promise resolving to CreditBalance object with normalized data
   * @throws Error if the request fails or user is not authenticated
   */
  async getCreditBalance(): Promise<CreditBalance> {
    try {
      const response = await apiClient(getApiUrl('/credits/balance'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Failed to fetch credit balance';
        throw new Error(errorMessage);
      }

      const responseData: CreditBalanceResponse = await response.json();

      // Normalize the response to internal CreditBalance format
      return this.normalizeCreditBalance(responseData.data);
    } catch (error) {
      // Parse and re-throw with user-friendly message
      const creditError = parseCreditError(error);
      throw new Error(creditError.userMessage);
    }
  }

  /**
   * Normalize API response to internal CreditBalance format
   * Adds computed values and aliases for backward compatibility
   * @param data - Raw data from API response
   * @returns Normalized CreditBalance object
   */
  private normalizeCreditBalance(data: CreditBalanceResponse['data']): CreditBalance {
    const totalUsed = data.lifetime_monthly_credits + data.lifetime_referral_credits;
    const signupBonusUsed = data.download_credits > 0 ? 1 : 0;

    return {
      user_id: data.user_id,
      download_credits: data.download_credits,
      lifetime_monthly_credits: data.lifetime_monthly_credits,
      lifetime_referral_credits: data.lifetime_referral_credits,
      total_available_credits: data.total_available_credits,
      // Computed values for UI
      available_credits: data.total_available_credits,
      credits_used: totalUsed + signupBonusUsed,
      signup_bonus_received: signupBonusUsed > 0,
      monthly_credits_received: data.lifetime_monthly_credits,
      referral_credits_earned: data.lifetime_referral_credits,
      max_monthly_credits: 3,
      max_referral_credits: 6,
      max_total_credits: 10,
    };
  }

  /**
   * Download a project using a credit
   * Uses the dedicated credit download endpoint for direct downloads
   * @param projectId - The ID of the project to download
   * @returns Promise resolving to CreditDownloadResponse with download URL
   * @throws Error if download fails, insufficient credits, or network error
   */
  async downloadWithCredit(projectId: string): Promise<CreditDownloadResponse> {
    try {
      // Use the dedicated credit download endpoint for direct downloads
      // This bypasses the cart system and creates a zero-amount transaction
      const response = await apiClient(getApiUrl('/downloads/credits'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          project_id: projectId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Failed to download with credit';

        // Provide specific error messages for common scenarios
        if (response.status === 400 && errorMessage.toLowerCase().includes('insufficient')) {
          throw new Error('You do not have enough credits to download this project');
        }
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        if (response.status === 401) {
          throw new Error('Please log in to download projects');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // The response should match CreditDownloadResponse format
      return {
        success: data.success ?? true,
        download_url: data.download_url || '',
        remaining_credits: data.remaining_credits ?? 0,
        message: data.message || 'Download successful'
      };
    } catch (error) {
      // Parse and re-throw with user-friendly message
      const creditError = parseCreditError(error);
      throw new Error(creditError.userMessage);
    }
  }

  /**
   * Get the status of all user referrals
   * NOTE: This endpoint returns aggregate statistics, not individual referral details
   * For individual referral history, use referralService.getReferralHistory() instead
   * @returns Promise resolving to referral status summary
   * @throws Error if the request fails
   */
  async getReferralStatus(): Promise<{
    can_create_referral: boolean;
    monthly_referrals: {
      created: number;
      max: number;
      remaining: number;
    };
    lifetime_referral_credits: {
      earned: number;
      max: number;
      remaining: number;
      can_earn_more: boolean;
    };
    total_referrals: {
      all: number;
      qualified: number;
      pending: number;
    };
    has_active_referral_code: boolean;
    latest_referral_code: string;
  }> {
    try {
      const response = await apiClient(getApiUrl('/referrals/status'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Failed to fetch referral status';
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Parse and re-throw with user-friendly message
      const creditError = parseCreditError(error);
      throw new Error(creditError.userMessage);
    }
  }

  /**
   * Track a project view for referral confirmation purposes
   * @param projectId - The ID of the project being viewed
   * @param durationSeconds - How long the user viewed the project (in seconds)
   * @returns Promise that resolves when tracking is complete
   * @throws Error if tracking fails (should be handled silently in UI)
   */
  async trackProjectView(projectId: string, durationSeconds: number): Promise<void> {
    try {
      const response = await apiClient(getApiUrl('/tracking/project-view'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          project_id: projectId,
          duration_seconds: durationSeconds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Failed to track project view';
        throw new Error(errorMessage);
      }

      // No return value needed for tracking
    } catch (error) {
      // Silent failure - log but don't disrupt user experience
      console.error('[Credit Service] Failed to track project view:', error);
      // Don't re-throw - tracking failures should not affect user experience
    }
  }

  /**
   * Trigger referral confirmation via wishlist add
   * This is called silently when a referred user adds a project to their wishlist
   * @param projectId - The ID of the project added to wishlist
   * @returns Promise that resolves when confirmation is processed
   * @throws Error if confirmation fails (should be handled silently in UI)
   */
  async confirmReferralViaWishlist(projectId: string): Promise<void> {
    try {
      const response = await apiClient(getApiUrl('/referrals/confirm-wishlist'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Failed to confirm referral via wishlist';
        throw new Error(errorMessage);
      }

      // No return value needed - confirmation happens silently
    } catch (error) {
      // Silent failure - log but don't disrupt user experience
      console.error('[Credit Service] Failed to confirm referral via wishlist:', error);
      // Don't re-throw - confirmation failures should not affect user experience
    }
  }
}

// Export singleton instance
export const creditService = new CreditService();

