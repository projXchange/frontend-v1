import { useState, useEffect } from 'react';
import { Plus, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PaymentMethodCard from '../components/PaymentMethodCard';
import AddPaymentMethodModal from '../components/AddPaymentMethodModal';
import PaymentMethodSkeleton from '../components/PaymentMethodSkeleton';
import {
  getPaymentMethods,
  setPrimaryPaymentMethod,
  deletePaymentMethod,
} from '../services/payoutService';
import type { PaymentMethod } from '../types/Payout';

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch payment methods on mount
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError('');
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.error || err.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newMethod: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
    toast.success('Payment method added successfully');
  };

  const handleSetPrimary = async (id: string) => {
    try {
      setUpdatingId(id);
      const updatedMethod = await setPrimaryPaymentMethod(id);
      
      // Update the payment methods list
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          is_primary: method.id === updatedMethod.id,
        }))
      );
      
      toast.success('Primary payment method updated');
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to set primary payment method';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      setUpdatingId(deleteConfirmId);
      await deletePaymentMethod(deleteConfirmId);
      
      // Remove from list
      setPaymentMethods((prev) => prev.filter((method) => method.id !== deleteConfirmId));
      
      toast.success('Payment method deleted successfully');
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to delete payment method';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment Methods
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your payment methods for receiving payouts
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div 
            role="alert" 
            aria-live="polite"
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Payment Method Button - Ensure min 44px height for mobile tappability */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
            aria-label="Add new payment method"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Add Payment Method
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4" role="status" aria-label="Loading payment methods">
            <PaymentMethodSkeleton />
            <PaymentMethodSkeleton />
            <PaymentMethodSkeleton />
          </div>
        )}

        {/* Payment Methods List */}
        {!loading && paymentMethods.length > 0 && (
          <section aria-label="Payment methods list">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  paymentMethod={method}
                  onSetPrimary={handleSetPrimary}
                  onDelete={handleDeleteClick}
                  isUpdating={updatingId === method.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && paymentMethods.length === 0 && (
          <section 
            className="text-center py-16 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
            aria-label="No payment methods"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No payment methods yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Add a payment method to start receiving payouts. You can add UPI or bank account details.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
              aria-label="Add your first payment method"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Add Your First Payment Method
            </button>
          </section>
        )}

        {/* Add Payment Method Modal */}
        <AddPaymentMethodModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={handleDeleteCancel}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleDeleteCancel();
              }
            }}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <h3 id="delete-dialog-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Delete Payment Method
              </h3>
              <p id="delete-dialog-description" className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this payment method? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={updatingId === deleteConfirmId}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  aria-label="Cancel deletion"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={updatingId === deleteConfirmId}
                  className="flex-1 px-4 py-3 bg-red-600 dark:bg-red-500 text-white font-semibold rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
                  aria-label="Confirm deletion"
                >
                  {updatingId === deleteConfirmId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
