import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Mock users database
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

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'john@studystack.com': 'student123',
  'admin@studystack.com': 'admin123',
  'sarah@studystack.com': 'student123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('studystack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

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

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};