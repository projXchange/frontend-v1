import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ButtonSpinner from './ButtonSpinner';
import { addPaymentMethod } from '../services/payoutService';
import { validateUpiId, validateIfscCode, validateAccountNumber } from '../utils/payoutValidation';
import { useModalKeyboard, useFocusTrap } from '../hooks/useKeyboardNavigation';
import type { PaymentMethod, PaymentMethodType, AccountType, AddPaymentMethodForm } from '../types/Payout';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentMethod: PaymentMethod) => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [methodType, setMethodType] = useState<PaymentMethodType>('upi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // UPI fields
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // Bank account fields
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('savings');
  const [bankName, setBankName] = useState('');
  
  // Field errors
  const [accountHolderError, setAccountHolderError] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');
  const [ifscError, setIfscError] = useState('');

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setMethodType('upi');
    setUpiId('');
    setAccountHolderName('');
    setAccountNumber('');
    setIfscCode('');
    setAccountType('savings');
    setBankName('');
    setErrorMsg('');
    setUpiError('');
    setAccountHolderError('');
    setAccountNumberError('');
    setIfscError('');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  // Use keyboard navigation hooks
  useModalKeyboard(isOpen, handleClose);
  useFocusTrap(isOpen, modalRef);

  const validateForm = (): boolean => {
    let isValid = true;

    // Clear previous errors
    setUpiError('');
    setAccountHolderError('');
    setAccountNumberError('');
    setIfscError('');
    setErrorMsg('');

    if (methodType === 'upi') {
      // Validate UPI ID (Requirements: 1.1)
      if (!upiId.trim()) {
        setUpiError('UPI ID is required');
        isValid = false;
      } else if (!validateUpiId(upiId)) {
        setUpiError('Invalid UPI ID format (e.g., user@paytm)');
        isValid = false;
      }
    } else {
      // Validate bank account fields (Requirements: 1.2)
      if (!accountHolderName.trim()) {
        setAccountHolderError('Account holder name is required');
        isValid = false;
      }

      if (!accountNumber.trim()) {
        setAccountNumberError('Account number is required');
        isValid = false;
      } else if (!validateAccountNumber(accountNumber)) {
        setAccountNumberError('Invalid account number (9-18 digits)');
        isValid = false;
      }

      if (!ifscCode.trim()) {
        setIfscError('IFSC code is required');
        isValid = false;
      } else if (!validateIfscCode(ifscCode)) {
        setIfscError('Invalid IFSC code format (e.g., SBIN0001234)');
        isValid = false;
      }
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
      const formData: AddPaymentMethodForm = {
        method_type: methodType,
      };

      if (methodType === 'upi') {
        formData.upi_id = upiId.trim();
      } else {
        formData.account_holder_name = accountHolderName.trim();
        formData.account_number = accountNumber.trim();
        formData.ifsc_code = ifscCode.trim().toUpperCase();
        formData.account_type = accountType;
        if (bankName.trim()) {
          formData.bank_name = bankName.trim();
        }
      }

      const newPaymentMethod = await addPaymentMethod(formData);
      onSuccess(newPaymentMethod);
      toast.success('Payment method added successfully');
      handleClose();
    } catch (error: any) {
      const errorMessage = error.error || error.message || 'Failed to add payment method';
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
        ref={modalRef}
        className={`bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative transform transition-all duration-300 ease-in-out ${
          isClosing ? 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0' : 'translate-y-0 sm:scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-payment-modal-title"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          {/* Mobile drag indicator */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <h2 id="add-payment-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-2 sm:mt-0">
            Add Payment Method
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form - Scrollable on mobile */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-none">
          {/* Payment Method Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Payment Method Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethodType('upi')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  methodType === 'upi'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setMethodType('bank_account')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  methodType === 'bank_account'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-semibold">Bank Account</span>
              </button>
            </div>
          </div>

          {/* UPI Fields */}
          {methodType === 'upi' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiError('');
                }}
                placeholder="username@paytm"
                className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                  upiError
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-slate-700'
                }`}
              />
              {upiError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{upiError}</p>
              )}
            </div>
          )}

          {/* Bank Account Fields */}
          {methodType === 'bank_account' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => {
                    setAccountHolderName(e.target.value);
                    setAccountHolderError('');
                  }}
                  placeholder="Enter account holder name"
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                    accountHolderError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-700'
                  }`}
                />
                {accountHolderError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{accountHolderError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setAccountNumberError('');
                  }}
                  placeholder="Enter account number"
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                    accountNumberError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-700'
                  }`}
                />
                {accountNumberError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{accountNumberError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => {
                    setIfscCode(e.target.value.toUpperCase());
                    setIfscError('');
                  }}
                  placeholder="SBIN0001234"
                  className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                    ifscError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-700'
                  }`}
                />
                {ifscError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{ifscError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name (Optional)
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>
            </>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 text-sm rounded-xl font-medium bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300">
              {errorMsg}
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
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-transform"
            >
              {loading && <ButtonSpinner size="sm" />}
              {loading ? 'Adding...' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;
