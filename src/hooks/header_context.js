import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};

export const HeaderProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [onBack, setOnBack] = useState(null);

  // Domyślne linki nawigacji
  const getDefaultNavLinks = (pathname) => {
    if (pathname && pathname.includes('profile')) {
      return [
        { icon: 'FiHome', text: 'Home', path: '/main' },
        { icon: 'FiBell', text: 'Notifications', path: '/notifications' },
        { icon: 'FiUsers', text: 'Specialists', path: '/specialists' },
        { icon: 'FiUser', text: 'My Questions', path: '/my_questions' },
        { icon: 'FiBookmark', text: 'Bookmarks', path: '/zakładki' }
      ];
    }
    return [
      { icon: 'FiHome', text: 'Home', path: '/main' },
      { icon: 'FiBell', text: 'Notifications', path: '/notifications' },
      { icon: 'FiBookOpen', text: 'Specialists', path: '/specialists' },
      { icon: 'FiMessageSquare', text: 'My Questions', path: '/my_questions' },
      { icon: 'FiBookmark', text: 'Bookmarks', path: '/zakładki' }
    ];
  };

  const updateHeaderConfig = (config) => {
    if (config.user !== undefined) setUser(config.user);
    if (config.navLinks !== undefined) setNavLinks(config.navLinks);
    if (config.showBack !== undefined) setShowBack(config.showBack);
    if (config.onBack !== undefined) setOnBack(() => config.onBack);
  };

  const value = {
    user,
    navLinks,
    showBack,
    onBack,
    updateHeaderConfig,
    getDefaultNavLinks
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
};

export { HeaderContext };