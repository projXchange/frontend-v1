import React, { useState, useEffect } from 'react';
import { X, Edit, DollarSign, User, CreditCard } from 'lucide-react';
import { Transaction } from '../types/Transaction';
interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onUpdateTransactionStatus: (
        transactionId: string,
        status: string,
        paymentGatewayResponse?: string,
        metadata?: string
    ) => Promise<void>;
    updatingTransaction: string | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    isOpen,
    onClose,
    transaction,
    onUpdateTransactionStatus,
    updatingTransaction
}) => {
    const [editingTransaction, setEditingTransaction] = useState(false);
    const [transactionEditData, setTransactionEditData] = useState({
        status: '',
        payment_gateway_response: '',
        metadata: ''
    });

    // Initialize transaction edit data when selected transaction changes
    useEffect(() => {
        if (transaction) {
            setTransactionEditData({
                status: transaction.status || '',
                payment_gateway_response: '',
                metadata: ''
            });
        }
    }, [transaction]);

    const handleUpdateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction) return;

        try {
            await onUpdateTransactionStatus(
                transaction.id,
                transactionEditData.status,
                transactionEditData.payment_gateway_response || undefined,
                transactionEditData.metadata || undefined
            );
            setEditingTransaction(false);
        } catch (error) {
            console.error('Failed to update transaction:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'purchase':
                return 'bg-blue-100 text-blue-800';
            case 'refund':
                return 'bg-orange-100 text-orange-800';
            case 'commission':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-3xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp transition-colors">
                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Transaction Details</h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!editingTransaction && (
                            <button
                                onClick={() => setEditingTransaction(true)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 transition-all duration-200"
                            >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Update Status</span>
                                <span className="sm:hidden">Update</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onClose();
                                setEditingTransaction(false);
                                setTransactionEditData({
                                    status: '',
                                    payment_gateway_response: '',
                                    metadata: ''
                                });
                            }}
                            className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {transaction ? (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Transaction Header */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-colors">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <DollarSign className="text-white w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 break-all">{transaction.transaction_id}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-semibold">{transaction.amount} {transaction.currency}</p>
                                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                                        <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                        <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${getTypeColor(transaction.type)}`}>
                                            {transaction.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {editingTransaction ? (
                            /* Edit Transaction Form */
                            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-700 shadow-lg transition-colors">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                    <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                    <span className="truncate">Update Transaction Status</span>
                                </h3>

                                <form onSubmit={handleUpdateTransaction} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                                                Status *
                                            </label>
                                            <select
                                                value={transactionEditData.status}
                                                onChange={(e) => setTransactionEditData(prev => ({ ...prev, status: e.target.value }))}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors"
                                                required
                                            >
                                                <option value="">Select status</option>
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="failed">Failed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                                                Payment Gateway Response
                                            </label>
                                            <textarea
                                                value={transactionEditData.payment_gateway_response}
                                                onChange={(e) => setTransactionEditData(prev => ({ ...prev, payment_gateway_response: e.target.value }))}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-colors"
                                                rows={3}
                                                placeholder="Enter payment gateway response..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                                                Metadata
                                            </label>
                                            <textarea
                                                value={transactionEditData.metadata}
                                                onChange={(e) => setTransactionEditData(prev => ({ ...prev, metadata: e.target.value }))}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-colors"
                                                rows={3}
                                                placeholder="Enter transaction metadata..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingTransaction(false);
                                                setTransactionEditData({
                                                    status: transaction.status || '',
                                                    payment_gateway_response: '',
                                                    metadata: ''
                                                });
                                            }}
                                            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updatingTransaction === transaction.id}
                                            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updatingTransaction === transaction.id ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="hidden sm:inline">Updating...</span>
                                                    <span className="sm:hidden">...</span>
                                                </div>
                                            ) : (
                                                'Update Transaction'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* View Transaction Details */
                            <div className="grid gap-4 sm:gap-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Transaction ID</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm break-all transition-colors">
                                            {transaction.id}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reference ID</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm break-all transition-colors">
                                            {transaction.transaction_id}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl transition-colors">
                                            <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${getTypeColor(transaction.type)}`}>
                                                {transaction.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl transition-colors">
                                            <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center gap-2 transition-colors">
                                            <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{transaction.payment_method}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-semibold text-base sm:text-lg transition-colors">
                                            {transaction.amount} {transaction.currency}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Commission Amount</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base transition-colors">
                                            {transaction.commission_amount} {transaction.currency}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Author Amount</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base transition-colors">
                                            {transaction.author_amount} {transaction.currency}
                                        </div>
                                    </div>

                                    {transaction.project && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project</label>
                                            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 transition-colors">
                                                {transaction.project.thumbnail && (
                                                    <img
                                                        src={transaction.project.thumbnail}
                                                        alt={transaction.project.title}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{transaction.project.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">ID: {transaction.project.id}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buyer</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl transition-colors">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{transaction.buyer?.full_name || 'N/A'}</div>
                                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{transaction.buyer?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Created At</label>
                                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors">
                                            {new Date(transaction.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {transaction.processed_at && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Processed At</label>
                                            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors">
                                                {new Date(transaction.processed_at).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!editingTransaction && (
                            <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                                <button
                                    onClick={() => {
                                        onClose();
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:h-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                        <p className="mt-3 sm:mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading transaction details...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionDetailsModal;