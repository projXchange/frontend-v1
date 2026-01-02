/**
 * Skeleton loader for payout cards (mobile view)
 */
const PayoutCardSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 animate-pulse"
        role="status"
        aria-label={`Loading payout ${index + 1}`}
      >
        <div className="space-y-4">
          {/* Header with ID and status */}
          <div className="flex items-start justify-between">
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-24" />
          </div>
          
          {/* Amount */}
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-40" />
          
          {/* Details */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
          
          {/* Action button */}
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-full" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading payouts...</span>
  </>
);

export default PayoutCardSkeleton;
