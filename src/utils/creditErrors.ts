/**
 * Credit Error Utility
 * Maps error codes and types to user-friendly error messages
 * Requirements: 20.1, 20.3, 20.5
 */

export enum CreditErrorCode {
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  PRICE_LIMIT_EXCEEDED = 'PRICE_LIMIT_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  BALANCE_FETCH_FAILED = 'BALANCE_FETCH_FAILED',
  REFERRAL_FETCH_FAILED = 'REFERRAL_FETCH_FAILED',
  TRACKING_FAILED = 'TRACKING_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface CreditError {
  code: CreditErrorCode;
  message: string;
  userMessage: string;
  retryable: boolean;
}

/**
 * Maps error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<CreditErrorCode, { message: string; retryable: boolean }> = {
  [CreditErrorCode.INSUFFICIENT_CREDITS]: {
    message: "You don't have enough credits to download this project. Invite friends to earn more credits!",
    retryable: false,
  },
  [CreditErrorCode.PRICE_LIMIT_EXCEEDED]: {
    message: 'This project exceeds the ₹2000 free download limit. Please purchase it to download.',
    retryable: false,
  },
  [CreditErrorCode.NETWORK_ERROR]: {
    message: 'Network connection issue. Please check your internet connection and try again.',
    retryable: true,
  },
  [CreditErrorCode.API_ERROR]: {
    message: 'Something went wrong on our end. Please try again in a moment.',
    retryable: true,
  },
  [CreditErrorCode.UNAUTHORIZED]: {
    message: 'Your session has expired. Please log in again.',
    retryable: false,
  },
  [CreditErrorCode.PROJECT_NOT_FOUND]: {
    message: 'This project could not be found. It may have been removed.',
    retryable: false,
  },
  [CreditErrorCode.DOWNLOAD_FAILED]: {
    message: 'Failed to download the project. Please try again.',
    retryable: true,
  },
  [CreditErrorCode.BALANCE_FETCH_FAILED]: {
    message: 'Unable to load your credit balance. Please refresh the page.',
    retryable: true,
  },
  [CreditErrorCode.REFERRAL_FETCH_FAILED]: {
    message: 'Unable to load your referral status. Please try again.',
    retryable: true,
  },
  [CreditErrorCode.TRACKING_FAILED]: {
    message: 'Failed to track project view. This will not affect your experience.',
    retryable: false,
  },
  [CreditErrorCode.UNKNOWN_ERROR]: {
    message: 'An unexpected error occurred. Please try again.',
    retryable: true,
  },
};

/**
 * Parses an error and returns a structured CreditError object
 */
export function parseCreditError(error: unknown): CreditError {
  // Handle Error objects
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check for insufficient credits
    if (errorMessage.includes('insufficient') || errorMessage.includes('not enough credits')) {
      return {
        code: CreditErrorCode.INSUFFICIENT_CREDITS,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.INSUFFICIENT_CREDITS].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.INSUFFICIENT_CREDITS].retryable,
      };
    }

    // Check for price limit exceeded
    if (errorMessage.includes('price limit') || errorMessage.includes('exceeds') || errorMessage.includes('2000')) {
      return {
        code: CreditErrorCode.PRICE_LIMIT_EXCEEDED,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.PRICE_LIMIT_EXCEEDED].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.PRICE_LIMIT_EXCEEDED].retryable,
      };
    }

    // Check for network errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout')
    ) {
      return {
        code: CreditErrorCode.NETWORK_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.NETWORK_ERROR].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.NETWORK_ERROR].retryable,
      };
    }

    // Check for unauthorized
    if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      return {
        code: CreditErrorCode.UNAUTHORIZED,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.UNAUTHORIZED].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.UNAUTHORIZED].retryable,
      };
    }

    // Check for not found
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return {
        code: CreditErrorCode.PROJECT_NOT_FOUND,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.PROJECT_NOT_FOUND].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.PROJECT_NOT_FOUND].retryable,
      };
    }

    // Check for download failures
    if (errorMessage.includes('download')) {
      return {
        code: CreditErrorCode.DOWNLOAD_FAILED,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.DOWNLOAD_FAILED].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.DOWNLOAD_FAILED].retryable,
      };
    }

    // Check for balance fetch failures
    if (errorMessage.includes('balance')) {
      return {
        code: CreditErrorCode.BALANCE_FETCH_FAILED,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.BALANCE_FETCH_FAILED].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.BALANCE_FETCH_FAILED].retryable,
      };
    }

    // Check for referral fetch failures
    if (errorMessage.includes('referral')) {
      return {
        code: CreditErrorCode.REFERRAL_FETCH_FAILED,
        message: error.message,
        userMessage: ERROR_MESSAGES[CreditErrorCode.REFERRAL_FETCH_FAILED].message,
        retryable: ERROR_MESSAGES[CreditErrorCode.REFERRAL_FETCH_FAILED].retryable,
      };
    }

    // Default to API error for other Error objects
    return {
      code: CreditErrorCode.API_ERROR,
      message: error.message,
      userMessage: ERROR_MESSAGES[CreditErrorCode.API_ERROR].message,
      retryable: ERROR_MESSAGES[CreditErrorCode.API_ERROR].retryable,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: CreditErrorCode.UNKNOWN_ERROR,
      message: error,
      userMessage: ERROR_MESSAGES[CreditErrorCode.UNKNOWN_ERROR].message,
      retryable: ERROR_MESSAGES[CreditErrorCode.UNKNOWN_ERROR].retryable,
    };
  }

  // Handle unknown error types
  return {
    code: CreditErrorCode.UNKNOWN_ERROR,
    message: 'An unknown error occurred',
    userMessage: ERROR_MESSAGES[CreditErrorCode.UNKNOWN_ERROR].message,
    retryable: ERROR_MESSAGES[CreditErrorCode.UNKNOWN_ERROR].retryable,
  };
}

/**
 * Gets a user-friendly error message for a given error code
 */
export function getUserMessage(code: CreditErrorCode): string {
  return ERROR_MESSAGES[code]?.message || ERROR_MESSAGES[CreditErrorCode.UNKNOWN_ERROR].message;
}

/**
 * Checks if an error is retryable
 */
export function isRetryable(error: CreditError): boolean {
  return error.retryable;
}
