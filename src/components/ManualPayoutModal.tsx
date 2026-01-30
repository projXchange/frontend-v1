import React, { useState, useEffect } from 'react';
import { X, Wallet, AlertTriangle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import ButtonSpinner from './ButtonSpinner';
import { createManualPayout, getPaymentMethods } from '../services/payoutService';
import type { Payout, PaymentMethod, ManualPayoutForm } from '../types/Payout';

interface ManualPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payout: Payout) => void;
}

const ManualPayoutModal: React.FC<ManualPayoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [amountError, setAmountError] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [notesError, setNotesError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Payment methods for the selected user
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState('');

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setUserId('');
    setAmount('');
    setNotes('');
    setPaymentMethodId('');
    setPaymentMethods([]);
    setErrorMsg('');
    setAmountError('');
    setUserIdError('');
    setNotesError('');
    setPaymentMethodsError('');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  // Fetch payment methods when user ID is entered
  const handleUserIdBlur = async () => {
    if (!userId.trim()) {
      setPaymentMethods([]);
      setPaymentMethodId('');
      return;
    }

    try {
      setLoadingPaymentMethods(true);
      setPaymentMethodsError('');

      // Fetch payment methods for the specific user (Admin capability)
      const methods = await getPaymentMethods(userId.trim());
      setPaymentMethods(methods);

      // Auto-select primary payment method (Requirements: 7.5)
      const primaryMethod = methods.find(pm => pm.is_primary);
      if (primaryMethod) {
        setPaymentMethodId(primaryMethod.id);
      } else if (methods.length > 0) {
        setPaymentMethodId(methods[0].id);
      }
    } catch (error: any) {
      setPaymentMethodsError('Unable to load payment methods for this user');
      setPaymentMethods([]);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Clear previous errors
    setAmountError('');
    setUserIdError('');
    setNotesError('');
    setErrorMsg('');

    // Validate user ID (Requirements: 7.4)
    if (!userId.trim()) {
      setUserIdError('User ID is required');
      isValid = false;
    }

    // Validate amount (Requirements: 7.4)
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    } else if (amountNum < 100) {
      setAmountError('Minimum payout amount is ₹100');
      isValid = false;
    }

    // Validate admin notes (Requirements: 7.4 - required)
    if (!notes.trim()) {
      setNotesError('Admin notes are required for manual payouts');
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
      const formData: ManualPayoutForm = {
        user_id: userId.trim(),
        amount: parseFloat(amount),
        notes: notes.trim(),
      };

      // Add payment method ID if specified (Requirements: 7.5)
      if (paymentMethodId) {
        formData.payment_method_id = paymentMethodId;
      }

      const newPayout = await createManualPayout(formData);
      onSuccess(newPayout);
      toast.success('Manual payout created successfully');
      handleClose();
    } catch (error: any) {
      const errorMessage = error.error || error.message || 'Failed to create manual payout';
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

  const getPaymentMethodDisplay = (pm: PaymentMethod): string => {
    if (pm.method_type === 'upi') {
      return `UPI: ${pm.upi_id}`;
    }
    return `Bank: ****${pm.account_number_last4 || '****'}`;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4 transition-opacity duration-300 ease-out ${isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden relative transform transition-all duration-300 ease-in-out ${isClosing ? 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0' : 'translate-y-0 sm:scale-100 opacity-100'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          {/* Mobile drag indicator */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Create Manual Payout
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
          {/* Warning about bypassing verification (Requirements: 7.4) */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                  Bypass Email Verification
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Manual payouts bypass email verification and are queued for immediate processing.
                  Use this feature carefully and only when necessary.
                </p>
              </div>
            </div>
          </div>

          {/* User Search/Select Input (Requirements: 7.4) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setUserIdError('');
                }}
                onBlur={handleUserIdBlur}
                placeholder="Enter user ID"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors ${userIdError
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-slate-700'
                  }`}
              />
            </div>
            {userIdError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{userIdError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the user ID of the seller to create a payout for
            </p>
          </div>

          {/* Amount Input (Requirements: 7.4) */}
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
                className={`w-full pl-8 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors ${amountError
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-slate-700'
                  }`}
              />
            </div>
            {amountError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{amountError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Minimum amount: ₹100.00
            </p>
          </div>

          {/* Payment Method Selector (Requirements: 7.4, 7.5) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            {loadingPaymentMethods ? (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading payment methods...
                </p>
              </div>
            ) : paymentMethodsError ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {paymentMethodsError}
                </p>
              </div>
            ) : paymentMethods.length === 0 && userId ? (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No payment methods found for this user. Primary payment method will be used.
                </p>
              </div>
            ) : paymentMethods.length > 0 ? (
              <>
                <select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors"
                >
                  {paymentMethods.map(pm => (
                    <option key={pm.id} value={pm.id}>
                      {getPaymentMethodDisplay(pm)} {pm.is_primary ? '(Primary)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Primary payment method is auto-selected
                </p>
              </>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter a user ID to load payment methods
                </p>
              </div>
            )}
          </div>

          {/* Admin Notes Field (Requirements: 7.4 - required) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Admin Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesError('');
              }}
              placeholder="Provide a reason for this manual payout (required)..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors resize-none ${notesError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-700'
                }`}
            />
            {notesError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{notesError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Document the reason for creating this manual payout
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
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
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white font-semibold rounded-xl hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-transform"
            >
              {loading && <ButtonSpinner size="sm" />}
              {loading ? 'Creating...' : 'Create Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPayoutModal;
