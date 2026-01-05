/**
 * Error message mapping utility for referral system
 * Maps backend error codes and messages to user-friendly text
 */

export interface ReferralError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
}

/**
 * Error codes for referral system
 */
export const ReferralErrorCodes = {
  MONTHLY_LIMIT_REACHED: 'MONTHLY_LIMIT_REACHED',
  LIFETIME_LIMIT_REACHED: 'LIFETIME_LIMIT_REACHED',
  INVALID_REFERRAL_CODE: 'INVALID_REFERRAL_CODE',
  REFERRAL_CODE_NOT_FOUND: 'REFERRAL_CODE_NOT_FOUND',
  REFERRAL_CODE_EXPIRED: 'REFERRAL_CODE_EXPIRED',
  SELF_REFERRAL_NOT_ALLOWED: 'SELF_REFERRAL_NOT_ALLOWED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * User-friendly error messages mapped to error codes
 */
const ERROR_MESSAGES: Record<string, { message: string; retryable: boolean }> = {
  [ReferralErrorCodes.MONTHLY_LIMIT_REACHED]: {
    message: 'You have reached your monthly referral limit (3/3). Your limit will reset next month.',
    retryable: false,
  },
  [ReferralErrorCodes.LIFETIME_LIMIT_REACHED]: {
    message: 'You have reached the maximum lifetime referral credits (6/6). You can no longer earn credits from referrals.',
    retryable: false,
  },
  [ReferralErrorCodes.INVALID_REFERRAL_CODE]: {
    message: 'Invalid referral code format. Referral codes must be 8 alphanumeric characters (e.g., ABC12345).',
    retryable: false,
  },
  [ReferralErrorCodes.REFERRAL_CODE_NOT_FOUND]: {
    message: 'This referral code does not exist or has been deactivated. Please check the code and try again.',
    retryable: false,
  },
  [ReferralErrorCodes.REFERRAL_CODE_EXPIRED]: {
    message: 'This referral code has expired and can no longer be used.',
    retryable: false,
  },
  [ReferralErrorCodes.SELF_REFERRAL_NOT_ALLOWED]: {
    message: 'You cannot use your own referral code. Please use a code from another user.',
    retryable: false,
  },
  [ReferralErrorCodes.NETWORK_ERROR]: {
    message: 'Network error. Please check your internet connection and try again.',
    retryable: true,
  },
  [ReferralErrorCodes.AUTHENTICATION_ERROR]: {
    message: 'Your session has expired. Please log in again to continue.',
    retryable: false,
  },
  [ReferralErrorCodes.RATE_LIMIT_ERROR]: {
    message: 'Too many requests. Please wait a moment and try again.',
    retryable: true,
  },
  [ReferralErrorCodes.SERVER_ERROR]: {
    message: 'Server error. Please try again later.',
    retryable: true,
  },
  [ReferralErrorCodes.INSUFFICIENT_CREDITS]: {
    message: 'You do not have enough credits to download this project. Earn more credits by referring friends!',
    retryable: false,
  },
  [ReferralErrorCodes.UNKNOWN_ERROR]: {
    message: 'An unexpected error occurred. Please try again.',
    retryable: true,
  },
};

/**
 * Maps backend error responses to user-friendly error objects
 */
export function mapReferralError(error: unknown): ReferralError {
  // Handle Error objects
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check for specific error patterns in message
    if (errorMessage.includes('monthly') && errorMessage.includes('limit')) {
      return {
        code: ReferralErrorCodes.MONTHLY_LIMIT_REACHED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.MONTHLY_LIMIT_REACHED].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.MONTHLY_LIMIT_REACHED].retryable,
      };
    }

    if (errorMessage.includes('lifetime') && errorMessage.includes('limit')) {
      return {
        code: ReferralErrorCodes.LIFETIME_LIMIT_REACHED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.LIFETIME_LIMIT_REACHED].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.LIFETIME_LIMIT_REACHED].retryable,
      };
    }

    if (errorMessage.includes('invalid') && errorMessage.includes('referral')) {
      return {
        code: ReferralErrorCodes.INVALID_REFERRAL_CODE,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.INVALID_REFERRAL_CODE].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.INVALID_REFERRAL_CODE].retryable,
      };
    }

    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
      return {
        code: ReferralErrorCodes.REFERRAL_CODE_NOT_FOUND,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.REFERRAL_CODE_NOT_FOUND].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.REFERRAL_CODE_NOT_FOUND].retryable,
      };
    }

    if (errorMessage.includes('expired')) {
      return {
        code: ReferralErrorCodes.REFERRAL_CODE_EXPIRED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.REFERRAL_CODE_EXPIRED].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.REFERRAL_CODE_EXPIRED].retryable,
      };
    }

    if (errorMessage.includes('self') || errorMessage.includes('own')) {
      return {
        code: ReferralErrorCodes.SELF_REFERRAL_NOT_ALLOWED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.SELF_REFERRAL_NOT_ALLOWED].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.SELF_REFERRAL_NOT_ALLOWED].retryable,
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return {
        code: ReferralErrorCodes.NETWORK_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.NETWORK_ERROR].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.NETWORK_ERROR].retryable,
      };
    }

    if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
      return {
        code: ReferralErrorCodes.AUTHENTICATION_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.AUTHENTICATION_ERROR].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.AUTHENTICATION_ERROR].retryable,
      };
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return {
        code: ReferralErrorCodes.RATE_LIMIT_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.RATE_LIMIT_ERROR].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.RATE_LIMIT_ERROR].retryable,
      };
    }

    if (errorMessage.includes('server') || errorMessage.includes('500') || errorMessage.includes('503')) {
      return {
        code: ReferralErrorCodes.SERVER_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.SERVER_ERROR].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.SERVER_ERROR].retryable,
      };
    }

    if (errorMessage.includes('insufficient') || errorMessage.includes('not enough')) {
      return {
        code: ReferralErrorCodes.INSUFFICIENT_CREDITS,
        message: error.message,
        userMessage: ERROR_MESSAGES[ReferralErrorCodes.INSUFFICIENT_CREDITS].message,
        retryable: ERROR_MESSAGES[ReferralErrorCodes.INSUFFICIENT_CREDITS].retryable,
      };
    }
  }

  // Handle response objects with error codes
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;

    if (errorObj.code && ERROR_MESSAGES[errorObj.code]) {
      return {
        code: errorObj.code,
        message: errorObj.message || errorObj.error || 'Unknown error',
        userMessage: ERROR_MESSAGES[errorObj.code].message,
        retryable: ERROR_MESSAGES[errorObj.code].retryable,
      };
    }

    if (errorObj.error) {
      return mapReferralError(new Error(errorObj.error));
    }

    if (errorObj.message) {
      return mapReferralError(new Error(errorObj.message));
    }
  }

  // Default unknown error
  return {
    code: ReferralErrorCodes.UNKNOWN_ERROR,
    message: String(error),
    userMessage: ERROR_MESSAGES[ReferralErrorCodes.UNKNOWN_ERROR].message,
    retryable: ERROR_MESSAGES[ReferralErrorCodes.UNKNOWN_ERROR].retryable,
  };
}

/**
 * Gets a user-friendly error message for a given error code
 */
export function getUserMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode]?.message || ERROR_MESSAGES[ReferralErrorCodes.UNKNOWN_ERROR].message;
}

/**
 * Checks if an error is retryable
 */
export function isRetryableError(errorCode: string): boolean {
  return ERROR_MESSAGES[errorCode]?.retryable ?? true;
}

/**
 * Formats error for display with optional retry action
 */
export function formatErrorForDisplay(error: ReferralError): {
  message: string;
  showRetry: boolean;
} {
  return {
    message: error.userMessage,
    showRetry: error.retryable,
  };
}
