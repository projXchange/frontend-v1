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
    
    // Payment Methods
    PAYMENT_METHODS: '/api/payment-methods',
    PAYMENT_METHOD_BY_ID: (id: string) => `/api/payment-methods/${id}`,
    SET_PRIMARY_PAYMENT: (id: string) => `/api/payment-methods/${id}/set-primary`,
    
    // Payouts
    PAYOUT_BALANCE: '/api/payouts/balance',
    PAYOUT_SETTINGS: '/api/payouts/settings',
    REQUEST_PAYOUT: '/api/payouts/request',
    VERIFY_PAYOUT: (token: string) => `/api/payouts/verify/${token}`,
    RESEND_VERIFICATION: (id: string) => `/api/payouts/${id}/resend-verification`,
    PAYOUTS: '/api/payouts',
    PAYOUT_BY_ID: (id: string) => `/api/payouts/${id}`,
    
    // Admin Payouts
    ADMIN_PAYOUTS: '/api/admin/payouts',
    ADMIN_PAYOUT_STATS: '/api/admin/payouts/stats',
    ADMIN_RETRY_PAYOUT: (id: string) => `/api/admin/payouts/${id}/retry`,
    ADMIN_CANCEL_PAYOUT: (id: string) => `/api/admin/payouts/${id}/cancel`,
    ADMIN_MANUAL_PAYOUT: '/api/admin/payouts/manual',
    
    // Field Permissions
    PROJECT_PERMISSIONS: (id: string) => `/projects/${id}/permissions`,
    UPDATE_PROJECT_FIELDS: (id: string) => `/projects/${id}`,
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
