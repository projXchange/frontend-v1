// Order types for Razorpay integration

export interface OrderItem {
  project_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  currency?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order_id: string;
  status: string;
}

export interface PaymentFailedRequest {
  razorpay_order_id: string;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_step?: string;
  error_reason?: string;
}

export type OrderStatus = 
  | 'created' 
  | 'payment_pending_confirmation' 
  | 'confirmed' 
  | 'payment_failed' 
  | 'failed' 
  | 'fulfilled';
