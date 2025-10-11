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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No items in wishlist</h3>
            <p className="text-gray-600 mb-8">Start exploring projects and add them to your wishlist!</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div key={item.id}
                className="bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.project.thumbnail}
                    alt={item.project.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
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
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-100 transition z-20 shadow"
                    title="Remove from wishlist"
                    type="button"
                    onClick={() => handleRemoveFromWishlist(item.project.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-semibold text-gray-800">4.8</span>
                      <span className="ml-1 text-sm text-gray-500">({item.project.purchase_count || 0})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                    {item.project.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {item.project.description.length > 100
                      ? `${item.project.description.substring(0, 100)}...`
                      : item.project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.project.tech_stack?.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium"
                      >
                        <Tag className="w-3 h-3" /> {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {item.project?.pricing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.project.pricing.sale_price}
                        </span>

                        {item.project.pricing.original_price > item.project.pricing.sale_price &&
                          item.project.pricing.original_price !== 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.project.pricing.original_price}
                            </span>
                          )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Price not available</div>
                    )}

                    <div className="text-sm text-gray-600">
                      {item.project?.purchase_count || 0} sales
                    </div>
                  </div>


                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(item.project)}
                      disabled={isInCart(item.project.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${isInCart(item.project.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow hover:shadow-lg hover:scale-105'
                        }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isInCart(item.project.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <Link
                      to={`/project/${item.project.id}`}
                      className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center">
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
