import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GirlPoster from '../assets/Girl_Poster.png';
import { AuthResult } from '../types/User';

const AuthModal: React.FC<any> = ({ isOpen, onClose, onSuccess, initialMode }) => {
  const { login, signup, resetPassword,confirmResetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); // to get token if exists in URL

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = mode === 'signup' ? 'animate-slideInRight' : 'animate-slideInLeft';

  // Detect reset password token in URL (e.g., /reset-password/:token)
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/reset-password/')) {
      setMode('reset');
    }
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setEmail('');
      setName('');
      setPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setShowPassword(false);
      if (initialMode) setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    setLoading(true);
    try {
      let result: AuthResult = { success: false };

      if (mode === 'signup') {
        result = await signup(name, email, password, 'student');
      } else if (mode === 'login') {
        result = await login(email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent! Please check your email.');
        setMode('login');
        setLoading(false);
        return;
      } else if (mode === 'reset') {
        const token = location.pathname.split('/').pop();
        await confirmResetPassword(token!, password);
        setSuccessMsg('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
          setMode('login');
        }, 2000);
        setLoading(false);
        return;
      }
      if (result.success && result.user) {
        onSuccess();
        handleClose();
        if (result.user.user_type === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } else if (mode === 'login' || mode === 'signup') {
        setErrorMsg(result.message || `${mode === 'signup' ? 'Signup' : 'Login'} failed.`);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-4 transition-opacity duration-300 ease-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden relative transform transition-all duration-500 ease-in-out ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-600/90 z-10" />
          <img src={GirlPoster} alt="Join Community" className="w-full h-full object-cover object-top" />
          <div
            key={mode}
            className={`absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-8 py-12 text-center space-y-6 ${slideAnim}`}
          >
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              {mode === 'signup'
                ? 'Join the Future of'
                : mode === 'reset'
                ? 'Secure Your Account'
                : 'Welcome Back to'}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              {mode === 'reset'
                ? 'Set a new password to regain access to your account.'
                : 'Access your projects, connect, and grow together.'}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 px-6 py-10 sm:px-10 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-md mx-auto">
            <div key={mode} className={`text-center mb-6 sm:mb-8 ${slideAnim}`}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 capitalize">
                {mode === 'reset'
                  ? 'Reset Password'
                  : mode === 'forgot'
                  ? 'Forgot Password'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Login'}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit} className={`space-y-6 ${slideAnim}`}>
              {/* SIGNUP ONLY */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* EMAIL FIELD */}
              {(mode !== 'reset') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* PASSWORD FIELD */}
              {(mode !== 'forgot') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'reset' ? 'Enter new password' : 'Enter your password'}
                      className="w-full px-4 py-4 pr-12 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div className="text-right mt-2">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ERROR / SUCCESS MESSAGE */}
              {(errorMsg || successMsg) && (
                <div
                  className={`p-3 text-sm rounded-xl font-medium ${
                    successMsg
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}
                >
                  {errorMsg || successMsg}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 disabled:opacity-70"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                  ? 'Create Account'
                  : mode === 'login'
                  ? 'Login'
                  : mode === 'forgot'
                  ? 'Send Reset Link'
                  : 'Reset Password'}
              </button>

              {/* NAVIGATION */}
              {mode === 'forgot' && (
                <div className="text-sm text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
