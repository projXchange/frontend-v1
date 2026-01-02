import { CreditCard, Building2, Star, Trash2, CheckCircle2 } from 'lucide-react';
import type { PaymentMethod } from '../types/Payout';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}

export default function PaymentMethodCard({
  paymentMethod,
  onSetPrimary,
  onDelete,
  isUpdating
}: PaymentMethodCardProps) {
  const isUpi = paymentMethod.method_type === 'upi';
  
  return (
    <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${
            isUpi 
              ? 'bg-purple-100 dark:bg-purple-900/30' 
              : 'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            {isUpi ? (
              <CreditCard className={`w-6 h-6 ${
                isUpi 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`} aria-hidden="true" />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {isUpi ? 'UPI' : 'Bank Account'}
              </h3>
              {paymentMethod.is_primary && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                  Primary
                </span>
              )}
              {paymentMethod.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                  <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>

            {isUpi ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                {paymentMethod.upi_id}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {paymentMethod.account_holder_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ••••{paymentMethod.account_number_last4}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {paymentMethod.ifsc_code} • {paymentMethod.bank_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {!paymentMethod.is_primary && (
            <button
              onClick={() => onSetPrimary(paymentMethod.id)}
              disabled={isUpdating}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Set as primary payment method"
            >
              Set Primary
            </button>
          )}
          <button
            onClick={() => onDelete(paymentMethod.id)}
            disabled={isUpdating || paymentMethod.is_primary}
            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${isUpi ? 'UPI' : 'bank account'} payment method`}
            title={paymentMethod.is_primary ? "Cannot delete primary payment method" : "Delete payment method"}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
