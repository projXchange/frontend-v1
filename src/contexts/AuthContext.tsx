import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: 'student' | 'admin') => Promise<boolean>;
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

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@studystack.com',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-09-15'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@studystack.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-01-01'
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah@studystack.com',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-10-20'
  }
];

const mockPasswords: Record<string, string> = {
  'john@studystack.com': 'student123',
  'admin@studystack.com': 'admin123',
  'sarah@studystack.com': 'student123'
};

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

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch('https://projxchange-backend-v1.vercel.app/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    // Shape the user object based on your API response
    const loggedInUser = {
      id: data.user.id || '',
      name: data.user.full_name,
      email: data.user.email,
      role: data.user.role || 'student', // fallback role
      avatar: data.user.avatar || '',     // if available
      joinedDate: data.user.created_at || new Date().toISOString()
    };

    setUser(loggedInUser);
    localStorage.setItem('studystack_user', JSON.stringify(loggedInUser));

    if (data.token) {
      localStorage.setItem('token', data.token); // optional
    }

    return true;
  } catch (err) {
    console.error('Login Error:', err);
    return false;
  }
};

  const signup = async (
  name: string,
  email: string,
  password: string,
  role: 'student' | 'admin'
): Promise<boolean> => {
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
    if (!res.ok) throw new Error(data.message || 'Signup failed');

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
    return true;
  } catch (err) {
    console.error('Signup Error:', err);
    return false;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('studystack_user');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
