import React from 'react';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  FiBookmark, FiHelpCircle, FiHome, FiLogOut, FiMessageSquare,
  FiPlus, FiSettings, FiUser, FiUsers
} from "react-icons/fi";
import './side_bar.css';

const Sidebar = ({ onNotificationClick }) => {
  const navigate = useNavigate();

  const goTo = useCallback((path) => navigate(path), [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('likedQuestions');
    navigate('/', { replace: true });
  }, [navigate]);

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
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); goTo('/main'); }}>
            <FiHome /><span>Home</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNotificationClick?.(); }}>
            <FiMessageSquare /><span>Notifications</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/specialists'); }}>
            <FiUsers /><span>Specialists</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/my_questions'); }}>
            <FiUser /><span>My Questions</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/zakładki'); }}>
            <FiBookmark /><span>Bookmarks</span>
          </a>
        </nav>

        <div className="nav-secondary">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/settings'); }}>
            <FiSettings /><span>Settings</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/help'); }}>
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