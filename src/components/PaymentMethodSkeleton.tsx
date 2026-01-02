/**
 * Skeleton loader for payment method cards
 */
const PaymentMethodSkeleton = () => (
  <div 
    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 animate-pulse"
    role="status"
    aria-label="Loading payment method"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4 flex-1">
        {/* Icon placeholder */}
        <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
        
        <div className="flex-1 space-y-3">
          {/* Title placeholder */}
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32" />
          
          {/* Account details placeholder */}
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48" />
          
          {/* Status badges placeholder */}
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-20" />
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-24" />
          </div>
        </div>
      </div>
      
      {/* Action buttons placeholder */}
      <div className="flex gap-2 ml-4">
        <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
    <span className="sr-only">Loading payment method...</span>
  </div>
);

export default PaymentMethodSkeleton;
