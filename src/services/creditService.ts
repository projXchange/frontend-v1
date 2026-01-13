// Credit Service - API client for credit operations in Referral-Only Access Mode

import { apiClient } from '../utils/apiClient';
import { getApiUrl } from '../config/api';
import { CreditBalance, CreditDownloadResponse } from '../types/Credit';
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
   * @returns Promise resolving to CreditBalance object
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

      return await response.json();
    } catch (error) {
      // Parse and re-throw with user-friendly message
      const creditError = parseCreditError(error);
      throw new Error(creditError.userMessage);
    }
  }

  /**
   * Download a project using a credit
   * @param projectId - The ID of the project to download
   * @returns Promise resolving to CreditDownloadResponse with download URL
   * @throws Error if download fails, insufficient credits, or network error
   */
  async downloadWithCredit(projectId: string): Promise<CreditDownloadResponse> {
    try {
      const response = await apiClient(getApiUrl('/downloads/consume-credit'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ project_id: projectId }),
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

      return await response.json();
    } catch (error) {
      // Parse and re-throw with user-friendly message
      const creditError = parseCreditError(error);
      throw new Error(creditError.userMessage);
    }
  }

  /**
   * Get the status of all user referrals
   * @returns Promise resolving to array of ReferralWithStatus objects
   * @throws Error if the request fails
   */
  async getReferralStatus(): Promise<{ referrals: ReferralWithStatus[] }> {
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

