import React, { createContext, useContext, ReactNode } from 'react';
import { FEATURE_FLAGS, SHOW_PAYMENT_UI, SHOW_CREDIT_UI } from '../config/featureFlags';

interface FeatureFlagContextType {
  flags: typeof FEATURE_FLAGS;
  showPaymentUI: boolean;
  showCreditUI: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: FeatureFlagContextType = {
    flags: FEATURE_FLAGS,
    showPaymentUI: SHOW_PAYMENT_UI,
    showCreditUI: SHOW_CREDIT_UI,
  };

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
};
