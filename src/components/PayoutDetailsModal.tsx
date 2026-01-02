import { X, Calendar, CreditCard, Hash, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import PayoutStatusBadge from './PayoutStatusBadge';
import type { Payout } from '../types/Payout';

interface PayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: Payout | null;
  onResendVerification?: (payoutId: string) => void;
  onRetry?: (payoutId: string) => void;
  onCancel?: (payoutId: string, reason: string) => void;
}

export default function PayoutDetailsModal({
  isOpen,
  onClose,
  payout,
  onResendVerification,
  onRetry,
  onCancel,
}: PayoutDetailsModalProps) {
  if (!isOpen || !payout) return null;

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMethod = () => {
    if (!payout.payment_method) return 'N/A';
    
    if (payout.payment_method.method_type === 'upi') {
      return (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">UPI</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payout.payment_method.upi_id}
          </p>
        </div>
      );
    }
    
    if (payout.payment_method.method_type === 'bank_account') {
      return (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">Bank Account</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payout.payment_method.account_holder_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ****{payout.payment_method.account_number_last4}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payout.payment_method.ifsc_code} - {payout.payment_method.bank_name}
          </p>
        </div>
      );
    }
    
    return 'N/A';
  };

  const getTimeline = () => {
    const timeline: { label: string; date?: string; icon: React.ReactNode; completed: boolean }[] = [
      {
        label: 'Requested',
        date: payout.requested_at,
        icon: <Calendar className="w-5 h-5" />,
        completed: true,
      },
    ];

    if (payout.verified_at) {
      timeline.push({
        label: 'Verified',
        date: payout.verified_at,
        icon: <CheckCircle2 className="w-5 h-5" />,
        completed: true,
      });
    }

    if (payout.processed_at) {
      timeline.push({
        label: 'Processing',
        date: payout.processed_at,
        icon: <RefreshCw className="w-5 h-5" />,
        completed: true,
      });
    }

    if (payout.completed_at) {
      timeline.push({
        label: 'Completed',
        date: payout.completed_at,
        icon: <CheckCircle2 className="w-5 h-5" />,
        completed: true,
      });
    }

    if (payout.failed_at) {
      timeline.push({
        label: 'Failed',
        date: payout.failed_at,
        icon: <AlertCircle className="w-5 h-5" />,
        completed: true,
      });
    }

    return timeline;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Bottom sheet on mobile, centered on desktop */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="relative w-full sm:max-w-2xl bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
            {/* Mobile drag indicator */}
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
            <div className="mt-2 sm:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Payout Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {payout.payout_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Status
              </label>
              <PayoutStatusBadge status={payout.status} size="lg" />
            </div>

            {/* Amount Breakdown */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Amount Breakdown
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(payout.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing Fee</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(payout.payout_fee)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Net Amount
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(payout.net_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Payment Method
              </label>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                {formatPaymentMethod()}
              </div>
            </div>

            {/* UTR Number (if completed) */}
            {payout.utr_number && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  UTR Number
                </label>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                    {payout.utr_number}
                  </p>
                </div>
              </div>
            )}

            {/* Failure Reason (if failed) */}
            {payout.failure_reason && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Failure Reason
                </label>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {payout.failure_reason}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {payout.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Notes
                </label>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {payout.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Timeline
              </label>
              <div className="space-y-4">
                {getTimeline().map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </p>
                      {item.date && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(item.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retry Count (if applicable) */}
            {payout.retry_count > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  This payout has been retried {payout.retry_count} time{payout.retry_count > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Footer with Actions - Ensure min 44px height for mobile tappability */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
            {/* Resend Verification Button (for pending verification) */}
            {payout.status === 'pending_verification' && onResendVerification && (
              <button
                onClick={() => {
                  onResendVerification(payout.id);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Resend Verification
              </button>
            )}

            {/* Retry Button (for admin on failed payouts) */}
            {payout.status === 'failed' && onRetry && payout.retry_count < 3 && (
              <button
                onClick={() => {
                  onRetry(payout.id);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-orange-600 dark:bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Payout
              </button>
            )}

            {/* Cancel Button (for admin on processing payouts) */}
            {(payout.status === 'processing' || payout.status === 'verified') && onCancel && (
              <button
                onClick={() => {
                  const reason = prompt('Enter cancellation reason:');
                  if (reason) {
                    onCancel(payout.id, reason);
                    onClose();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-red-600 dark:bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel Payout
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 min-h-[44px] bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
