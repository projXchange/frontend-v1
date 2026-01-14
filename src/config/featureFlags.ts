// Feature Flags Configuration
// Controls the operational mode of the application

export interface FeatureFlags {
  REFERRAL_ONLY_MODE: boolean;
  ENABLE_PAYMENTS: boolean;
  ENABLE_MONTHLY_DRIP: boolean;
}

// Read feature flags from environment variables
export const FEATURE_FLAGS: FeatureFlags = {
  REFERRAL_ONLY_MODE: import.meta.env.VITE_REFERRAL_ONLY_MODE === 'true',
  ENABLE_PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS !== 'false',
  ENABLE_MONTHLY_DRIP: import.meta.env.VITE_ENABLE_MONTHLY_DRIP === 'true',
};

// Computed flags for UI rendering
// IMPORTANT: Both payment and credit systems can coexist!
// Users should be able to use credits if they have them, OR pay if they don't
export const SHOW_PAYMENT_UI = FEATURE_FLAGS.ENABLE_PAYMENTS;
export const SHOW_CREDIT_UI = true; // Always show credit UI - let the component decide based on credits available

// Debug logging for feature flag state
console.log('[Feature Flags]', {
  REFERRAL_ONLY_MODE: FEATURE_FLAGS.REFERRAL_ONLY_MODE,
  ENABLE_PAYMENTS: FEATURE_FLAGS.ENABLE_PAYMENTS,
  ENABLE_MONTHLY_DRIP: FEATURE_FLAGS.ENABLE_MONTHLY_DRIP,
  SHOW_PAYMENT_UI,
  SHOW_CREDIT_UI,
});
