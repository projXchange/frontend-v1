import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay unmounting to allow animation
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div
        className={`bg-white w-full max-w-5xl rounded-xl shadow-xl relative transform transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        {/* Form Section */}
        {isLogin ? (
          <LoginForm
            isOpen={isOpen}
            onClose={onClose}
            onSwitchToSignup={() => setIsLogin(false)}
            onSuccess={onClose}
          />
        ) : (
          <SignupForm
            isOpen={isOpen}
            onClose={onClose}
            onSwitchToLogin={() => setIsLogin(true)}
            onSuccess={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
