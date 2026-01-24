import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Eye, Star, Tag, CreditCard, ArrowRight, Shield, Info, Download } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRazorpayCheckout } from '../hooks/useRazorpayCheckout';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { useCreditContext } from '../contexts/CreditContext';

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, getCartCount, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { initiateCheckout, isProcessing } = useRazorpayCheckout();
  const { flags, showCreditUI } = useFeatureFlags();
  const { creditBalance, downloadWithCredit, loading: creditLoading } = useCreditContext();

  const handleRemoveFromCart = async (projectId: string) => {
    await removeFromCart(projectId);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || cart.length === 0) {
      toast.error('Please login and add items to cart before checkout.');
      return;
    }

    await initiateCheckout();
  };

  const handleCreditCheckout = async () => {
    if (!isAuthenticated || cart.length === 0) {
      toast.error('Please login and add items to cart.');
      return;
    }

    const availableCredits = creditBalance?.total_available_credits || 0;
    const requiredCredits = cart.length;

    if (availableCredits < requiredCredits) {
      toast.error(`Insufficient credits. You need ${requiredCredits} credits but have ${availableCredits}.`);
      return;
    }

    try {
      // Download each project with credits
      for (const item of cart) {
        const downloadUrl = await downloadWithCredit(item.project.id);
        // Trigger download
        window.open(downloadUrl, '_blank');
      }

      toast.success(`Successfully downloaded ${cart.length} project(s) with credits!`);
      clearCart();
    } catch (error) {
      console.error('Credit checkout failed:', error);
      // Error already handled by downloadWithCredit
    }
  };

  // Check if user has enough credits for all cart items
  const availableCredits = creditBalance?.total_available_credits || 0;
  const requiredCredits = cart.length;
  const hasEnoughCredits = availableCredits >= requiredCredits;
  const showCreditUIForCart = showCreditUI && isAuthenticated;

  console.log('Cart Credit Check:', {
    availableCredits,
    requiredCredits,
    hasEnoughCredits,
    showCreditUIForCart,
    cartLength: cart.length
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 dark:text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base px-4">
            {cart.length === 0
              ? "Your cart is empty. Start adding projects!"
              : `You have ${cart.length} project${cart.length === 1 ? '' : 's'} in your cart.`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto px-4">
              {/* Animated Cart Icon */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <ShoppingCart className="w-20 h-20 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Your Cart is Empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Discover amazing projects and start building your collection!
              </p>

              {/* CTA Button */}
              <Link
                to="/projects"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Browse Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <img
                        src={item.project.thumbnail}
                        alt={item.project.title}
                        className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{item.project.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">{item.project.description}</p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                              {item.project.tech_stack?.slice(0, 3).map((tech, i) => (
                                <span key={i} className="flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                                  <Tag className="w-3 h-3" /> {tech}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                                4.8 ({item.project.purchase_count || 0} reviews)
                              </span>
                              <span className="hidden sm:inline">Category: {item.project.category}</span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                            <div className="text-left sm:text-right">
                              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">₹{item.project.pricing?.sale_price}</div>
                              {item.project.pricing?.original_price && item.project.pricing.original_price > item.project.pricing.sale_price && (
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ₹{item.project.pricing.original_price}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/project/${item.project.id}`}
                                className="px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm"
                              >
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">View</span>
                              </Link>
                              <button
                                onClick={() => handleRemoveFromCart(item.project.id)}
                                className="px-2.5 sm:px-3 py-1.5 sm:py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 lg:sticky lg:top-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Order Summary</h3>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400">
                    <span>Items ({getCartCount()})</span>
                    <span className="font-medium">{getCartCount()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400">
                    <span>Platform Fee</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-3 sm:pt-4">
                    <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      <span>Total</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {/* Show credit download option if user has enough credits */}
                  {showCreditUIForCart && hasEnoughCredits ? (
                    <>
                      <button
                        onClick={handleCreditCheckout}
                        disabled={creditLoading || loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">
                          {creditLoading ? 'Processing...' : `Download with ${requiredCredits} Credit${requiredCredits > 1 ? 's' : ''}`}
                        </span>
                      </button>

                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                        <p className="text-xs text-green-800 dark:text-green-300 text-center">
                          You have {availableCredits} credit{availableCredits !== 1 ? 's' : ''} available
                        </p>
                      </div>

                      <button
                        onClick={clearCart}
                        className="w-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
                      >
                        Clear Cart
                      </button>
                    </>
                  ) : !flags.REFERRAL_ONLY_MODE ? (
                    <>
                      {/* Show insufficient credits warning if credit UI is enabled but not enough credits */}
                      {showCreditUIForCart && !hasEnoughCredits && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30 mb-2">
                          <p className="text-xs text-yellow-800 dark:text-yellow-300 text-center">
                            Need {requiredCredits} credits. You have {availableCredits}. Use payment below.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing || loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="truncate">{isProcessing ? 'Processing...' : 'Proceed to Checkout'}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <button
                        onClick={clearCart}
                        className="w-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
                      >
                        Clear Cart
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-1">
                              Credit-Only Mode Active
                            </h4>
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                              During our launch period, projects can be downloaded using credits earned through referrals and bonuses. Payment checkout is temporarily unavailable.
                            </p>
                          </div>
                        </div>
                      </div>

                      {showCreditUIForCart && !hasEnoughCredits && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                          <p className="text-xs text-yellow-800 dark:text-yellow-300 text-center">
                            Need {requiredCredits} credits. You have {availableCredits}. Earn more through referrals!
                          </p>
                        </div>
                      )}

                      <button
                        onClick={clearCart}
                        className="w-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
                      >
                        Clear Cart
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <h4 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-300 mb-2">What's included?</h4>
                    <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Complete source code</li>
                      <li>• Documentation & setup guide</li>
                      <li>• Lifetime access</li>
                      <li>• Free updates</li>
                      <li>• 30-day money-back guarantee</li>
                    </ul>
                  </div>

                  <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-sm sm:text-base text-green-900 dark:text-green-300">Secure Payment</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-green-800 dark:text-green-300">
                      Powered by Razorpay - PCI DSS compliant payment gateway
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
