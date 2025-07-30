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
    await new Promise(resolve => setTimeout(resolve, 1000));
    const foundUser = mockUsers.find(u => u.email === email);
    const correctPassword = mockPasswords[email];

    if (foundUser && correctPassword === password) {
      setUser(foundUser);
      localStorage.setItem('studystack_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (mockUsers.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      joinedDate: new Date().toISOString()
    };

    mockUsers.push(newUser);
    mockPasswords[email] = password;
    setUser(newUser);
    localStorage.setItem('studystack_user', JSON.stringify(newUser));
    return true;
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
