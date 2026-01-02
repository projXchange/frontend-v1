import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  Save,
  Send,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingNumber from '../components/LoadingNumber';
import RequestPayoutModal from '../components/RequestPayoutModal';
import {
  getBalanceAndSettings,
  updatePayoutSettings,
  getPaymentMethods,
} from '../services/payoutService';
import type {
  Balance,
  PayoutSettings,
  PaymentMethod,
  Payout,
} from '../types/Payout';

export default function PayoutBalance() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [settings, setSettings] = useState<PayoutSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [isRequestPayoutModalOpen, setIsRequestPayoutModalOpen] = useState(false);

  // Settings form state
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(false);
  const [minimumAmount, setMinimumAmount] = useState('100');
  const [minimumAmountError, setMinimumAmountError] = useState('');

  // Fetch balance, settings, and payment methods on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update form state when settings are loaded
  useEffect(() => {
    if (settings) {
      setAutoPayoutEnabled(settings.auto_payout_enabled);
      setMinimumAmount(settings.minimum_payout_amount);
    }
  }, [settings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch balance and settings
      const balanceData = await getBalanceAndSettings();
      setBalance(balanceData.balance);
      setSettings(balanceData.settings);
      
      // Fetch payment methods
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.error || err.message || 'Failed to load balance data');
    } finally {
      setLoading(false);
    }
  };

  const handleMinimumAmountChange = (value: string) => {
    setMinimumAmount(value);
    setMinimumAmountError('');
    setSettingsSuccess(false);
    
    // Validate minimum amount
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 100) {
      setMinimumAmountError('Minimum payout amount must be at least ₹100');
    }
  };

  const handleSaveSettings = async () => {
    // Validate before saving
    const amount = parseFloat(minimumAmount);
    if (isNaN(amount) || amount < 100) {
      setMinimumAmountError('Minimum payout amount must be at least ₹100');
      return;
    }

    try {
      setSavingSettings(true);
      setSettingsError('');
      setSettingsSuccess(false);
      
      const updatedSettings = await updatePayoutSettings({
        auto_payout_enabled: autoPayoutEnabled,
        minimum_payout_amount: amount,
      });
      
      setSettings(updatedSettings);
      setSettingsSuccess(true);
      toast.success('Settings saved successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to save settings';
      setSettingsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRequestPayoutSuccess = (_payout: Payout) => {
    // Refresh balance data after successful payout request
    fetchData();
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const availableBalance = balance ? parseFloat(balance.available_balance) : 0;
  const minimumAmountNum = parseFloat(minimumAmount);
  const canRequestPayout = availableBalance >= minimumAmountNum && paymentMethods.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payout Balance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your earnings and payout settings
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

        {/* Balance Cards - Responsive: stacks on mobile, 2 cols on tablet, 4 cols on desktop */}
        <section aria-label="Balance overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Available Balance */}
          <article className="bg-gradient-to-br from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 opacity-90" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium opacity-90">Available</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">
              <LoadingNumber
                value={balance ? formatCurrency(balance.available_balance) : '₹0.00'}
                isLoading={loading}
                className="text-white"
              />
            </div>
            <p className="text-xs sm:text-sm opacity-75">Ready to withdraw</p>
          </article>

          {/* Pending Payouts */}
          <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              <LoadingNumber
                value={balance ? formatCurrency(balance.pending_payouts) : '₹0.00'}
                isLoading={loading}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">In processing</p>
          </article>

          {/* Total Earnings */}
          <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-500" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              <LoadingNumber
                value={balance ? formatCurrency(balance.total_earnings) : '₹0.00'}
                isLoading={loading}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">All time</p>
          </article>

          {/* Total Payouts */}
          <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-500" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Payouts
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              <LoadingNumber
                value={balance ? formatCurrency(balance.total_payouts) : '₹0.00'}
                isLoading={loading}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Withdrawn</p>
          </article>
        </section>

        {/* Last Payout Info */}
        {balance?.last_payout_at && (
          <aside 
            className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3"
            aria-label="Last payout information"
          >
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Last payout: <span className="font-semibold">{formatDate(balance.last_payout_at)}</span>
            </p>
          </aside>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Payout Settings Section */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Payout Settings
            </h2>

            {/* Settings Error */}
            {settingsError && (
              <div 
                role="alert" 
                aria-live="polite"
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-red-800 dark:text-red-300">{settingsError}</p>
              </div>
            )}

            {/* Settings Success */}
            {settingsSuccess && (
              <div 
                role="status" 
                aria-live="polite"
                className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2"
              >
                <Save className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-green-800 dark:text-green-300">
                  Settings saved successfully
                </p>
              </div>
            )}

            {/* Auto-payout Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="auto-payout"
                  className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                  Auto-payout
                </label>
                <button
                  id="auto-payout"
                  type="button"
                  role="switch"
                  aria-checked={autoPayoutEnabled}
                  onClick={() => {
                    setAutoPayoutEnabled(!autoPayoutEnabled);
                    setSettingsSuccess(false);
                  }}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    autoPayoutEnabled
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : 'bg-gray-300 dark:bg-slate-700'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoPayoutEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically request payouts when balance exceeds minimum amount
              </p>
            </div>

            {/* Minimum Amount Input */}
            <div className="mb-6">
              <label
                htmlFor="minimum-amount"
                className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                Minimum payout amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
                <input
                  id="minimum-amount"
                  type="number"
                  min="100"
                  step="1"
                  value={minimumAmount}
                  onChange={(e) => handleMinimumAmountChange(e.target.value)}
                  disabled={loading}
                  className={`w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border ${
                    minimumAmountError
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-gray-300 dark:border-slate-600'
                  } rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              {minimumAmountError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {minimumAmountError}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Minimum amount must be at least ₹100
              </p>
            </div>

            {/* Save Settings Button - Ensure min 44px height for mobile tappability */}
            <button
              onClick={handleSaveSettings}
              disabled={loading || savingSettings || !!minimumAmountError}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gray-900 dark:bg-slate-800 text-white font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save payout settings"
            >
              <Save className="w-5 h-5" aria-hidden="true" />
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Request Payout Section */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Request Payout
            </h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Available Balance
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <LoadingNumber
                    value={balance ? formatCurrency(balance.available_balance) : '₹0.00'}
                    isLoading={loading}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Minimum Amount
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(minimumAmount)}
                </span>
              </div>
            </div>

            {/* Payment Methods Check */}
            {paymentMethods.length === 0 && !loading && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  You need to add a payment method before requesting a payout.
                </p>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {availableBalance < minimumAmountNum && paymentMethods.length > 0 && !loading && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Your available balance is below the minimum payout amount.
                </p>
              </div>
            )}

            {/* Request Payout Button - Ensure min 44px height for mobile tappability */}
            <button
              onClick={() => setIsRequestPayoutModalOpen(true)}
              disabled={loading || !canRequestPayout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Request payout"
              aria-disabled={loading || !canRequestPayout}
            >
              <Send className="w-5 h-5" aria-hidden="true" />
              Request Payout
            </button>

            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
              You will receive a verification email to confirm your payout request
            </p>
          </div>
        </div>

        {/* Request Payout Modal */}
        <RequestPayoutModal
          isOpen={isRequestPayoutModalOpen}
          onClose={() => setIsRequestPayoutModalOpen(false)}
          availableBalance={availableBalance}
          paymentMethods={paymentMethods}
          onSuccess={handleRequestPayoutSuccess}
        />
      </div>
    </main>
  );
}
