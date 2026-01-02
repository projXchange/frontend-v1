import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Ban,
  Eye,
  Plus,
  Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import PayoutStatusBadge from '../components/PayoutStatusBadge';
import PayoutDetailsModal from '../components/PayoutDetailsModal';
import ManualPayoutModal from '../components/ManualPayoutModal';
import StatCardSkeleton from '../components/StatCardSkeleton';
import {
  getPayoutStats,
  getAdminPayouts,
  retryPayout,
  cancelPayout,
} from '../services/payoutService';
import type { Payout, PayoutStatus, PayoutStatsResponse } from '../types/Payout';

export default function AdminPayouts() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<PayoutStatsResponse | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | ''>('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalReturned, setTotalReturned] = useState(0);
  const limit = 20;
  
  // Modal state
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isManualPayoutModalOpen, setIsManualPayoutModalOpen] = useState(false);
  
  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [payoutToCancel, setPayoutToCancel] = useState<string | null>(null);

  // Fetch stats on mount and when date filters change
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, startDateFilter, endDateFilter]);

  // Fetch payouts on mount and when filters/pagination change
  useEffect(() => {
    if (isAdmin) {
      fetchPayouts();
    }
  }, [isAdmin, currentPage, statusFilter, userIdFilter, startDateFilter, endDateFilter]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getPayoutStats({
        start_date: startDateFilter || undefined,
        end_date: endDateFilter || undefined,
      });
      setStats(response);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getAdminPayouts({
        page: currentPage,
        limit,
        user_id: userIdFilter || undefined,
        status: statusFilter || undefined,
        start_date: startDateFilter || undefined,
        end_date: endDateFilter || undefined,
      });
      
      setPayouts(response.payouts);
      setHasMore(response.pagination.has_more);
      setTotalReturned(response.pagination.total_returned);
    } catch (err: any) {
      setError(err.error || err.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (payoutId: string) => {
    if (!window.confirm('Are you sure you want to retry this payout?')) {
      return;
    }

    try {
      setActionLoading(payoutId);
      await retryPayout(payoutId);
      toast.success('Payout retry initiated successfully');
      fetchPayouts();
      fetchStats();
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to retry payout';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelClick = (payoutId: string) => {
    setPayoutToCancel(payoutId);
    setCancelReason('');
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!payoutToCancel || !cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setActionLoading(payoutToCancel);
      await cancelPayout(payoutToCancel, cancelReason);
      toast.success('Payout cancelled successfully');
      setShowCancelDialog(false);
      setPayoutToCancel(null);
      setCancelReason('');
      fetchPayouts();
      fetchStats();
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to cancel payout';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsDetailsModalOpen(true);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setUserIdFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
    setCurrentPage(1);
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
      payout.user_id.toLowerCase().includes(query) ||
      payout.amount.toLowerCase().includes(query) ||
      payout.status.toLowerCase().includes(query) ||
      (payout.utr_number && payout.utr_number.toLowerCase().includes(query))
    );
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-gray-900 dark:text-gray-100" aria-hidden="true" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Payout Management
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage all payout transactions
              </p>
            </div>
            <button
              onClick={() => setIsManualPayoutModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              aria-label="Create manual payout"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Manual Payout
            </button>
          </div>
        </header>

        {/* Statistics Cards - Responsive: stacks on mobile, 2 cols on tablet, 4 cols on desktop */}
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" role="status" aria-label="Loading statistics">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : stats ? (
          <section aria-label="Payout statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Volume */}
            <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Volume
                </p>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(stats.overview.total_payout_volume)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats.overview.total_payout_count} payouts
              </p>
            </article>

            {/* Success Rate */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {parseFloat(stats.overview.success_rate).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats.overview.completed_count} completed
              </p>
            </div>

            {/* Pending */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(stats.overview.pending_amount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stats.overview.pending_count} payouts
              </p>
            </div>

            {/* Failed */}
            <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Failed
                </p>
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.overview.failed_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Requires attention
              </p>
            </article>
          </section>
        ) : null}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {(statusFilter || userIdFilter || startDateFilter || endDateFilter) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User ID Filter */}
            <div>
              <label
                htmlFor="user-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                User ID
              </label>
              <input
                id="user-filter"
                type="text"
                value={userIdFilter}
                onChange={(e) => {
                  setUserIdFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter by user ID"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as PayoutStatus | '');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDateFilter}
                onChange={(e) => {
                  setStartDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                max={endDateFilter || undefined}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDateFilter}
                onChange={(e) => {
                  setEndDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                min={startDateFilter || undefined}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <label htmlFor="admin-payout-search" className="sr-only">Search payouts</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="admin-payout-search"
              type="text"
              placeholder="Search by payout ID, user ID, amount, status, or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search payouts by ID, user ID, amount, status, or UTR"
            />
          </div>
        </div>

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

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payouts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPayouts.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No payouts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter || userIdFilter || startDateFilter || endDateFilter
                ? 'Try adjusting your filters or search query'
                : 'No payout transactions yet'}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && filteredPayouts.length > 0 && (
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Payout ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredPayouts.map((payout) => (
                    <tr
                      key={payout.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleViewDetails(payout);
                        }
                      }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                      aria-label={`Payout ${payout.payout_id} for user ${payout.user_id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {payout.payout_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {payout.user_id.substring(0, 8)}...
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(payout)}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            aria-label="View details"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payout.status === 'failed' && payout.retry_count < 3 && (
                            <button
                              onClick={() => handleRetry(payout.id)}
                              disabled={actionLoading === payout.id}
                              className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 disabled:opacity-50"
                              aria-label="Retry payout"
                              title="Retry payout"
                            >
                              <RefreshCw className={`w-4 h-4 ${actionLoading === payout.id ? 'animate-spin' : ''}`} />
                            </button>
                          )}
                          {(payout.status === 'pending_verification' || 
                            payout.status === 'verified' || 
                            payout.status === 'processing') && (
                            <button
                              onClick={() => handleCancelClick(payout.id)}
                              disabled={actionLoading === payout.id}
                              className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                              aria-label="Cancel payout"
                              title="Cancel payout"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        {!loading && filteredPayouts.length > 0 && (
          <div className="md:hidden space-y-4">
            {filteredPayouts.map((payout) => (
              <div
                key={payout.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewDetails(payout);
                  }
                }}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm focus:outline-none"
                aria-label={`Payout ${payout.payout_id} for user ${payout.user_id}`}
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
                    <span className="text-gray-600 dark:text-gray-400">User ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {payout.user_id.substring(0, 8)}...
                    </span>
                  </div>
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(payout)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {payout.status === 'failed' && payout.retry_count < 3 && (
                    <button
                      onClick={() => handleRetry(payout.id)}
                      disabled={actionLoading === payout.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${actionLoading === payout.id ? 'animate-spin' : ''}`} />
                      Retry
                    </button>
                  )}
                  {(payout.status === 'pending_verification' || 
                    payout.status === 'verified' || 
                    payout.status === 'processing') && (
                    <button
                      onClick={() => handleCancelClick(payout.id)}
                      disabled={actionLoading === payout.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50"
                    >
                      <Ban className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredPayouts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPayouts.length} of {totalReturned} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
            aria-describedby="cancel-dialog-description"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowCancelDialog(false);
                setPayoutToCancel(null);
                setCancelReason('');
              }
            }}
          >
            <div 
              className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl"
              onKeyDown={(e) => e.stopPropagation()}
            >
              <h3 id="cancel-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Cancel Payout
              </h3>
              <p id="cancel-dialog-description" className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for cancelling this payout:
              </p>
              <label htmlFor="cancel-reason" className="sr-only">Cancellation reason</label>
              <textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                aria-required="true"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowCancelDialog(false);
                    setPayoutToCancel(null);
                    setCancelReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 font-medium transition-colors"
                  aria-label="Cancel dialog"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={!cancelReason.trim() || actionLoading === payoutToCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Confirm cancellation"
                >
                  {actionLoading === payoutToCancel ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payout Details Modal */}
        <PayoutDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPayout(null);
          }}
          payout={selectedPayout}
          onRetry={handleRetry}
          onCancel={(id) => handleCancelClick(id)}
        />

        {/* Manual Payout Modal */}
        <ManualPayoutModal
          isOpen={isManualPayoutModalOpen}
          onClose={() => setIsManualPayoutModalOpen(false)}
          onSuccess={() => {
            setIsManualPayoutModalOpen(false);
            fetchPayouts();
            fetchStats();
          }}
        />
      </div>
    </main>
  );
}
