// Custom hook for Razorpay checkout flow

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import {
    loadRazorpayScript,
    createOrder,
    verifyPayment,
    reportPaymentFailure,
    openRazorpayCheckout,
} from '../services/razorpayService';
import { CreateOrderRequest, RazorpayPaymentResponse } from '../types/Order';

export const useRazorpayCheckout = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuth();
    const { cart, clearCart } = useCart();

    const initiateCheckout = async () => {
        if (!user || cart.length === 0) {
            toast.error('Cart is empty or user not authenticated');
            return;
        }

        setIsProcessing(true);

        try {
            // Step 1: Load Razorpay SDK
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway. Please try again.');
                return;
            }

            // Step 2: Get token
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to continue');
                return;
            }

            // Step 3: Prepare order data
            const orderData: CreateOrderRequest = {
                items: cart.map((item) => ({
                    project_id: item.project_id,
                    quantity: 1,
                    price: item.project.pricing?.sale_price ?? 0,
                })),
                currency: 'INR',
            };

            // Step 4: Create order on backend
            toast.loading('Creating order...', { id: 'order-creation' });
            const orderResponse = await createOrder(orderData, token);
            toast.dismiss('order-creation');

            // Step 5: Open Razorpay checkout
            openRazorpayCheckout({
                key: orderResponse.key_id,
                amount: orderResponse.amount,
                currency: orderResponse.currency,
                name: 'ProjXchange',
                description: `Purchase of ${cart.length} project${cart.length > 1 ? 's' : ''}`,
                order_id: orderResponse.razorpay_order_id,
                handler: async (response: RazorpayPaymentResponse) => {
                    await handlePaymentSuccess(response, token);
                },
                prefill: {
                    name: user.full_name || '',
                    email: user.email || '',
                },
                theme: {
                    color: '#2563eb', // Blue-600
                },
                modal: {
                    ondismiss: () => {
                        toast.error('Payment cancelled');
                        setIsProcessing(false);
                    },
                },
            });
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to initiate checkout');
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = async (
        response: RazorpayPaymentResponse,
        token: string
    ) => {
        try {
            toast.loading('Verifying payment...', { id: 'payment-verification' });

            // Verify payment with backend
            const verificationResult = await verifyPayment(
                {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                },
                token
            );

            toast.dismiss('payment-verification');

            if (verificationResult.success) {
                toast.success('Payment successful! 🎉');

                // Backend now handles purchase record creation in verify-payment endpoint
                // Clear cart after successful payment
                clearCart();

                // Redirect to dashboard purchases tab
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                toast.error('Payment verification failed. Please contact support.');
            }
        } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');

            // Report failure to backend
            try {
                await reportPaymentFailure(
                    {
                        razorpay_order_id: response.razorpay_order_id,
                        error_description: error.message || 'Verification failed',
                        error_source: 'frontend',
                        error_step: 'verification',
                    },
                    token
                );
            } catch (reportError) {
                console.error('Failed to report payment failure:', reportError);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        initiateCheckout,
        isProcessing,
    };
};
