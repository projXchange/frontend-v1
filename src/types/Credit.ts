// Credit System Type Definitions for Referral-Only Access Mode

/**
 * Response from GET /credits/balance endpoint
 * Contains comprehensive credit balance information across all credit types
 */
export interface CreditBalanceResponse {
  success: boolean;
  data: {
    user_id: string;
    download_credits: number;
    lifetime_monthly_credits: number;
    lifetime_referral_credits: number;
    total_available_credits: number;
    // Additional structured data from backend
    monthly_credits: {
      used: number;
      max: number;
      remaining: number;
      display: string;
      can_receive_more: boolean;
    };
    referral_credits: {
      used: number;
      max: number;
      remaining: number;
      display: string;
      can_receive_more: boolean;
    };
    monthly_referrals: {
      current: number;
      remaining: number;
    };
  };
}

/**
 * Normalized credit balance for internal use
 * Combines all credit types and provides computed values
 */
export interface CreditBalance {
  user_id: string;
  download_credits: number;
  lifetime_monthly_credits: number;
  lifetime_referral_credits: number;
  total_available_credits: number;
  // Computed values for UI
  available_credits: number; // Alias for total_available_credits
  credits_used: number; // Computed from lifetime limits
  signup_bonus_received: boolean; // Computed from download_credits > 0
  monthly_credits_received: number; // Alias for lifetime_monthly_credits
  referral_credits_earned: number; // Alias for lifetime_referral_credits
  max_monthly_credits: 3;
  max_referral_credits: 6;
  max_total_credits: 10; // 1 signup + 3 monthly + 6 referral

  // Additional context from new API structure
  monthly_credits?: {
    used: number;
    max: number;
    remaining: number;
    display: string;
    can_receive_more: boolean;
  };
  referral_credits?: {
    used: number;
    max: number;
    remaining: number;
    display: string;
    can_receive_more: boolean;
  };
}

export interface CreditDownloadRequest {
  project_id: string;
}

export interface CreditDownloadResponse {
  success: boolean;
  download_url: string;
  remaining_credits: number;
  message: string;
}
