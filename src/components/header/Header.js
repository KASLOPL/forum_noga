import React from 'react';
import './Header.css';
import { 
  FiArrowLeft, FiZap, FiChevronDown, FiBell, FiHome, 
  FiBookOpen, FiMessageSquare, FiBookmark, FiUsers, FiUser 
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHeader } from '../../hooks/header_context';

const iconMap = {
  'FiHome': <FiHome size={16} />,
  'FiBell': <FiBell size={16} />,
  'FiBookOpen': <FiBookOpen size={16} />,
  'FiMessageSquare': <FiMessageSquare size={16} />,
  'FiBookmark': <FiBookmark size={16} />,
  'FiUsers': <FiUsers size={16} />,
  'FiUser': <FiUser size={16} />
};

const Header = () => {
  const { user, navLinks, showBack, onBack, getDefaultNavLinks } = useHeader();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Pobierz usera z contextu lub localStorage
  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  })();

  const links = navLinks.length > 0 ? navLinks : getDefaultNavLinks(pathname);
  const handleNavClick = (path) => { if (path) navigate(path); };
  const getUserDisplayName = () => currentUser?.userName || currentUser?.name || 'Guest';
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header-main">
      <div className="navbar-main">
        <div className="left-section-main">
          {showBack && (
            <button className="back-button-main" onClick={onBack || (() => navigate(-1))}>
              <FiArrowLeft size={20} />
            </button>
          )}
          <div className="logo-container-main" onClick={() => handleNavClick('/main')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon-main"><FiZap size={20} /></span>
            <span className="logo-text-main">Snap<span className="logo-accent-main">solve</span></span>
          </div>
        </div>
        <nav className="nav-main">
          <ul>
            {links.map((link, i) => (
              <li key={i} className={location.pathname === link.path ? 'active' : ''}>
                {link.path ? (
                  <a
                    href={link.path}
                    onClick={e => {
                      e.preventDefault();
                      handleNavClick(link.path);
                    }}
                  >
                    {typeof link.icon === 'string' ? iconMap[link.icon] : link.icon}
                    {link.text}
                  </a>
                ) : (
                  <span>
                    {typeof link.icon === 'string' ? iconMap[link.icon] : link.icon}
                    {link.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="right-nav-main">
          <button className="icon-btn" style={{marginRight: 8}} onClick={() => handleNavClick('/notifications')}>
            <FiBell size={20} />
          </button>
          <div
            className="user-profile-main" onClick={() => handleNavClick('/profile')}
            role="button" style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleNavClick('/profile');
            }}
            aria-label="User profile"
          >
            <div className="avatar-main">
              <span>{getUserInitials()}</span>
            </div>
            <div className="user-info-main">
              <span className="user-name-main">{getUserDisplayName()}</span>
              <div className="role-main">Student</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 