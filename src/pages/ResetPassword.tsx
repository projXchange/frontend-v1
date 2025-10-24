import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import GirlPoster from '../assets/Girl_Poster.png';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    // try {
    //   await confirmResetPassword(token!, password);
    //   setSuccess(true);
    //   setMessage('Password reset successful! Redirecting to login...');
    //   setTimeout(() => navigate('/'), 2000);
    // } catch (err: any) {
    //   setMessage(err.response?.data?.message || 'Something went wrong.');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Panel (Image + Text) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-600/90 z-10" />
          <img
            src={GirlPoster}
            alt="Reset Password"
            className="w-full h-full object-cover object-top"
          />
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white px-8 py-12 text-center space-y-6"
          >
            <h2 className="text-4xl font-bold leading-tight">
              Secure Your Account
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Set a new password to regain access to your account and continue
              your academic journey.
            </p>
          </motion.div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full lg:w-1/2 px-6 py-10 sm:px-10 relative">
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto text-center"
          >
            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-gray-600 mb-4">{message}</p>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Reset Password
                </h2>
                <p className="text-gray-600 mb-8 text-sm sm:text-base">
                  Enter your new password to secure your account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-4 pr-12 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 text-sm rounded-xl font-medium ${
                        success
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-red-50 border border-red-200 text-red-600'
                      }`}
                    >
                      {message}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:scale-105 disabled:opacity-70"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
