import React, {useEffect, useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";

const LogoutContext = React.createContext();

export const useLogout = () => {
      const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogout must be used within a LogoutProvider');
  }
  return context;
}

export const LogoutProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
  <LogoutContext.Provider value={{ isLoggedIn, logout, setIsLoggedIn }}>
    {children}
  </LogoutContext.Provider>
);
}