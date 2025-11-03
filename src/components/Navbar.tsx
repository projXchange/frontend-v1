import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, User, Upload, Home,
  Grid3X3, Settings, LogOut, Bell, Heart, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, isAuthModalOpen, isLoginMode, openAuthModal, closeAuthModal } = useAuth();
  let getCartCount = () => 0;
  try {
    const cart = useCart();
    getCartCount = cart.getCartCount;
  } catch {}
  

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Grid3X3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                projXchange
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/projects"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/projects') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <span>Projects</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/upload"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive('/upload') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Sell</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="relative p-2 hover:bg-blue-50 rounded-full transition group"
                  >
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Wishlist
                    </span>
                  </Link>

                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-blue-50 rounded-full transition group"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {getCartCount()}
                      </span>
                    )}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Cart
                    </span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition"
                    >
                      <img
                        src={user?.avatar || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'}
                        alt={user?.full_name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user?.avatar || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'}
                              alt={user?.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{user?.full_name}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                              <p className="text-xs text-blue-600 font-medium capitalize">
                                {user?.user_type}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          {!isAdmin && (
                            <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="w-4 h-4 mr-3" /> Dashboard
                          </Link>
                          )}
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Settings className="w-4 h-4 mr-3" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <LogOut className="w-4 h-4 mr-3" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal(true)} // false = signup

                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal(false)} // true = login

                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-teal-700 transition"
                  >
                    Join Now
                  </button>

                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden mt-2 bg-white border-t border-gray-200 py-4 space-y-2">
              <Link to="/" className="block px-4 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/projects" className="block px-4 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Projects</Link>
              {isAuthenticated && (
                <>
                  <Link to="/upload" className="block px-4 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Sell Project</Link>
                  {!isAdmin && (
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                 )}
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700">Logout</button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <button onClick={() => openAuthModal(true)} className="block px-4 py-2 text-gray-700">Sign In</button>
                  <button onClick={() => openAuthModal(false)} className="block px-4 py-2 text-blue-600 font-medium">Join Now</button>
                </>
              )}
            </div>
          )}
        </div>

        {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={isLoginMode ? 'login' : 'signup'}
        onSuccess={closeAuthModal}
      />

    </>
  );
};

export default Navbar;
