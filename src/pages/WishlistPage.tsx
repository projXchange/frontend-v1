import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Eye, Star, Tag, Flame } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleRemoveFromWishlist = async (projectId: string) => {
    await removeFromWishlist(projectId);
  };

  const handleAddToCart = async (project: any) => {
    if (isInCart(project.id)) {
      toast.error('Project already in cart');
      return;
    }
    await addToCart(project);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 dark:text-gray-400">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base px-4">
            {wishlist.length === 0
              ? "Your wishlist is empty. Start adding projects you love!"
              : `You have ${wishlist.length} project${wishlist.length === 1 ? '' : 's'} in your wishlist.`}
          </p>
        </div>
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No items in wishlist</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Start exploring projects and add them to your wishlist!</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {wishlist.map((item) => (
              <div key={item.id}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.project.thumbnail}
                    alt={item.project.title}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                      {item.project.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {item.project.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Remove from Wishlist Button */}
                  <button
                    className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-900/50 transition z-20 shadow"
                    title="Remove from wishlist"
                    type="button"
                    onClick={() => handleRemoveFromWishlist(item.project.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">4.8</span>
                      <span className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">({item.project.purchase_count || 0})</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                    {item.project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {item.project.description.length > 100
                      ? `${item.project.description.substring(0, 100)}...`
                      : item.project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {item.project.tech_stack?.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-[10px] sm:text-xs font-medium"
                      >
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    {item.project?.pricing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">
                          ₹{item.project.pricing.sale_price}
                        </span>

                        {item.project.pricing.original_price > item.project.pricing.sale_price &&
                          item.project.pricing.original_price !== 0 && (
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                              ₹{item.project.pricing.original_price}
                            </span>
                          )}
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Price not available</div>
                    )}

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400">
                      {item.project?.purchase_count || 0} sales
                    </div>
                  </div>


                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleAddToCart(item.project)}
                      disabled={isInCart(item.project.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm ${isInCart(item.project.id)
                        ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow hover:shadow-lg hover:scale-105'
                        }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{isInCart(item.project.id) ? 'In Cart' : 'Add to Cart'}</span>
                      <span className="sm:hidden">{isInCart(item.project.id) ? 'In Cart' : 'Add'}</span>
                    </button>
                    <Link
                      to={`/project/${item.project.id}`}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>

                  <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
                    Added {new Date(item.added_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
