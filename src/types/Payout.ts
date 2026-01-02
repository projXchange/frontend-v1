// Payment Method Types
export type PaymentMethodType = 'upi' | 'bank_account';
export type AccountType = 'savings' | 'current';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: PaymentMethodType;
  
  // UPI fields
  upi_id?: string;
  
  // Bank account fields
  account_holder_name?: string;
  account_number?: string;
  account_number_last4?: string; // For display only
  ifsc_code?: string;
  account_type?: AccountType;
  bank_name?: string;
  
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Payout Types
export type PayoutStatus = 
  | 'pending_verification'
  | 'verified'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired';

export interface Payout {
  id: string;
  payout_id: string; // Unique identifier like PO_1234567890_abc
  user_id: string;
  amount: string;
  currency: string;
  payout_fee: string;
  net_amount: string;
  status: PayoutStatus;
  
  payment_method_id: string;
  payment_method?: PaymentMethod;
  
  verification_token?: string;
  verification_expiry?: string;
  verified_at?: string;
  
  requested_at: string;
  processed_at?: string;
  completed_at?: string;
  failed_at?: string;
  
  utr_number?: string;
  failure_reason?: string;
  retry_count: number;
  notes?: string;
  
  created_by: string;
  updated_at: string;
}

// Balance Types
export interface Balance {
  total_earnings: string;
  total_payouts: string;
  pending_payouts: string;
  available_balance: string;
  last_payout_at?: string;
}

// Settings Types
export interface PayoutSettings {
  auto_payout_enabled: boolean;
  minimum_payout_amount: string;
}

// API Response Types
export interface PaymentMethodsResponse {
  payment_methods: PaymentMethod[];
}

export interface BalanceResponse {
  balance: Balance;
  settings: PayoutSettings;
}

export interface PayoutsResponse {
  payouts: Payout[];
  pagination: {
    page: number;
    limit: number;
    has_more: boolean;
    total_returned: number;
  };
}

export interface PayoutStatsResponse {
  overview: {
    total_payout_volume: string;
    total_payout_count: number;
    completed_volume: string;
    completed_count: number;
    failed_count: number;
    pending_count: number;
    pending_amount: string;
    success_rate: string;
  };
  by_status: Record<PayoutStatus, {
    count: number;
    total_amount: string;
  }>;
}

// Form Types
export interface AddPaymentMethodForm {
  method_type: PaymentMethodType;
  upi_id?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_type?: AccountType;
  bank_name?: string;
}

export interface RequestPayoutForm {
  amount: number;
  payment_method_id?: string;
  notes?: string;
}

export interface UpdateSettingsForm {
  auto_payout_enabled: boolean;
  minimum_payout_amount: number;
}

export interface ManualPayoutForm {
  user_id: string;
  amount: number;
  payment_method_id?: string;
  notes: string;
}
