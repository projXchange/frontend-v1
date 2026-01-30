import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const referralCode = searchParams.get('ref');

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Redirect to home page when modal is closed
    navigate('/');
  };

  const handleAuthSuccess = () => {
    setIsModalOpen(false);
    // Redirect to dashboard after successful signup/login
    navigate('/dashboard');
  };

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <>
      {/* SEO and metadata */}
      <title>
        {referralCode
          ? `Join ProjXchange with Referral Code ${referralCode}`
          : 'Sign Up - ProjXchange'}
      </title>
      <meta
        name="description"
        content={
          referralCode
            ? `Join ProjXchange with referral code ${referralCode} and get bonus credits for free project downloads!`
            : 'Create your ProjXchange account and start downloading amazing projects for free!'
        }
      />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          <AuthModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleAuthSuccess}
            initialMode="signup"
          />
        </div>

        {/* Optional: Show a subtle indicator that this is a referral signup */}
        {referralCode && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-40">
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 shadow-lg backdrop-blur-sm">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                🎉 You're signing up with referral code: <span className="font-mono font-bold">{referralCode}</span>
              </p>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                You'll receive bonus credits after your first activity!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignupPage;