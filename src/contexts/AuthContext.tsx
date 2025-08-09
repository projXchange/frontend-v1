import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: 'student' | 'admin') => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isAuthModalOpen: boolean;
  isLoginMode: boolean;
  openAuthModal: (isLogin?: boolean) => void;
  closeAuthModal: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('studystack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || 'Login failed';
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
      }

      // Shape the user object based on your API response
      const loggedInUser = {
        id: data.user.id || '',
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role || 'student', // fallback role
        avatar: data.user.avatar || '',
        joinedDate: data.user.created_at || new Date().toISOString()
      };

      setUser(loggedInUser);
      localStorage.setItem('studystack_user', JSON.stringify(loggedInUser));

      if (data.token) {
        localStorage.setItem('token', data.token); // optional
      }
      toast.success("User Logged In Successfuly..")
      return { success: true };
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Something went wrong. Please try again.');
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };


  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'admin'
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          username: email.split('@')[0], // or generate from name
          full_name: name
        })
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.message || data.error || 'Signup failed';
        return { success: false, message: errorMsg };
      }

      // You can shape this however your backend responds
      const newUser = {
        id: data.user.id || '',
        name: data.user.full_name,
        email: data.user.email,
        role,
        avatar: '', // or generate a default avatar
        joinedDate: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('studystack_user', JSON.stringify(newUser));
      toast.success("User Created Successfully")
      return { success: true, message: "" };
    } catch (err) {
      console.error('Signup Error:', err);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };


  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Logout failed');
        return;
      }

      // Clear local storage and user state
      setUser(null);
      localStorage.removeItem('studystack_user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      toast.success(data.message || 'User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Something went wrong while logging out');
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
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isAuthModalOpen,
    isLoginMode,
    openAuthModal,
    closeAuthModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/forgot-password', {
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


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
