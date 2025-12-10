import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Upload,
  Home,
  Grid3X3,
  Settings,
  LogOut,
  Heart,
  ShoppingCart,
  Gauge,
  FolderOpenDot,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    isAuthModalOpen,
    isLoginMode,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  let getCartCount = () => 0;
  try {
    const cart = useCart();
    getCartCount = cart.getCartCount;
  } catch { }

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // ✅ Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Grid3X3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-teal-400">
                projXchange
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                  }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/dashboard")
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Gauge className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/admin")
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Gauge className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                to="/projects"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/projects")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                  }`}
              >
                <span>Projects</span>
              </Link>

              {/* Theme Toggle - Available for all users */}
              <ThemeToggle />

              {isAuthenticated && (
                <>
                  {/* Sell */}
                  <Link
                    to="/upload"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/upload")
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Sell</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className={`relative p-2 rounded-full transition-colors group ${isActive("/wishlist")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition ${isActive("/wishlist") ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 dark:bg-slate-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Wishlist
                    </span>
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className={`relative p-2 rounded-full transition-colors group ${isActive("/cart")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    <ShoppingCart
                      className={`w-5 h-5 transition ${isActive("/cart") ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                    />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {getCartCount()}
                      </span>
                    )}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs bg-gray-800 dark:bg-slate-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Cart
                    </span>
                  </Link>

                  {/* Profile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <img
                        src={
                          user?.avatar ||
                          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&q=80"
                        }
                        alt={user?.full_name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.full_name}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                user?.avatar ||
                                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&q=80"
                              }
                              alt={user?.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100">
                                {user?.full_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                                {user?.user_type}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive("/profile")
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                              }`}
                          >
                            <User className="w-4 h-4 mr-3" /> Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
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
                    onClick={() => openAuthModal(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 transition-all"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* ✅ Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-2 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-4 space-y-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 transition-colors ${isActive("/")
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className={`w-5 h-5 mr-2 ${isActive("/") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                Home
              </Link>
              <Link
                to="/projects"
                className={`flex items-center px-4 py-3 transition-colors ${isActive("/projects")
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpenDot className={`w-5 h-5 mr-2 ${isActive("/projects") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                Projects
              </Link>

              {/* Theme Toggle Mobile */}
              <div className="flex items-center justify-center px-4 py-3 border-t border-gray-200 dark:border-slate-700">
                <ThemeToggle />
              </div>

              {isAuthenticated && (
                <>
                  <Link
                    to="/upload"
                    className={`flex items-center px-4 py-3 transition-colors ${isActive("/upload")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className={`w-5 h-5 mr-2 ${isActive("/upload") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                    Sell Project
                  </Link>

                  {/* ✅ Wishlist */}
                  <Link
                    to="/wishlist"
                    className={`flex items-center px-4 py-3 transition-colors ${isActive("/wishlist")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isActive("/wishlist") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                    Wishlist
                  </Link>

                  {/* ✅ Cart */}
                  <Link
                    to="/cart"
                    className={`flex items-center px-4 py-3 transition-colors ${isActive("/cart")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className={`w-5 h-5 mr-2 ${isActive("/cart") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                    Cart
                    {getCartCount() > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-red-500 dark:bg-red-600 text-white rounded-full">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 transition-colors ${isActive("/dashboard")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Gauge className={`w-5 h-5 mr-2 ${isActive("/dashboard") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center px-4 py-3 transition-colors ${isActive("/admin")
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Gauge className={`w-5 h-5 mr-2 ${isActive("/admin") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 transition-colors ${isActive("/profile")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className={`w-5 h-5 mr-2 ${isActive("/profile") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => openAuthModal(true)}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal(false)}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                    Join Now
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </nav>

      {/* Profile Dropdown Backdrop */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={isLoginMode ? "login" : "signup"}
        onSuccess={closeAuthModal}
      />
    </>
  );
};

export default Navbar;
