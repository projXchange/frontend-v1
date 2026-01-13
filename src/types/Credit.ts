// Credit System Type Definitions for Referral-Only Access Mode

export interface CreditBalance {
  available_credits: number;
  credits_used: number;
  signup_bonus_received: boolean;
  monthly_credits_received: number;
  referral_credits_earned: number;
  max_monthly_credits: 3;
  max_referral_credits: 6;
  max_total_credits: 9;
  next_monthly_credit_date: string | null;
  days_until_next_credit: number | null;
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
