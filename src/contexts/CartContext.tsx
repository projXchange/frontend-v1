import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Project } from '../types/Project';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api';
import { apiClient } from '../utils/apiClient';

interface CartContextType {
  cart: CartItem[];
  addToCart: (project: Project) => Promise<boolean>;
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
      clearLocalStorageCart();
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiClient(getApiUrl('/cart'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  const addToCart = async (project: Project): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    if (isInCart(project.id)) {
      toast.error('Project already in cart');
      return false;
    }

    setLoading(true);
    try {
      const response = await apiClient(getApiUrl('/cart'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: project.id, quantity: 1 }),
      });

      if (!response.ok) {
        const errData = await response.json();
        toast.error(errData.error || 'Failed to add to cart');
        return false; // <-- important
      }

      const data = await response.json();
      const newItem: CartItem = {
        id: data.id,
        project_id: project.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        project
      };
      setCart(prev => [...prev, newItem]);
      toast.success('Added to cart');
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Something went wrong while adding to cart');
      return false;
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
        const response = await apiClient(getApiUrl(`/cart/${cartItem.project_id}`), {
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

  const clearCart = async () => {

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await apiClient(getApiUrl('/cart'), {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to clear cart: ${errorText}`);
      }

      setCart([]);
      localStorage.removeItem(`cart_${user?.id}`);
      toast.success('Cart cleared successfully!');
    } catch (error) {
      console.error('Error clearing cart:', error);

      // Fallback: clear local cart anyway
      setCart([]);
      localStorage.removeItem(`cart_${user?.id}`);
      toast.success('Cart cleared locally (server unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const clearLocalStorageCart = async () => {
    setCart([]);
    localStorage.removeItem(`cart_${user?.id}`);
  }



  const getCartTotal = (): number => {
    return cart.reduce(
      (total, item) => total + (item.project.pricing?.sale_price ?? 0),
      0
    );
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
