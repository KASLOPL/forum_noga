import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const AppProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState('reset');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <AppContext.Provider value={{ 
      email, setEmail, currentStep, setCurrentStep, newPassword, setNewPassword, confirmPassword, setConfirmPassword}}>
      {children}
    </AppContext.Provider>
  );
};

const ResetPasswordStep = () => {
  const { email, setEmail, setCurrentStep } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = () => {
    setCurrentStep('check-email');
  };

  const handleBack = () => {
    navigate('/logowanie');
  };

  return (
    <div className="container">
      <div className="card">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="header">
          <h1 className="title">Reset Password</h1>
          <p className="description">
            Forgot password? No problem, enter your email address and we will send you the link!
          </p>
        </div>
        <div className="form-container">
          <div className="label">Address email</div>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Write your email"
          />
          <button className="button" onClick={handleSubmit}>Reset password</button>
        </div>
      </div>
    </div>
  );
};

const CheckEmailStep = () => {
  const { email, setCurrentStep } = useAppContext();
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/logowanie');
  };

  const handleBack = () => {
    setCurrentStep('reset');
  };

  return (
    <div className="container">
      <div className="card">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="header">
          <h1 className="title">Check your email</h1>
          <p className="description">
            If an account exists for a {email} you will receive an email with a reset password link.
          </p>
          <p className="description">
            Check your inbox and follow the reset password link.
          </p>
        </div>
        <div className="form-container">
          <button className="button-secondary" onClick={handleReturnToLogin}>
            Return to login
          </button>
        </div>
      </div>
    </div>
  );
};

const SetNewPasswordStep = () => {
  const { newPassword, setNewPassword, confirmPassword, setConfirmPassword } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      navigate('/logowanie');
    }
  };

  const handleReturnToLogin = () => {
    navigate('/logowanie');
  };

  const handleBack = () => {
    navigate('/logowanie');
  };

  return (
    <div className="container">
      <div className="card">
        <button className="back-button" onClick={handleBack}>←</button>
        <div className="header">
          <h1 className="title">Set new password</h1>
        </div>
        <div className="form-container">
          <div className="label">New password</div>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <div className="label">Confirm password</div>
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <button className="button" onClick={handleSubmit}>Set password</button>
          <button className="button-secondary" onClick={handleReturnToLogin}>
            Return to login
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponent renderujący odpowiedni krok
const Steps = () => {
  const { currentStep } = useAppContext();
  switch (currentStep) {
    case 'reset':
      return <ResetPasswordStep />;
    case 'check-email':
      return <CheckEmailStep />;
    case 'set-password':
      return <SetNewPasswordStep />;
    default:
      return <ResetPasswordStep />;
  }
};

const App = () => (
  <div className="reset-pass">
    <AppProvider>
      <Steps />
    </AppProvider>
  </div>
);

export default App;