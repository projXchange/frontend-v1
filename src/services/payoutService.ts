import { apiClient } from '../utils/apiClient';
import { API_CONFIG, getApiUrl } from '../config/api';
import type {
  PaymentMethod,
  PaymentMethodsResponse,
  AddPaymentMethodForm,
  PayoutSettings,
  BalanceResponse,
  UpdateSettingsForm,
  Payout,
  PayoutsResponse,
  RequestPayoutForm,
  PayoutStatsResponse,
  ManualPayoutForm,
} from '../types/Payout';

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
    const error = await response.json().catch(() => ({
      error: 'An unexpected error occurred',
    }));
    throw error;
  }
  return response.json();
}

// ============================================================================
// Payment Methods API
// ============================================================================

/**
 * Get all payment methods for the authenticated user
 * Or for a specific user if admin
 */
export async function getPaymentMethods(userId?: string): Promise<PaymentMethod[]> {
  const queryParams = userId ? `?user_id=${userId}` : '';
  const response = await apiClient(
    `${getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_METHODS)}${queryParams}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse<PaymentMethodsResponse>(response);
  return data.payment_methods;
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(
  formData: AddPaymentMethodForm
): Promise<PaymentMethod> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_METHODS),
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    }
  );

  const data = await handleResponse<{ message: string; payment_method: PaymentMethod }>(
    response
  );
  return data.payment_method;
}

/**
 * Set a payment method as primary
 */
export async function setPrimaryPaymentMethod(id: string): Promise<PaymentMethod> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.SET_PRIMARY_PAYMENT(id)),
    {
      method: 'PUT',
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse<{ message: string; payment_method: PaymentMethod }>(
    response
  );
  return data.payment_method;
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(id: string): Promise<void> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_METHOD_BY_ID(id)),
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Failed to delete payment method',
    }));
    throw error;
  }
}

// ============================================================================
// Balance and Settings API
// ============================================================================

/**
 * Get balance and settings for the authenticated user
 */
export async function getBalanceAndSettings(): Promise<BalanceResponse> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.PAYOUT_BALANCE),
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BalanceResponse>(response);
}

/**
 * Update payout settings
 */
export async function updatePayoutSettings(
  settings: UpdateSettingsForm
): Promise<PayoutSettings> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.PAYOUT_SETTINGS),
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    }
  );

  const data = await handleResponse<{ message: string; settings: PayoutSettings }>(
    response
  );
  return data.settings;
}

// ============================================================================
// Payout Request and History API
// ============================================================================

/**
 * Request a new payout
 */
export async function requestPayout(
  formData: RequestPayoutForm
): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.REQUEST_PAYOUT),
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    }
  );

  const data = await handleResponse<{ message: string; payout: Payout }>(response);
  return data.payout;
}

/**
 * Verify a payout using the verification token
 */
export async function verifyPayout(token: string): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYOUT(token)),
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse<{ message: string; payout: Payout }>(response);
  return data.payout;
}

/**
 * Resend verification email for a payout
 */
export async function resendVerification(payoutId: string): Promise<void> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.RESEND_VERIFICATION(payoutId)),
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Failed to resend verification email',
    }));
    throw error;
  }
}

/**
 * Get payout history with optional filters
 */
export async function getPayouts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}): Promise<PayoutsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);

  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.PAYOUTS)}${queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

  const response = await apiClient(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<PayoutsResponse>(response);
}

/**
 * Get a specific payout by ID
 */
export async function getPayoutById(payoutId: string): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.PAYOUT_BY_ID(payoutId)),
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<Payout>(response);
}

// ============================================================================
// Admin Payout Management API
// ============================================================================

/**
 * Get all payouts (admin only) with optional filters
 */
export async function getAdminPayouts(params?: {
  page?: number;
  limit?: number;
  user_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}): Promise<PayoutsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.user_id) queryParams.append('user_id', params.user_id);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);

  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PAYOUTS)}${queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

  const response = await apiClient(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<PayoutsResponse>(response);
}

/**
 * Get payout statistics (admin only)
 */
export async function getPayoutStats(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<PayoutStatsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);

  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PAYOUT_STATS)}${queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

  const response = await apiClient(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<PayoutStatsResponse>(response);
}

/**
 * Retry a failed payout (admin only)
 */
export async function retryPayout(payoutId: string): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_RETRY_PAYOUT(payoutId)),
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse<{ message: string; payout: Payout }>(response);
  return data.payout;
}

/**
 * Cancel a payout (admin only)
 */
export async function cancelPayout(
  payoutId: string,
  reason: string
): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_CANCEL_PAYOUT(payoutId)),
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    }
  );

  const data = await handleResponse<{ message: string; payout: Payout }>(response);
  return data.payout;
}

/**
 * Create a manual payout (admin only)
 */
export async function createManualPayout(
  formData: ManualPayoutForm
): Promise<Payout> {
  const response = await apiClient(
    getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_MANUAL_PAYOUT),
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    }
  );

  const data = await handleResponse<{ message: string; payout: Payout }>(response);
  return data.payout;
}
