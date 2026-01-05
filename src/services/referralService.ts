import { apiClient } from '../utils/apiClient';
import { API_CONFIG, getApiUrl } from '../config/api';
import { mapReferralError } from '../utils/referralErrors';
import type {
  ReferralDashboardData,
  ReferralCode,
  UnlockOptions,
  ShareContent,
  AdminReferralStats,
  SuspiciousReferral,
} from '../types/Referral';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Create headers with authentication token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Handle API response and throw errors if needed
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: 'An unexpected error occurred',
        status: response.status,
      };
    }

    // Map the error to a user-friendly format
    const mappedError = mapReferralError(errorData);
    
    // Create an error with the mapped message
    const error = new Error(mappedError.userMessage);
    (error as any).code = mappedError.code;
    (error as any).retryable = mappedError.retryable;
    (error as any).originalError = errorData;
    
    throw error;
  }
  return response.json();
}

// ============================================================================
// User Referral Management API
// ============================================================================

/**
 * Generate a new referral code
 * @returns Referral code data with shareable link
 */
export async function generateReferralCode(): Promise<{
  referral_code: string;
  shareable_link: string;
  created_at: string;
  message: string;
}> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL_GENERATE),
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    // If error is already mapped, rethrow it
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    // Otherwise, map it
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

/**
 * Get referral dashboard data including stats and credits
 * @returns Dashboard data with credits, stats, and recent referrals
 */
export async function getReferralDashboard(): Promise<ReferralDashboardData> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL_DASHBOARD),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

/**
 * Get complete referral history for the authenticated user
 * @returns List of all referral codes with their status
 */
export async function getReferralHistory(): Promise<{
  referrals: ReferralCode[];
  total: number;
}> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL_HISTORY),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

// ============================================================================
// Credit Management API
// ============================================================================

/**
 * Get user's current download credits
 * @returns Credit balance and download eligibility
 */
export async function getUserCredits(): Promise<{
  download_credits: number;
  can_download: boolean;
}> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.DOWNLOADS_CREDITS),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

/**
 * Get unlock options for a specific project
 * @param projectId - The ID of the project to unlock
 * @returns Available unlock options and current credit status
 */
export async function getUnlockOptions(
  projectId: string
): Promise<UnlockOptions> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL_UNLOCK_OPTIONS(projectId)),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

// ============================================================================
// Social Sharing API
// ============================================================================

/**
 * Get platform-specific sharing content
 * @param platform - The platform to share on (whatsapp, twitter, email, copy)
 * @returns Formatted sharing content for the specified platform
 */
export async function getShareContent(
  platform: 'whatsapp' | 'twitter' | 'email' | 'copy'
): Promise<ShareContent> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.REFERRAL_SHARE(platform)),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

// ============================================================================
// Admin Referral Management API
// ============================================================================

/**
 * Get system-wide referral statistics (admin only)
 * @param period - Number of days to include in period stats (default: 30)
 * @returns Comprehensive referral statistics
 */
export async function getAdminReferralStats(
  period: number = 30
): Promise<AdminReferralStats> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('period', period.toString());

    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_REFERRAL_STATS)}?${queryParams.toString()}`;

    const response = await apiClient(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}

/**
 * Get list of suspicious referrals (admin only)
 * @param limit - Maximum number of results to return (default: 50)
 * @param offset - Number of results to skip for pagination (default: 0)
 * @returns List of flagged suspicious referrals
 */
export async function getSuspiciousReferrals(
  limit: number = 50,
  offset: number = 0
): Promise<{
  suspicious_referrals: SuspiciousReferral[];
  limit: number;
  offset: number;
  generated_at: string;
}> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());

    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_REFERRAL_SUSPICIOUS)}?${queryParams.toString()}`;

    const response = await apiClient(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    const mappedError = mapReferralError(error);
    const newError = new Error(mappedError.userMessage);
    (newError as any).code = mappedError.code;
    (newError as any).retryable = mappedError.retryable;
    throw newError;
  }
}
