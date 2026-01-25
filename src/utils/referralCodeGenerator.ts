/**
 * Referral Code Generation Utility - Frontend Only
 * 
 * Generates unique referral codes on the frontend using:
 * - User ID (unique database identifier)
 * - Username (normalized)
 * - Registration timestamp (millisecond precision)
 * - Random component (cryptographically secure)
 * 
 * The code is generated ONCE and stored in localStorage.
 */

/**
 * Generate a unique referral code based on user data
 * @param userId - User's unique database ID
 * @param username - User's username or email
 * @param registrationDate - User's registration date
 * @returns 8-character alphanumeric referral code
 */
export function generateReferralCode(
  userId: string,
  username: string,
  registrationDate: Date | string
): string {
  // Normalize username (remove special chars, lowercase)
  const normalizedUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);

  // Get timestamp in milliseconds for precision
  const timestamp = typeof registrationDate === 'string'
    ? new Date(registrationDate).getTime()
    : registrationDate.getTime();

  // Generate cryptographically secure random component (4 bytes)
  const randomBytes = crypto.getRandomValues(new Uint8Array(4));
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Combine all unique factors
  const combinedData = `${userId}-${normalizedUsername}-${timestamp}-${randomHex}`;

  // Generate hash using multiple passes for better distribution
  const hash1 = simpleHash(combinedData);
  const hash2 = simpleHash(combinedData.split('').reverse().join(''));
  const combinedHash = hash1 ^ hash2; // XOR for better mixing

  // Convert to base36 (0-9, a-z) and take 8 characters
  let code = Math.abs(combinedHash).toString(36).toUpperCase();

  // Ensure exactly 8 characters
  if (code.length < 8) {
    // Pad with additional hash if needed
    const paddingHash = simpleHash(`${combinedData}-padding`);
    const padding = Math.abs(paddingHash).toString(36).toUpperCase();
    code = (code + padding).substring(0, 8);
  } else {
    code = code.substring(0, 8);
  }

  return code;
}

/**
 * Simple hash function for string data
 * Uses djb2 algorithm with additional mixing
 */
function simpleHash(str: string): number {
  let hash = 5381; // djb2 initial value

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // hash * 33 + char
    hash = ((hash << 5) + hash) + char;
  }

  // Additional mixing for better distribution
  hash = hash ^ (hash >>> 16);

  return hash;
}

/**
 * Store referral code in localStorage
 * @param code - The referral code to store
 */
export function storeReferralCode(code: string): void {
  try {
    localStorage.setItem('user_referral_code', code);
  } catch (error) {
    console.error('Failed to store referral code:', error);
  }
}

/**
 * Get referral code from localStorage
 * @returns The stored referral code or null
 */
export function getStoredReferralCode(): string | null {
  try {
    return localStorage.getItem('user_referral_code');
  } catch (error) {
    console.error('Failed to get stored referral code:', error);
    return null;
  }
}

/**
 * Generate and store referral code if not already exists
 * This ensures the code is generated only ONCE per user
 * 
 * @param userId - User's unique database ID
 * @param username - User's username or email
 * @param registrationDate - User's registration date
 * @returns The referral code (existing or newly generated)
 */
export function ensureReferralCode(
  userId: string,
  username: string,
  registrationDate: Date | string
): string {
  // Check if code already exists in localStorage
  const existingCode = getStoredReferralCode();
  if (existingCode && isValidReferralCodeFormat(existingCode)) {
    return existingCode;
  }

  // Generate new code (only happens once per user)
  const newCode = generateReferralCode(userId, username, registrationDate);

  // Store it for future use
  storeReferralCode(newCode);

  return newCode;
}

/**
 * Validate referral code format
 * @param code - Code to validate
 * @returns true if code matches expected format
 */
export function isValidReferralCodeFormat(code: string): boolean {
  // Must be exactly 8 characters, alphanumeric, uppercase
  const pattern = /^[A-Z0-9]{8}$/;
  return pattern.test(code);
}

/**
 * Format referral code for display (adds hyphen for readability)
 * @param code - Raw code
 * @returns Formatted code (e.g., "ABCD-1234")
 */
export function formatReferralCode(code: string): string {
  if (code.length !== 8) return code;
  return `${code.substring(0, 4)}-${code.substring(4)}`;
}

/**
 * Clear stored referral code (useful for testing or logout)
 */
export function clearStoredReferralCode(): void {
  try {
    localStorage.removeItem('user_referral_code');
  } catch (error) {
    console.error('Failed to clear referral code:', error);
  }
}
