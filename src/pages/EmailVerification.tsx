import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // If no token, redirect to home
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Redirect to home when modal closes
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <AuthModal
      isOpen={isModalOpen}
      onClose={handleClose}
      initialMode="verify-email"
      verificationToken={token}
    />
  );
};

export default EmailVerification;