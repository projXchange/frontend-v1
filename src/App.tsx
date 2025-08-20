import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectListing from './pages/ProjectListing';
import ProjectDetail from './pages/ProjectDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UploadProject from './pages/UploadProject';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Toaster position="top-right" reverseOrder={false} />  
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectListing />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <UploadProject />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
             </Routes>
              <Footer/>
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;