import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectListing from './pages/ProjectListing';
import ProjectDetail from './pages/ProjectDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UploadProject from './pages/UploadProject';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
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
         </Routes>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;