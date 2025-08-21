import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Project } from '../types/Project';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (project: Project) => Promise<void>;
  removeFromCart: (projectId: string) => Promise<void>;
  isInCart: (projectId: string) => boolean;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    }
    if (!isAuthenticated) {
      clearCart();
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || []);
      } else {
        // If API fails, try to load from localStorage as fallback
        const stored = localStorage.getItem(`cart_${user.id}`);
        if (stored) {
          setCart(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`cart_${user.id}`);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (project: Project) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (isInCart(project.id)) {
      toast.error('Project already in cart');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const cartItem: Omit<CartItem, 'id'> = {
        project_id: project.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        project: project,
      };

      // Try to save to backend first
      const response = await fetch('https://projxchange-backend-v1.vercel.app/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const data = await response.json();
        const newItem: CartItem = { ...cartItem, id: data.id };
        setCart(prev => [...prev, newItem]);
        toast.success('Added to cart!');
      } else {
        // If backend fails, save to localStorage
        const newItem: CartItem = { ...cartItem, id: Date.now().toString() };
        setCart(prev => [...prev, newItem]);
        localStorage.setItem(`cart_${user.id}`, JSON.stringify([...cart, newItem]));
        toast.success('Added to cart! (saved locally)');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Fallback to localStorage
      const newItem: CartItem = {
        id: Date.now().toString(),
        project_id: project.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        project: project,
      };
      setCart(prev => [...prev, newItem]);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify([...cart, newItem]));
      toast.success('Added to cart! (saved locally)');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (projectId: string) => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const cartItem = cart.find(item => item.project_id === projectId);

      if (cartItem) {
        // Try to remove from backend first
        const response = await fetch(`https://projxchange-backend-v1.vercel.app/cart/${cartItem.project_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setCart(prev => prev.filter(item => item.project_id !== projectId));
          toast.success('Removed from cart');
        } else {
          // If backend fails, remove from localStorage
          setCart(prev => prev.filter(item => item.project_id !== projectId));
          localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart.filter(item => item.project_id !== projectId)));
          toast.success('Removed from cart');
        }
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Fallback to localStorage
      setCart(prev => prev.filter(item => item.project_id !== projectId));
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart.filter(item => item.project_id !== projectId)));
      toast.success('Removed from cart');
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (projectId: string): boolean => {
    return cart.some(item => item.project_id === projectId);
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.project.pricing.sale_price, 0);
  };

  const getCartCount = (): number => {
    return cart.length;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    getCartTotal,
    getCartCount,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
