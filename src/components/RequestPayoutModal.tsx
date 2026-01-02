import React, { useState, useEffect } from 'react';
import { X, Wallet, AlertCircle, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import ButtonSpinner from './ButtonSpinner';
import { requestPayout } from '../services/payoutService';
import { validatePayoutAmount } from '../utils/payoutValidation';
import type { Payout, PaymentMethod, RequestPayoutForm } from '../types/Payout';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  paymentMethods: PaymentMethod[];
  onSuccess: (payout: Payout) => void;
  minimumAmount?: number;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  paymentMethods,
  onSuccess,
  minimumAmount = 100,
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Get primary payment method
  const primaryPaymentMethod = paymentMethods.find(pm => pm.is_primary);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setAmount('');
    setPaymentMethodId(primaryPaymentMethod?.id || '');
    setNotes('');
    setErrorMsg('');
    setAmountError('');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Clear previous errors
    setAmountError('');
    setErrorMsg('');

    // Validate amount (Requirements: 4.1, 4.6)
    const amountNum = parseFloat(amount);
    const validation = validatePayoutAmount(amountNum, availableBalance, minimumAmount);
    
    if (!validation.valid) {
      setAmountError(validation.error || 'Invalid amount');
      isValid = false;
    }

    // Check if payment method is selected or available
    if (!paymentMethodId && !primaryPaymentMethod) {
      setErrorMsg('Please add a payment method before requesting a payout');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const formData: RequestPayoutForm = {
        amount: parseFloat(amount),
        notes: notes.trim() || undefined,
      };

      // Add payment method ID if specified (Requirements: 4.2)
      if (paymentMethodId) {
        formData.payment_method_id = paymentMethodId;
      }

      const newPayout = await requestPayout(formData);
      onSuccess(newPayout);
      toast.success('Payout requested successfully! Check your email for verification.');
      handleClose();
    } catch (error: any) {
      const errorMessage = error.error || error.message || 'Failed to request payout';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setAmountError('');
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getPaymentMethodDisplay = (pm: PaymentMethod): string => {
    if (pm.method_type === 'upi') {
      return `UPI: ${pm.upi_id}`;
    }
    return `Bank: ****${pm.account_number_last4 || '****'}`;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4 transition-opacity duration-300 ease-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative transform transition-all duration-300 ease-in-out ${
          isClosing ? 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0' : 'translate-y-0 sm:scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          {/* Mobile drag indicator */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Request Payout
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable on mobile */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-none">
          {/* Available Balance Display */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available Balance
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(availableBalance)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum payout: {formatCurrency(minimumAmount)}
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Payout Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                ₹
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                  amountError
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-slate-700'
                }`}
              />
            </div>
            {amountError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{amountError}</p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            {paymentMethods.length === 0 ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  No payment methods available. Please add a payment method first.
                </p>
              </div>
            ) : (
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                {primaryPaymentMethod && (
                  <option value={primaryPaymentMethod.id}>
                    {getPaymentMethodDisplay(primaryPaymentMethod)} (Primary)
                  </option>
                )}
                {paymentMethods
                  .filter(pm => !pm.is_primary)
                  .map(pm => (
                    <option key={pm.id} value={pm.id}>
                      {getPaymentMethodDisplay(pm)}
                    </option>
                  ))}
              </select>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {primaryPaymentMethod
                ? 'Primary payment method will be used if not specified'
                : 'Please add a payment method to continue'}
            </p>
          </div>

          {/* Notes Field (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this payout..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
            />
          </div>

          {/* Verification Email Warning */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Email Verification Required
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  A verification link will be sent to your email. You must verify the payout
                  within 30 minutes to complete the request.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-300 font-medium">
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Ensure min 44px height for mobile tappability */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 min-h-[44px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || paymentMethods.length === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-transform"
            >
              {loading && <ButtonSpinner size="sm" />}
              {loading ? 'Requesting...' : 'Request Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPayoutModal;
