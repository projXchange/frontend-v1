import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GirlPoster from '../assets/Girl_Poster.png';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode }) => {
  const { login, signup, resetPassword } = useAuth(); // Make sure these are implemented in your AuthContext
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = mode === 'signup' ? 'animate-slideInRight' : 'animate-slideInLeft';

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setEmail('');
      setName('');
      setPassword('');
      setErrorMsg('');
      setShowPassword(false);
      setMode(initialMode || 'signup');
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

  if (!email || (mode !== 'forgot' && !password)) {
    setErrorMsg('Please fill in all fields.');
    return;
  }

  if (mode === 'signup' && !name) {
    setErrorMsg('Please enter your full name.');
    return;
  }

  if (mode === 'signup' && password.length < 6) {
    setErrorMsg('Password must be at least 6 characters long.');
    return;
  }

  setLoading(true);

  try {
    let result: { success: boolean; message?: string } = { success: false };

    if (mode === 'signup') {
      result = await signup(name, email, password, 'student');
    } else if (mode === 'login') {
      result = await login(email, password);
    } else if (mode === 'forgot') {
      await resetPassword(email);
      setMode('login');
      setLoading(false);
      return;
    }

    if (result.success) {
      onSuccess();
      handleClose();
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message || `${mode === 'signup' ? 'Signup' : 'Login'} failed. Please try again.`);
    }
  } catch (err: any) {
    setErrorMsg(err.message || 'Something went wrong.');
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
              {mode === 'signup' ? 'Join the Future of' : 'Welcome Back to'}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              {mode === 'signup'
                ? 'Connect with thousands of students and access premium academic projects'
                : 'Access your projects, network, and resources in one place'}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {mode === 'signup'
                  ? 'Create Account'
                  : mode === 'login'
                  ? 'Welcome Back'
                  : 'Reset Password'}
              </h2>
              {mode !== 'forgot' && (
                <p className="text-gray-600 text-sm sm:text-base">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                  >
                    {mode === 'signup' ? 'Sign in here' : 'Sign up now'}
                  </button>
                </p>
              )}
            </div>

            <form onSubmit={handleAuthSubmit} className={`space-y-6 ${slideAnim}`}>
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-4 pr-12 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-shake text-sm text-red-600 font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:scale-105 disabled:opacity-70"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                  ? 'Create Account'
                  : mode === 'login'
                  ? 'Login'
                  : 'Send Reset Link'}
              </button>

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

            <div className="text-xs text-gray-500 text-center mt-8">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
