// Referral System Type Definitions

export interface ReferralCode {
  id: string;
  referral_code: string;
  is_qualified: boolean;
  created_at: string;
  qualified_at: string | null;
  referred_user: {
    name: string;
    email: string;
  } | null;
  status: 'unused' | 'pending' | 'qualified';
}

export interface ReferralStats {
  totalReferrals: number;
  qualifiedReferrals: number;
  monthlyReferrals: number;
  remainingMonthlySlots: number;
}

export interface CreditInfo {
  downloadCredits: number;
  monthlyReferrals: number;
  remainingReferralSlots: number;
  lastCreditReset: string;
  lifetimeMonthlyCredits: number;
  lifetimeReferralCredits: number;
  canReceiveMonthly: boolean;
  canReceiveReferral: boolean;
  totalFreeDownloadsUsed: number;
}

export interface ReferralDashboardData {
  credits: CreditInfo;
  referral_stats: ReferralStats;
  recent_qualified_referrals: Array<{
    id: string;
    referral_code: string;
    referred_user_name: string;
    qualified_at: string;
  }>;
  can_create_referral: boolean;
}

export interface UnlockOptions {
  current_credits: number;
  has_purchased: boolean;
  lifetime_limits: {
    monthly_credits: {
      used: number;
      max: number;
      remaining: number;
    };
    referral_credits: {
      used: number;
      max: number;
      remaining: number;
    };
  };
  unlock_options: {
    use_credits: {
      available: boolean;
      credits_available: number;
    };
    purchase: {
      available: boolean;
      message: string;
    };
    referral: {
      available: boolean;
      remaining_monthly_slots: number;
      remaining_lifetime_credits: number;
      message: string;
    };
  };
}

export interface ShareContent {
  referral_code: string;
  share_url: string;
  platform: 'whatsapp' | 'twitter' | 'email' | 'copy';
  content: {
    url?: string;
    message: string;
    subject?: string;
    body?: string;
    text?: string;
  };
}

export interface AdminReferralStats {
  period_days: number;
  stats: {
    overview: {
      total_referrals: number;
      qualified_referrals: number;
      pending_referrals: number;
      unused_referrals: number;
      conversion_rate: string;
    };
    period_stats: {
      period_days: number;
      new_referrals: number;
      new_qualifications: number;
    };
    top_referrers: Array<{
      referrerId: string;
      referrerName: string;
      referrerEmail: string;
      totalReferrals: number;
      qualifiedReferrals: number;
    }>;
    recent_activity: Array<{
      id: string;
      referralCode: string;
      referrerName: string;
      referredUserName: string;
      isQualified: boolean;
      createdAt: string;
      qualifiedAt: string | null;
    }>;
  };
  generated_at: string;
}

export interface SuspiciousReferral {
  id: string;
  referralCode: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  signupIp: string;
  isQualified: boolean;
  createdAt: string;
  qualifiedAt: string | null;
  suspiciousReasons: string[];
}
