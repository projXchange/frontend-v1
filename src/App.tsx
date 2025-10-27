import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';

// Create a Layout component to handle conditional rendering
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isNotFoundPage = !['/', '/projects', '/dashboard', '/admin', '/upload', '/wishlist', '/cart'].some(path => 
    location.pathname === path || 
    location.pathname.startsWith('/project/')
  );
    location.pathname.startsWith('/auth/reset-password/')
  

  return (
    <div className="min-h-screen bg-gray-50">
      {!isNotFoundPage && <Navbar />}
      {children}
      {!isNotFoundPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Toaster position="top-right" reverseOrder={false} />  
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectListing />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="auth/reset-password/:token" element={<ResetPassword />} />

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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;