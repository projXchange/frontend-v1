/**
 * Skeleton loader for payout history table rows
 */
const PayoutTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <tr 
        key={index}
        className="border-b border-gray-200 dark:border-slate-700 animate-pulse"
        role="status"
        aria-label={`Loading payout ${index + 1}`}
      >
        {/* Payout ID */}
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
        </td>
        
        {/* Amount */}
        <td className="px-6 py-4">
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24" />
        </td>
        
        {/* Status */}
        <td className="px-6 py-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-28" />
        </td>
        
        {/* Payment Method */}
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        </td>
        
        {/* Date */}
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
        </td>
        
        {/* Actions */}
        <td className="px-6 py-4">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        </td>
      </tr>
    ))}
    <span className="sr-only">Loading payout history...</span>
  </>
);

export default PayoutTableSkeleton;
