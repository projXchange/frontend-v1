import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthResult, User } from '../types/User';
import { getApiUrl } from '../config/api';
import { registerTokenExpirationHandler } from '../utils/apiClient';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: 'student' | 'admin', referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<boolean>;
  confirmResetPassword: (token: string, password: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: (email: string) => Promise<void>;
  handleTokenExpiration: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAuthModalOpen: boolean;
  isLoginMode: boolean;
  openAuthModal: (isLogin?: boolean) => void;
  closeAuthModal: () => void;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('studystack_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // Handle token expiration - called by API client when token expires
  const handleTokenExpiration = () => {
    // Get current user ID before clearing
    const currentUserId = user?.id;

    // Clear user state
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('studystack_user');
    localStorage.removeItem('token');

    // Clear user-specific data
    if (currentUserId) {
      localStorage.removeItem(`wishlist_${currentUserId}`);
      localStorage.removeItem(`cart_${currentUserId}`);
    }

    // Show notification
    toast.error('Your session has expired. Please log in again.');

    // Open login modal
    openAuthModal(true);
  };

  // Register the token expiration handler with apiClient
  useEffect(() => {
    registerTokenExpirationHandler(handleTokenExpiration);
  }, []);
  


  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(getApiUrl('/auth/signin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error || 'Login failed' };
      }

      const loggedInUser = data.user;
      setUser(loggedInUser);
      localStorage.setItem('studystack_user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', data.refreshToken);

      
      toast.success('User Logged In Successfully');
      return { success: true, user: loggedInUser };
    } catch {
      toast.error('Something went wrong. Please try again.');
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'admin',
    referralCode?: string
  ): Promise<AuthResult> => {
    try {
      const requestBody: any = {
        email,
        password,
        full_name: name,
        user_type: role
      };

      // Include referral_code if provided
      if (referralCode) {
        requestBody.referral_code = referralCode;
      }

      const res = await fetch(getApiUrl('/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || data.error || 'Signup failed' };
      }

      // const newUser = data.user;
      // setUser(newUser);
      // localStorage.setItem('studystack_user', JSON.stringify(newUser));
      // localStorage.setItem('token', data.accessToken);

      const successMessage = referralCode 
        ? 'Account created! Please check your email to verify. You\'ll receive bonus credits after verification and your first purchase or upload.'
        : 'Account created! Please check your email to verify.';
      
      toast.success(successMessage);
      return { success: true, message: successMessage };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      
      const res = await fetch(getApiUrl('/auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Logout failed');
        return;
      }

      setUser(null);
      localStorage.removeItem('studystack_user');
      localStorage.removeItem('token');
      localStorage.removeItem(`wishlist_${user?.id}`);
      localStorage.removeItem(`cart_${user?.id}`);
      toast.success('User logged out successfully');
    } catch (err) {
      toast.error('Something went wrong while logging out');
    }
  };

  // ✅ 1. Forgot Password API
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to send reset email');
        return false;
      }

      toast.success(data.message || 'Password reset email sent successfully');
      return true;
    } catch (error) {
      console.error('Reset Password Error:', error);
      toast.error('Something went wrong while sending reset email');
      return false;
    }
  };

  // ✅ 2. Confirm Reset Password API
  const confirmResetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        getApiUrl(`/auth/reset-password/${token}`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to reset password');
        return false;
      }

      toast.success(data.message || 'Password reset successful!');
      return true;
    } catch (error) {
      console.error('Confirm Reset Password Error:', error);
      toast.error('Something went wrong while resetting password');
      return false;
    }
  };

  // Verify email with token
  const verifyEmail = async (token: string): Promise<AuthResult> => {
    try {
      const res = await fetch(getApiUrl(`/auth/verify-email/${token}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.error || 'Email verification failed');
        return { success: false, message: data.error || 'Email verification failed' };
      }
     
      toast.success('Email verified successfully');
      return { success: true, message: "Email verified successfully" };
  
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error('Something went wrong. Please try again.');
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };
    

// Resend verification email
const resendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await fetch(getApiUrl('/auth/resend-verification'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  } catch (error: any) {
    console.error('Failed to resend verification email:', error);
    throw error;
  }
};

  const openAuthModal = (isLogin: boolean = true) => {
    setIsLoginMode(isLogin);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    resetPassword,
    confirmResetPassword,
    verifyEmail,
    resendVerificationEmail,
    handleTokenExpiration,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === 'admin',
    isStudent: user?.user_type === 'student',
    isAuthModalOpen,
    isLoginMode,
    openAuthModal,
    closeAuthModal,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};