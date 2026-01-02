import { useState, useEffect } from 'react';
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PayoutStatusBadge from '../components/PayoutStatusBadge';
import PayoutFilters from '../components/PayoutFilters';
import PayoutDetailsModal from '../components/PayoutDetailsModal';
import PayoutTableSkeleton from '../components/PayoutTableSkeleton';
import PayoutCardSkeleton from '../components/PayoutCardSkeleton';
import { getPayouts, resendVerification } from '../services/payoutService';
import type { Payout, PayoutStatus } from '../types/Payout';

export default function PayoutHistory() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalReturned, setTotalReturned] = useState(0);
  const limit = 20;
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | undefined>();
  const [startDateFilter, setStartDateFilter] = useState<string | undefined>();
  const [endDateFilter, setEndDateFilter] = useState<string | undefined>();
  
  // Modal state
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Resend verification state
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Fetch payouts on mount and when filters/pagination change
  useEffect(() => {
    fetchPayouts();
  }, [currentPage, statusFilter, startDateFilter, endDateFilter]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getPayouts({
        page: currentPage,
        limit,
        status: statusFilter,
        start_date: startDateFilter,
        end_date: endDateFilter,
      });
      
      setPayouts(response.payouts);
      setHasMore(response.pagination.has_more);
      setTotalReturned(response.pagination.total_returned);
    } catch (err: any) {
      setError(err.error || err.message || 'Failed to load payout history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: {
    status?: PayoutStatus | '';
    startDate?: string;
    endDate?: string;
  }) => {
    setStatusFilter(filters.status || undefined);
    setStartDateFilter(filters.startDate || undefined);
    setEndDateFilter(filters.endDate || undefined);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
    setCurrentPage(1);
  };

  const handlePayoutClick = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsDetailsModalOpen(true);
  };

  const handleResendVerification = async (payoutId: string) => {
    try {
      setResendingId(payoutId);
      await resendVerification(payoutId);
      toast.success('Verification email sent successfully');
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to resend verification email';
      toast.error(errorMessage);
    } finally {
      setResendingId(null);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMethod = (payout: Payout) => {
    if (!payout.payment_method) return 'N/A';
    
    if (payout.payment_method.method_type === 'upi') {
      return payout.payment_method.upi_id || 'UPI';
    }
    
    if (payout.payment_method.method_type === 'bank_account') {
      return `****${payout.payment_method.account_number_last4 || '****'}`;
    }
    
    return 'N/A';
  };

  // Filter payouts by search query (client-side search)
  const filteredPayouts = payouts.filter((payout) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      payout.payout_id.toLowerCase().includes(query) ||
      payout.amount.toLowerCase().includes(query) ||
      payout.status.toLowerCase().includes(query) ||
      (payout.utr_number && payout.utr_number.toLowerCase().includes(query))
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-gray-900 dark:text-gray-100" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Payout History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your payout transactions
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

        {/* Filters */}
        <div className="mb-6">
          <PayoutFilters
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <label htmlFor="payout-search" className="sr-only">Search payouts</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="payout-search"
              type="text"
              placeholder="Search by payout ID, amount, status, or UTR number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search payouts by ID, amount, status, or UTR number"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <>
            {/* Desktop Table Loading */}
            <div className="hidden md:block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Payout ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Requested At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    <PayoutTableSkeleton rows={5} />
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Card Loading */}
            <div className="md:hidden space-y-4">
              <PayoutCardSkeleton count={5} />
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredPayouts.length === 0 && (
          <section 
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center"
            aria-label="No payouts found"
          >
            <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No payouts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter || startDateFilter || endDateFilter
                ? 'Try adjusting your filters or search query'
                : 'You haven\'t requested any payouts yet'}
            </p>
          </section>
        )}

        {/* Desktop Table View */}
        {!loading && filteredPayouts.length > 0 && (
          <section aria-label="Payout history table">
            <div className="hidden md:block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Payout ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Requested At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredPayouts.map((payout) => (
                    <tr
                      key={payout.id}
                      onClick={() => handlePayoutClick(payout)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePayoutClick(payout);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className="hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors focus:outline-none"
                      aria-label={`View details for payout ${payout.payout_id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {payout.payout_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(payout.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PayoutStatusBadge status={payout.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPaymentMethod(payout)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(payout.requested_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payout.status === 'pending_verification' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResendVerification(payout.id);
                            }}
                            disabled={resendingId === payout.id}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Resend verification email"
                          >
                            <RefreshCw className={`w-3 h-3 ${resendingId === payout.id ? 'animate-spin' : ''}`} />
                            Resend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </section>
        )}

        {/* Mobile Card View */}
        {!loading && filteredPayouts.length > 0 && (
          <section aria-label="Payout history cards" className="md:hidden space-y-4">
            {filteredPayouts.map((payout) => (
              <div
                key={payout.id}
                onClick={() => handlePayoutClick(payout)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePayoutClick(payout);
                  }
                }}
                tabIndex={0}
                role="button"
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow focus:outline-none"
                aria-label={`View details for payout ${payout.payout_id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {payout.payout_id}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(payout.amount)}
                    </p>
                  </div>
                  <PayoutStatusBadge status={payout.status} size="sm" />
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatPaymentMethod(payout)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Requested</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(payout.requested_at)}
                    </span>
                  </div>
                </div>

                {payout.status === 'pending_verification' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResendVerification(payout.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleResendVerification(payout.id);
                      }
                    }}
                    disabled={resendingId === payout.id}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  >
                    <RefreshCw className={`w-4 h-4 ${resendingId === payout.id ? 'animate-spin' : ''}`} aria-hidden="true" />
                    Resend Verification
                  </button>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Pagination */}
        {!loading && filteredPayouts.length > 0 && (
          <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPayouts.length} of {totalReturned} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400" aria-current="page">
                Page {currentPage}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
              >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}

        {/* Payout Details Modal */}
        <PayoutDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPayout(null);
          }}
          payout={selectedPayout}
          onResendVerification={handleResendVerification}
        />
      </div>
    </main>
  );
}
