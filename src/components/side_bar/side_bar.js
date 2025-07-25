import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import {
  FiBookmark, FiHelpCircle, FiHome, FiLogOut, FiMessageSquare,
  FiPlus, FiSettings, FiUser, FiUsers
} from "react-icons/fi";
import './side_bar.css';
import { useLogout } from '../../hooks/logout';

const Sidebar = ({ onNotificationClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();
  const goTo = useCallback((path) => navigate(path), [navigate]);

  // Funkcja do sprawdzania czy link jest aktywny
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="add-question-section">
          <button className="add-question-btn" onClick={() => goTo('/addquestion')}>
            <span>ADD QUESTION</span>
            <div className="plus-icon"><FiPlus /></div>
          </button>
        </div>

        <nav className="nav">
          <a 
            href="#" 
            className={`nav-item ${isActive('/main') ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); goTo('/main'); }}
          >
            <FiHome /><span>Home</span>
          </a>
          
          <a 
            href="#" 
            className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNotificationClick?.(); }}
          >
            <FiMessageSquare /><span>Notifications</span>
          </a>
          
          <a 
            href="#" 
            className={`nav-item ${isActive('/my_questions') ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); goTo('/my_questions'); }}
          >
            <FiUser /><span>My Questions</span>
          </a>
          
          <a 
            href="#" 
            className={`nav-item ${isActive('/zakładki') ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); goTo('/zakładki'); }}
          >
            <FiBookmark /><span>Bookmarks</span>
          </a>
        </nav>

        <div className="nav-secondary">
          <a 
            href="#" 
            className={`nav-item ${isActive('/settings') ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); goTo('/settings'); }}
          >
            <FiSettings /><span>Settings</span>
          </a>
          
          <a 
            href="#" 
            className={`nav-item ${isActive('/help') ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); goTo('/help'); }}
          >
            <FiHelpCircle /><span>Help & FAQ</span>
          </a>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;