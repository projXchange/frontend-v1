import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // If no token in URL, redirect to home
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleClose = () => {
    setShowModal(false);
    // Redirect to home after closing modal
    navigate('/');
  };

  const handleSuccess = () => {
    setShowModal(false);
    // Redirect to dashboard or home after successful reset
    navigate('/');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthModal
        isOpen={showModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
        initialMode="reset"
      />
    </div>
  );
};

export default ResetPassword;