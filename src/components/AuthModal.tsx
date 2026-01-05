import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, Mail, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthResult } from '../types/User';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup' | 'forgot' | 'reset' | 'verify-pending' | 'verify-email';
  verificationToken?: string;
};

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode,
  verificationToken
}) => {
  const { login, signup, resetPassword, confirmResetPassword, resendVerificationEmail, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ token: string }>();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'verify-pending' | 'verify-email'>(initialMode || 'signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [referralCode, setReferralCode] = useState('');
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);

  // Handle email verification when token is provided
  useEffect(() => {
    if (verificationToken && mode === 'verify-email') {
      handleEmailVerification(verificationToken);
    }
  }, [verificationToken, mode]);

  // Extract referral code from URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, []);

  // Detect reset token in URL or initialMode
  useEffect(() => {
    if (initialMode === 'reset' || location.pathname.includes('/reset-password/')) {
      setMode('reset');
    } else if (initialMode === 'verify-email' || location.pathname.includes('/verify-email/')) {
      setMode('verify-email');
    }
  }, [location, initialMode]);

  // Auto-clear success message after 10 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 5000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or when successMsg changes
    }
  }, [errorMsg]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setEmail('');
      setName('');
      setPassword('');
      setShowPassword(false);
      setErrorMsg('');
      setSuccessMsg('');
      setVerifyStatus('loading');
      // Don't reset referral code if it came from URL
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.get('ref')) {
        setReferralCode('');
        setReferralCodeValid(null);
      }
      if (initialMode) setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const validateReferralCode = (code: string): boolean => {
    if (!code) {
      setReferralCodeValid(null);
      return false;
    }
    
    // Validate format: 8 alphanumeric characters
    const isValid = /^[A-Z0-9]{8}$/.test(code.toUpperCase());
    setReferralCodeValid(isValid);
    return isValid;
  };

  const handleReferralCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setReferralCode(upperValue);
    validateReferralCode(upperValue);
  };

  const handleEmailVerification = async (token: string) => {
    if (!token) {
      setVerifyStatus('error');
      setErrorMsg('Invalid verification link. No token provided.');
      return;
    }

    setVerifyStatus('loading');
    try {
      const result = await verifyEmail(token);

      if (result.success) {
        setVerifyStatus('success');
        setSuccessMsg('Email verified successfully! Redirecting to login...');

        // Wait 2 seconds before redirecting and closing modal
        setTimeout(() => {
          setMode('login');
          setVerifyStatus('loading'); // Reset verify status
          setSuccessMsg('Your email has been verified. Please login to continue.');
        }, 2000);
      } else {
        setVerifyStatus('error');
        setErrorMsg(result.message || 'Email verification failed. The link may be invalid or expired.');
      }
    } catch (error: any) {
      setVerifyStatus('error');
      setErrorMsg(error.response?.data?.message || 'Something went wrong during verification.');
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail) {
      setErrorMsg('No email address available for resending verification.');
      return;
    }

    setResendLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await resendVerificationEmail(pendingVerificationEmail);
      setSuccessMsg('Verification email resent! Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'reset' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const result: AuthResult = await signup(name, email, password, 'student', referralCode || undefined);
        if (result.success) {
          setPendingVerificationEmail(email);
          setMode('verify-pending');
          setSuccessMsg('Signup successful! Please check your email to verify your account.');
        } else {
          setErrorMsg(result.message || 'Signup failed.');
        }
      } else if (mode === 'login') {
        const result: AuthResult = await login(email, password);
        if (result.success && result.user) {
          onSuccess?.();
          handleClose();
          result.user.user_type === 'admin' ? navigate('/admin') : navigate('/dashboard');
        } else {
          if (result.message?.toLowerCase().includes('verify') || result.message?.toLowerCase().includes('verification')) {
            setPendingVerificationEmail(email);
            setMode('verify-pending');
            setErrorMsg(result.message || 'Please verify your email before logging in.');
          } else {
            setErrorMsg(result.message || 'Login failed.');
          }
        }
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent! Please check your email.');
        handleClose();
      } else if (mode === 'reset') {
        const token = params.token || location.pathname.split('/reset-password/')[1]?.split('/')[0];

        if (!token) {
          setErrorMsg('Invalid or missing reset token. Please request a new password reset link.');
          return;
        }

        const success = await confirmResetPassword(token, password);
        if (success) {
          setSuccessMsg('✅ Password reset successful! Redirecting to login...');
          setTimeout(() => {
            setMode('login');
            setSuccessMsg('Your password has been reset. Please login with your new password.');

          }, 2000);
        } else {
          setErrorMsg('Failed to reset password. The link may be expired or invalid.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 sm:px-4 transition-opacity duration-300 ease-out ${isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden relative transform transition-all duration-500 ease-in-out ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-600/90 z-10" />
          <img
            src="https://res.cloudinary.com/dmfh4f4yg/image/upload/v1761589602/users/0e34d7e5-2380-4c69-a536-5e22a0868004/jugtaeylh0aizw101pts.jpg"
            alt="Join Community"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-8 py-12 text-center space-y-6">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              {mode === 'signup'
                ? 'Join the Future of'
                : mode === 'reset'
                  ? 'Secure Your Account'
                  : mode === 'verify-pending' || mode === 'verify-email'
                    ? 'Almost There!'
                    : 'Welcome Back to'}
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Academic Success
              </span>
            </h2>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              {mode === 'reset'
                ? 'Set a new password to regain access to your account.'
                : mode === 'verify-pending' || mode === 'verify-email'
                  ? 'Verify your email to unlock your academic journey.'
                  : 'Access your projects, connect, and grow together.'}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 px-6 py-10 sm:px-10 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-md mx-auto">
            {/* Email Verification Screen */}
            {mode === 'verify-email' && (
              <div className="text-center space-y-6">
                {verifyStatus === 'loading' && (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Verifying Email
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your email...</p>
                  </>
                )}

                {verifyStatus === 'success' && (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Email Verified!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{successMsg}</p>
                  </>
                )}

                {verifyStatus === 'error' && (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Verification Failed
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMsg}</p>
                    <button
                      onClick={() => setMode('login')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                    >
                      Back to Login
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      You can request a new verification email from the login page
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Verification Pending Screen */}
            {mode === 'verify-pending' && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Check Your Email
                </h2>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We've sent a verification link to <strong className="text-gray-900 dark:text-gray-100">{pendingVerificationEmail}</strong>
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium mb-2">Next Steps:</p>
                  <ol className="text-left space-y-1 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the verification link</li>
                  </ol>
                </div>

                {successMsg && (
                  <div className="p-3 text-sm rounded-xl font-medium bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 text-sm rounded-xl font-medium bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the email?
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                    {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setMode('login');
                      setPendingVerificationEmail('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Regular Auth Forms */}
            {!['verify-pending', 'verify-email'].includes(mode) && (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 capitalize">
                    {mode === 'reset'
                      ? 'Reset Password'
                      : mode === 'forgot'
                        ? 'Forgot Password'
                        : mode === 'signup'
                          ? 'Create Account'
                          : 'Login'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Signup fields */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-4 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      />
                    </div>
                  )}

                  {/* Email */}
                  {mode !== 'reset' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-4 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      />
                    </div>
                  )}

                  {/* Password */}
                  {mode !== 'forgot' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {mode === 'reset' ? 'New Password' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={mode === 'reset' ? 'Enter new password' : 'Enter your password'}
                          required
                          className="w-full px-4 py-4 pr-12 border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {mode === 'login' && (
                        <div className="text-right mt-2">
                          <button
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Referral Code - Only for signup */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Referral Code (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => handleReferralCodeChange(e.target.value)}
                          placeholder="Enter referral code"
                          maxLength={8}
                          className={`w-full px-4 py-4 pr-12 border rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-colors ${
                            referralCodeValid === true
                              ? 'border-green-500 dark:border-green-400 focus:ring-green-500 dark:focus:ring-green-400'
                              : referralCodeValid === false
                              ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400'
                              : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400'
                          }`}
                        />
                        {referralCodeValid === true && (
                          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 dark:text-green-400" />
                        )}
                        {referralCodeValid === false && (
                          <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 dark:text-red-400" />
                        )}
                      </div>
                      {referralCodeValid === true && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                          🎉 Valid referral code! You'll receive bonus credits after your first purchase or upload.
                        </p>
                      )}
                      {referralCodeValid === false && referralCode && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Referral code must be 8 alphanumeric characters
                        </p>
                      )}
                    </div>
                  )}

                  {/* Messages */}
                  {(errorMsg || successMsg) && (
                    <div
                      className={`p-3 text-sm rounded-xl font-medium ${successMsg
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300'
                        }`}
                    >
                      {errorMsg || successMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 disabled:opacity-70 transition-transform"
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

                  {/* Back to login */}
                  {(mode === 'forgot' || mode === 'reset') && (
                    <div className="text-sm text-center mt-4">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}

                  {/* Switch between Login / Signup */}
                  <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
                    {mode === 'login' ? (
                      <p>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('signup')}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Register
                        </button>
                      </p>
                    ) : mode === 'signup' ? (
                      <p>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Login
                        </button>
                      </p>
                    ) : null}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;