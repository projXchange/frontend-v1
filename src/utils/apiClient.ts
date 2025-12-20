// API Client Utility - Centralized fetch wrapper with token expiration detection

// Flag to prevent duplicate token expiration handling
let isHandlingExpiration = false;

// Reference to the token expiration handler (will be set by AuthContext)
let tokenExpirationHandler: (() => void) | null = null;

/**
 * Register the token expiration handler from AuthContext
 */
export const registerTokenExpirationHandler = (handler: () => void) => {
  tokenExpirationHandler = handler;
};

/**
 * Check if the error indicates token expiration
 */
function isTokenExpiredError(status: number, errorMessage: string): boolean {
  if (status !== 401) return false;

  const expiredKeywords = [
    'token expired',
    'jwt expired',
    'token invalid',
    'invalid token',
    'session expired',
    'unauthorized',
  ];

  const lowerMessage = errorMessage.toLowerCase();
  return expiredKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Check if the URL is an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/');
}

/**
 * Handle token expiration
 */
function handleTokenExpiration(): void {
  // Prevent duplicate handling
  if (isHandlingExpiration) return;

  // Check if token still exists (user might have manually logged out)
  if (!localStorage.getItem('token')) return;

  isHandlingExpiration = true;

  // Call the registered handler
  if (tokenExpirationHandler) {
    tokenExpirationHandler();
  }

  // Reset flag after a short delay
  setTimeout(() => {
    isHandlingExpiration = false;
  }, 1000);
}

/**
 * API Client - Drop-in replacement for fetch with token expiration detection
 */
export async function apiClient(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // Execute the fetch request
  const response = await fetch(url, options);

  // Skip token expiration handling for auth endpoints
  if (isAuthEndpoint(url)) {
    return response;
  }

  // Check for 401 status
  if (response.status === 401) {
    try {
      // Clone the response so we can read it without consuming the original
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();

      // Check if this is a token expiration error
      const errorMessage = data.error || data.message || '';
      if (isTokenExpiredError(response.status, errorMessage)) {
        handleTokenExpiration();
      }
    } catch (error) {
      // If we can't parse the response, just return it as-is
      console.error('Error parsing 401 response:', error);
    }
  }

  // Return the original response unchanged
  return response;
}
