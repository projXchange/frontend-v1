// Razorpay Service - handles all Razorpay payment operations

import {
  CreateOrderRequest,
  CreateOrderResponse,
  RazorpayPaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  PaymentFailedRequest,
} from '../types/Order';
import { API_CONFIG, getApiUrl } from '../config/api';
import { apiClient } from '../utils/apiClient';

// Razorpay script loading
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create order on backend
export const createOrder = async (
  orderData: CreateOrderRequest,
  token: string
): Promise<CreateOrderResponse> => {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.CREATE_ORDER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
};

// Verify payment on backend
export const verifyPayment = async (
  paymentData: VerifyPaymentRequest,
  token: string
): Promise<VerifyPaymentResponse> => {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Payment verification failed');
  }

  return response.json();
};

// Report payment failure
export const reportPaymentFailure = async (
  failureData: PaymentFailedRequest,
  token: string
): Promise<void> => {
  const response = await apiClient(getApiUrl(API_CONFIG.ENDPOINTS.PAYMENT_FAILED), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(failureData),
  });

  if (!response.ok) {
    console.error('Failed to report payment failure to backend');
  }
};

// Razorpay checkout options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

// Open Razorpay checkout
export const openRazorpayCheckout = (
  options: RazorpayOptions
): void => {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}
