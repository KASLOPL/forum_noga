import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./main.css";
import defaultQuestions from '../../data/questions';

import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap
} from "react-icons/fi";

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(b => b.id === item.id);
      return isBookmarked 
        ? prev.filter(b => b.id !== item.id) 
        : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);
  return { toggleBookmark, isBookmarked };
};

function Main() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("questions");
    return saved ? JSON.parse(saved) : defaultQuestions;
  });

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleNavigation = useCallback((path) => navigate(path), [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleToggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  const handleBookmarkToggle = useCallback((question, e) => {
    e.stopPropagation();
    toggleBookmark(question);
  }, [toggleBookmark]);

  const handleCardClick = useCallback((question) => {
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };
console.log('questions:', questions, 'isArray:', Array.isArray(questions));
  return (
    <div className="caloscMain">
      <div className="app">
        <header className="header">
          <div className="header-container">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            <div className="search-group">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <input className="search-input" placeholder="Got a question? See if it's already asked!" type="text" />
                </div>
              </div>
              <button className="add-button" onClick={() => handleNavigation('/addquestion')}>
                <FiPlus />
              </button>
              <div className="sort-dropdown">
                <span>Sort by</span>
                <FiChevronDown />
              </div>
            </div>

            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-button"><FiMoon /></button>
              <button className="icon-button"><FiMail /></button>
              <div className="user-profile" onClick={() => handleNavigation('/profile')}>
                <div className="avatar">
                  <span>{getUserInitials()}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-role">Student</span>
                </div>
                <FiChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>
        </header>

        <div className="main-container">
          <aside className="sidebar">
            <div className="sidebar-content">
              <div className="add-question-button-container">
                <button className="add-question-button" onClick={() => handleNavigation('/addquestion')}>
                  <span>ADD QUESTION</span>
                  <div className="plus-icon-container"><FiPlus /></div>
                </button>
              </div>

              <nav className="sidebar-nav">
                <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); handleNavigation('/main'); }}><FiHome /><span>Home</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/notifications'); }}><FiMessageSquare /><span>Notifications</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/specialists'); }}><FiUsers /><span>Specialists</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/my_questions'); }}><FiUser /><span>My Questions</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/zakładki'); }}><FiBookmark /><span>Bookmarks</span></a>
              </nav>

              <div className="sidebar-nav-secondary">
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/settings'); }}><FiSettings /><span>Settings</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavigation('/help'); }}><FiHelpCircle /><span>Help & FAQ</span></a>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="sign-out-button" onClick={handleLogout}>
                <FiLogOut /> Sign out
              </button>
            </div>
          </aside>

          <main className="main-content">
            <div className="welcome-banner">
              <h1>Hi, {getUserDisplayName()}!</h1>
              <p>
                Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!
              </p>
            </div>

            <div className="posts-count">{questions.length} posts</div>
            <div className="question-cards-container">
              <div className="question-cards">
                {Array.isArray(questions) && questions.map((question) => (
                  <div 
                    key={question.id} 
                    className="question-card"
                    onClick={() => handleCardClick(question)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="question-card-header" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="question-author">
                        <div className="avatar">
                          <span>{question.author?.substring(0, 2).toUpperCase() || '??'}</span>
                        </div>
                        <div className="author-info">
                          <div className="author-name">{question.author || 'Unknown Author'}</div>
                          <div className="author-time">{question.timeAgo}</div>
                        </div>
                      </div>
                      <div className="question-actions">
                        <button 
                          className={`icon-button ${isBookmarked(question.id) ? 'bookmarked' : ''}`}
                          onClick={(e) => handleBookmarkToggle(question, e)}
                        >
                          <FiBookmark style={{ fill: isBookmarked(question.id) ? '#4CAF50' : 'none' }} />
                        </button>
                        <button className="icon-button" onClick={(e) => { e.stopPropagation(); }}><FiMoreVertical /></button> 
                      </div>
                    </div>

                    <div className="question-highlight"><h3>{question.highlight}</h3></div>

                    <div className="question-content">
                      <p>{expandedQuestion === question.id ? question.fullContent : question.content}</p>
                      <button className="expand-button" onClick={(e) => handleToggleQuestion(question.id, e)}>
                        {expandedQuestion === question.id ? <><span>Show less</span><FiChevronUp /></> : <><span>Read more</span><FiChevronDown /></>}
                      </button>
                    </div>

                    <div className="question-footer" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="question-responders">
                        {Array.from({ length: question.responders }, (_, i) => (
                          <div key={i} className="avatar avatar-small"><span>{String.fromCharCode(65 + i)}</span></div>
                        ))}
                      </div>

                      <div className="question-stats">
                        <div className="stat"><FiHeart className="heart-icon" /><span>{question.likes}</span></div>
                        <div className="stat"><FiEye /><span>{question.views}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="right-sidebar">
            <div className="experts-section">
              <h3>Top Experts</h3>
              <div className="experts-list">
                {[
                  { name: "Dr. Sarah Chen", specialty: "Machine Learning" },
                  { name: "Mike Johnson", specialty: "Web Development" },
                  { name: "Lisa Park", specialty: "Data Science" },
                  { name: "David Kim", specialty: "Mobile Apps" },
                  { name: "Emma Wilson", specialty: "UI/UX Design" },
                  { name: "Alex Rodriguez", specialty: "DevOps" }
                ].map((expert, index) => (
                  <div key={index} className="expert-item">
                    <div className="avatar avatar-small"><span>{expert.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="expert-details">
                      <div className="expert-name">{expert.name}</div>
                      <div className="expert-specialty">{expert.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tags-section">
              <h3>Popular Tags</h3>
              <div className="tags-list">
                {["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript", "CSS", "Machine Learning", "SQL", "Node.js"].map(tag => (
                  <div key={tag} className="tag tag-clickable">{tag}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Main;
