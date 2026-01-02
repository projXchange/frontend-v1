// Validation utilities for payout operations

/**
 * Validates UPI ID format
 * UPI ID format: username@provider (e.g., user@paytm, user.name@bank)
 * Requirements: 1.1
 */
export const validateUpiId = (upiId: string): boolean => {
  if (!upiId || typeof upiId !== 'string') {
    return false;
  }
  
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(upiId.trim());
};

/**
 * Validates IFSC code format
 * IFSC format: 4 letters + 0 + 6 alphanumeric characters (e.g., SBIN0001234)
 * Requirements: 1.2
 */
export const validateIfscCode = (ifsc: string): boolean => {
  if (!ifsc || typeof ifsc !== 'string') {
    return false;
  }
  
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.trim().toUpperCase());
};

/**
 * Validates bank account number format
 * Account number should be 9-18 digits
 * Requirements: 1.2
 */
export const validateAccountNumber = (accountNumber: string): boolean => {
  if (!accountNumber || typeof accountNumber !== 'string') {
    return false;
  }
  
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(accountNumber.trim());
};

/**
 * Validates payout amount against available balance and minimum amount
 * Requirements: 4.1, 4.6
 */
export const validatePayoutAmount = (
  amount: number,
  availableBalance: number,
  minimumAmount: number = 100
): { valid: boolean; error?: string } => {
  // Check if amount is a valid number
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Please enter a valid amount'
    };
  }

  // Check minimum amount (Requirements: 3.2, 4.6)
  if (amount < minimumAmount) {
    return {
      valid: false,
      error: `Payout amount must be at least ₹${minimumAmount}`
    };
  }

  // Check available balance (Requirements: 4.1, 4.6)
  if (amount > availableBalance) {
    return {
      valid: false,
      error: `Insufficient balance. Available: ₹${availableBalance.toFixed(2)}`
    };
  }

  return { valid: true };
};
