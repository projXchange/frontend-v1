import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ReferralProvider } from './contexts/ReferralContext';
import { PermissionProvider } from './contexts/PermissionContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
//import ErrorBoundary from './components/ErrorBound
import Home from './pages/Home';
import ProjectListing from './pages/ProjectListing';
import ProjectDetail from './pages/ProjectDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
//import UploadProject from './pages/UploadProject';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import HowItWorks from './pages/HowItWorks';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Community from './pages/Community';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import CommunityGuidelines from './pages/CommunityGuidelines';
import { Toaster } from 'react-hot-toast';
import EmailVerification from './pages/EmailVerification';
import PayoutVerification from './pages/PayoutVerification';
import PaymentMethods from './pages/PaymentMethods';
import PayoutBalance from './pages/PayoutBalance';
import PayoutHistory from './pages/PayoutHistory';
import AdminPayouts from './pages/AdminPayouts';
import UploadProjectNew from './pages/UploadProjectNew';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReferralProvider>
          <PermissionProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Router>
              <ScrollToTop />
              <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/projects" element={<ProjectListing />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            <Route path="/auth/verify-email/:token" element={<EmailVerification />} />
            <Route path="/payouts/verify/:token" element={<PayoutVerification />} />
            
            {/* Support Pages */}
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/community" element={<Community />} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                {/* <UploadProject /> */}
                <UploadProjectNew/>
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
            
            {/* Payout Routes */}
            <Route path="/payouts/methods" element={
              <ProtectedRoute>
                <PaymentMethods />
              </ProtectedRoute>
            } />
            <Route path="/payouts/balance" element={
              <ProtectedRoute>
                <PayoutBalance />
              </ProtectedRoute>
            } />
            <Route path="/payouts/history" element={
              <ProtectedRoute>
                <PayoutHistory />
              </ProtectedRoute>
            } />
            
            {/* Admin Payout Route */}
            <Route path="/admin/payouts" element={
              <ProtectedRoute requireAdmin>
                <AdminPayouts />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
        </PermissionProvider>
        </ReferralProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
