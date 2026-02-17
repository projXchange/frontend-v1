// Enquiries Service - API client for project enquiry operations

import { apiClient } from '../utils/apiClient';
import { API_CONFIG, getApiUrl } from '../config/api';
import type {
  Enquiry,
  CreateEnquiryRequest,
  EnquiryResponse,
  EnquiriesListResponse,
} from '../types/Enquiry';

/**
 * Get authentication headers with JWT token
 * @returns Headers object with Authorization token if available
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    throw new Error(error.error || error.message || 'Request failed');
  }
  return response.json();
}

/**
 * Create a new project enquiry
 * @param data - Enquiry form data
 * @returns Promise resolving to the created Enquiry object
 * @throws Error if creation fails or user is not authenticated
 */
export async function createEnquiry(data: CreateEnquiryRequest): Promise<Enquiry> {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<EnquiryResponse>(response);
  return result.data;
}

/**
 * Get all enquiries for the authenticated user
 * @returns Promise resolving to array of user's enquiries
 * @throws Error if request fails or user is not authenticated
 */
export async function getUserEnquiries(): Promise<Enquiry[]> {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRIES), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<EnquiriesListResponse>(response);
  return result.data;
}

/**
 * Get a specific enquiry by ID
 * @param id - The enquiry ID
 * @returns Promise resolving to the Enquiry object
 * @throws Error if enquiry not found, user doesn't own it, or not authenticated
 */
export async function getEnquiryById(id: string): Promise<Enquiry> {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.ENQUIRY_BY_ID(id)), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<EnquiryResponse>(response);
  return result.data;
}
