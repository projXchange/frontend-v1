const StatCardSkeleton = () => (
  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 animate-pulse transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      </div>
      <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
    </div>
  </div>
)

export default StatCardSkeleton
