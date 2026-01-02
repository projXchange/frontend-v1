import { PayoutStatus } from '../types/Payout';

// ============================================================================
// Task 19.1: Formatting Helpers
// ============================================================================

/**
 * Format a number as Indian Rupee currency (₹X,XXX.XX)
 * @param amount - The amount to format (can be string or number)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - The date to format (ISO string or Date object)
 * @returns Relative time string
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
  }
};

/**
 * Format a date as absolute date and time
 * @param date - The date to format (ISO string or Date object)
 * @returns Formatted date string (e.g., "Dec 28, 2025, 10:30 AM")
 */
export const formatAbsoluteDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

/**
 * Mask account number to show only last 4 digits
 * @param accountNumber - The full account number
 * @returns Masked account number (e.g., "****1234")
 */
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) {
    return '****';
  }
  
  const last4 = accountNumber.slice(-4);
  return `****${last4}`;
};

// ============================================================================
// Task 19.2: Status Mapping Utilities
// ============================================================================

/**
 * Map payout status to Tailwind CSS color classes
 * @param status - The payout status
 * @returns Object with background and text color classes
 */
export const getStatusColors = (status: PayoutStatus): { bg: string; text: string; border: string } => {
  const colorMap: Record<PayoutStatus, { bg: string; text: string; border: string }> = {
    pending_verification: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    verified: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    processing: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
    cancelled: {
      bg: 'bg-gray-100 dark:bg-gray-900/20',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    expired: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
    },
  };

  return colorMap[status] || colorMap.cancelled;
};

/**
 * Map payout status to icon name (Lucide React icons)
 * @param status - The payout status
 * @returns Icon name as string
 */
export const getStatusIcon = (status: PayoutStatus): string => {
  const iconMap: Record<PayoutStatus, string> = {
    pending_verification: 'Clock',
    verified: 'CheckCircle',
    processing: 'Loader',
    completed: 'CheckCircle2',
    failed: 'XCircle',
    cancelled: 'Ban',
    expired: 'AlertCircle',
  };

  return iconMap[status] || 'HelpCircle';
};

/**
 * Map payout status to human-readable display text
 * @param status - The payout status
 * @returns Display text for the status
 */
export const getStatusDisplayText = (status: PayoutStatus): string => {
  const textMap: Record<PayoutStatus, string> = {
    pending_verification: 'Pending Verification',
    verified: 'Verified',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    expired: 'Expired',
  };

  return textMap[status] || 'Unknown';
};
