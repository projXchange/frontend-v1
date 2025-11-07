import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Eye, Star, Tag, CreditCard, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRazorpayCheckout } from '../hooks/useRazorpayCheckout';

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, getCartCount, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { initiateCheckout, isProcessing } = useRazorpayCheckout();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {cart.length === 0
              ? "Your cart is empty. Start adding projects!"
              : `You have ${cart.length} project${cart.length === 1 ? '' : 's'} in your cart.`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h3>
            <p className="text-gray-600 mb-8">Start exploring projects and add them to your cart!</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="p-6 flex gap-6">
                    <img
                      src={item.project.thumbnail}
                      alt={item.project.title}
                      className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{item.project.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.project.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.project.tech_stack?.slice(0, 3).map((tech, i) => (
                              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium">
                                <Tag className="w-3 h-3" /> {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              4.8 ({item.project.purchase_count || 0} reviews)
                            </span>
                            <span>Category: {item.project.category}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">₹{item.project.pricing?.sale_price}</div>
                            {item.project.pricing?.original_price && item.project.pricing.original_price > item.project.pricing.sale_price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{item.project.pricing.original_price}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/project/${item.project.id}`}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" /> View
                            </Link>
                            <button
                              onClick={() => handleRemoveFromCart(item.project.id)}
                              className="px-3 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-200 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
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
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({getCartCount()})</span>
                    <span className="font-medium">{getCartCount()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-200"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">What's included?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Complete source code</li>
                      <li>• Documentation & setup guide</li>
                      <li>• Lifetime access</li>
                      <li>• Free updates</li>
                      <li>• 30-day money-back guarantee</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Secure Payment</h4>
                    </div>
                    <p className="text-sm text-green-800">
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
