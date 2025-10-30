import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { WishlistProvider } from '../contexts/WishlistContext';
import { CartProvider } from '../contexts/CartContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Routes where providers should NOT mount
  const excludedPaths = ['/auth/reset-password', '/auth/verify-email'];
  const isExcluded = excludedPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '*';

  const Content = (
    <div className="min-h-screen bg-gray-50">
      {!isExcluded && <Navbar />}
      {children}
      {!isExcluded && <Footer />}
    </div>
  );

  if (!isExcluded) {
    return (
      <WishlistProvider>
        <CartProvider>{Content}</CartProvider>
      </WishlistProvider>
    );
  }

  return Content;
};

export default Layout;
