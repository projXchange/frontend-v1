import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { verifyPayout } from '../services/payoutService';
import type { Payout } from '../types/Payout';

export default function PayoutVerification() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [payout, setPayout] = useState<Payout | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    // If no token, redirect to home immediately
    if (!token) {
      navigate('/');
      return;
    }

    // Verify the payout
    verifyPayoutToken();
  }, [token]);

  useEffect(() => {
    // Start countdown after successful verification
    if (success && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Redirect when countdown reaches 0
    if (success && redirectCountdown === 0) {
      navigate('/payouts/history');
    }
  }, [success, redirectCountdown, navigate]);

  const verifyPayoutToken = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      
      const verifiedPayout = await verifyPayout(token);
      
      setPayout(verifiedPayout);
      setSuccess(true);
    } catch (err: any) {
      setSuccess(false);
      
      // Handle specific error cases
      if (err.error) {
        if (err.error.includes('expired') || err.error.includes('Expired')) {
          setError('This verification link has expired. Please request a new payout or resend the verification email.');
        } else if (err.error.includes('invalid') || err.error.includes('Invalid')) {
          setError('This verification link is invalid. Please check your email for the correct link.');
        } else if (err.error.includes('already verified') || err.error.includes('Already verified')) {
          setError('This payout has already been verified.');
        } else {
          setError(err.error);
        }
      } else {
        setError('Failed to verify payout. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleGoToHistory = () => {
    navigate('/payouts/history');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verifying Payout
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your payout request...
            </p>
          </div>
        )}

        {/* Success State */}
        {!loading && success && payout && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Payout Verified Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your payout request has been verified and is now being processed.
            </p>

            {/* Payout Details */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Payout ID</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payout.payout_id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(payout.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    <Clock className="w-3 h-3" />
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Redirect Message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Redirecting to payout history in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGoToHistory}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Go to Payout History Now
            </button>
          </div>
        )}

        {/* Error State */}
        {!loading && !success && error && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToHistory}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                Go to Payout History
              </button>
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
