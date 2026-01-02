import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

/**
 * Page-specific error boundary with custom styling for page-level errors
 */
const PageErrorBoundary = ({ children, pageName = 'this page' }: PageErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 sm:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>

                {/* Error Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Unable to load {pageName}
                </h1>

                {/* Error Message */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                  We encountered an error while loading this page. This might be a temporary issue.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="w-full mb-8 text-left max-w-2xl">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 hover:text-gray-900 dark:hover:text-gray-100">
                      Technical Details
                    </summary>
                    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                        {error.name}: {error.message}
                      </p>
                      <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-60">
                        {error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={resetError}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                    aria-label="Retry loading the page"
                  >
                    <RefreshCw className="w-5 h-5" aria-hidden="true" />
                    Try Again
                  </button>

                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Go to home page"
                  >
                    <Home className="w-5 h-5" aria-hidden="true" />
                    Go Home
                  </a>
                </div>

                {/* Support Link */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                  If this problem persists, please{' '}
                  <a
                    href="/contact"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    contact support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
