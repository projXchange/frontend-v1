import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthResult, User } from '../types/User';


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
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
   }
  }, []);


  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error || 'Login failed' };
      }

      const loggedInUser: User = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        user_type: data.user.user_type,
        verification_status: data.user.verification_status,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
        email_verified: data.user.email_verified,
        //if avatar is blank or null, use default avatar
        //default avatar is https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80
        avatar: data.user.avatar === '' || data.user.avatar === null
          ? 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'
          : data.user.avatar,
      };

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
    role: 'student' | 'admin'
  ): Promise<AuthResult> => {
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          user_type: role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || data.error || 'Signup failed' };
      }

      const newUser: User = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        user_type: data.user.user_type,
        verification_status: data.user.verification_status,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
        email_verified: data.user.email_verified,
        avatar: data.user.avatar === '' || data.user.avatar === null
          ? 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80'
          : data.user.avatar,
      };

      setUser(newUser);
      localStorage.setItem('studystack_user', JSON.stringify(newUser));
      localStorage.setItem('token', data.accessToken);

      // Create default profile entry
      await fetch('https://projxchange-backend-v1.vercel.app/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.accessToken}`
        },
        body: JSON.stringify({
          id: data.user.id,
          rating: 0,
          total_sales: 0,
          total_purchases: 0,
          experience_level: "beginner",
          avatar: "",
          bio: "",
          location: "",
          website: "",
          social_links: {
            additionalProp1: "",
            additionalProp2: "",
            additionalProp3: ""
          },
          skills: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "active"
        })
      });


      toast.success('User Created Successfully');
      return { success: true, user: newUser };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');

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
    isAdmin: user?.user_type === 'admin',
    isStudent: user?.user_type === 'student',
    isAuthModalOpen,
    isLoginMode,
    openAuthModal,
    closeAuthModal
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