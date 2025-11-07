// API Configuration

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://projxchange-backend-v1.vercel.app',
  ENDPOINTS: {
    // Orders
    CREATE_ORDER: '/orders/create',
    VERIFY_PAYMENT: '/orders/verify-payment',
    PAYMENT_FAILED: '/orders/payment-failed',
    
    // Cart
    CART: '/cart',
    
    // Projects
    PROJECTS: '/projects',
    
    // Transactions
    TRANSACTIONS: '/transactions',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
