import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { PayoutStatus } from '../types/Payout';

interface PayoutFiltersProps {
  onFilterChange: (filters: {
    status?: PayoutStatus | '';
    startDate?: string;
    endDate?: string;
  }) => void;
  onClearFilters: () => void;
}

export default function PayoutFilters({
  onFilterChange,
  onClearFilters,
}: PayoutFiltersProps) {
  const [status, setStatus] = useState<PayoutStatus | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStatusChange = (newStatus: PayoutStatus | '') => {
    setStatus(newStatus);
    onFilterChange({
      status: newStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    onFilterChange({
      status: status || undefined,
      startDate: date || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    onFilterChange({
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: date || undefined,
    });
  };

  const handleClear = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    onClearFilters();
  };

  const hasActiveFilters = status || startDate || endDate;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as PayoutStatus | '')}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            htmlFor="start-date-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Start Date
          </label>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={endDate || undefined}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label
            htmlFor="end-date-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            End Date
          </label>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate || undefined}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
