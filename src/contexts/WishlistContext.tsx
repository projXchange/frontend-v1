import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Project } from '../types/Project';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api'

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (project: Project) => Promise<void>;
  removeFromWishlist: (projectId: string) => Promise<void>;
  isInWishlist: (projectId: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    }
    if (!isAuthenticated) {
      clearWishlist();
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/wishlist'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } else {
        // If API fails, try to load from localStorage as fallback
        const stored = localStorage.getItem(`wishlist_${user.id}`);
        if (stored) {
          setWishlist(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem(`wishlist_${user.id}`);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (project: Project) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (isInWishlist(project.id)) {
      toast.error('Project already in wishlist');
      return;
    }

    setLoading(true);
    try {
      const wishlistItem: Omit<WishlistItem, 'id'> = {
        project_id: project.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        project: project,
      };

      // Try to save to backend first
      const response = await fetch(getApiUrl('/wishlist'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wishlistItem),
      });

      if (response.ok) {
        const data = await response.json();
        const newItem: WishlistItem = { ...wishlistItem, id: data.id };
        setWishlist(prev => [...prev, newItem]);
        toast.success('Added to wishlist!');
      } else {
        // If backend fails, save to localStorage
        const newItem: WishlistItem = { ...wishlistItem, id: Date.now().toString() };
        setWishlist(prev => [...prev, newItem]);
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify([...wishlist, newItem]));
        toast.success('Added to wishlist! (saved locally)');
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      // Fallback to localStorage
      const newItem: WishlistItem = {
        id: Date.now().toString(),
        project_id: project.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        project: project,
      };
      setWishlist(prev => [...prev, newItem]);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify([...wishlist, newItem]));
      toast.success('Added to wishlist! (saved locally)');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (projectId: string) => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const wishlistItem = wishlist.find(item => item.project_id === projectId);

      if (wishlistItem) {
        // Try to remove from backend first
        const response = await fetch(getApiUrl(`/wishlist/${wishlistItem.project_id}`), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setWishlist(prev => prev.filter(item => item.project_id !== projectId));
          toast.success('Removed from wishlist');
        } else {
          // If backend fails, remove from localStorage
          setWishlist(prev => prev.filter(item => item.project_id !== projectId));
          localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist.filter(item => item.project_id !== projectId)));
          toast.success('Removed from wishlist');
        }
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      // Fallback to localStorage
      setWishlist(prev => prev.filter(item => item.project_id !== projectId));
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist.filter(item => item.project_id !== projectId)));
      toast.success('Removed from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (projectId: string): boolean => {
    return wishlist.some(item => item.project_id === projectId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (user) {
      localStorage.removeItem(`wishlist_${user.id}`);
    }
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
