import * as React from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FiBookmark,
  FiChevronDown,
  FiEye,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";

function Main() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon">
                <FiZap />
              </div>
              <span className="logo-text">
                Snap<span className="logo-text-highlight">solve</span>
              </span>
            </div>
            <button className="icon-button">
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V11.5C13 11.7761 12.7761 12 12.5 12H2.5C2.22386 12 2 11.7761 2 11.5V3.5ZM3 4V11H12V4H3ZM4 5.5C4 5.22386 4.22386 5 4.5 5H10.5C10.7761 5 11 5.22386 11 5.5C11 5.77614 10.7761 6 10.5 6H4.5C4.22386 6 4 5.77614 4 5.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4 9.5C4 9.22386 4.22386 9 4.5 9H10.5C10.7761 9 11 9.22386 11 9.5C11 9.77614 10.7761 10 10.5 10H4.5C4.22386 10 4 9.77614 4 9.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="search-container">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input className="search-input" placeholder="Got a question? See if it's already asked!" type="text" />
            </div>
          </div>

          <div className="header-actions">
            <button className="add-button" onClick={() => navigate('/addquestion')}>
              <FiPlus />
            </button>

            <div className="sort-dropdown">
              <span>Sort by</span>
              <FiChevronDown />
            </div>

            <div className="divider"></div>

            <button className="icon-button">
              <FiMoon />
            </button>

            <button className="icon-button">
              <FiMail />
            </button>

            <div className="user-profile">
              <div className="avatar">
                <span>{currentUser?.name?.substring(0, 2) || 'GU'}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser?.name || 'Guest'}</span>
                <span className="user-role">Student</span>
              </div>
              <FiChevronDown className="dropdown-icon" />
            </div>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <div className="add-question-button-container">
              <button className="add-question-button" onClick={() => navigate('/addquestion')}>
                <span>ADD QUESTION</span>
                <div className="plus-icon-container">
                  <FiPlus />
                </div>
              </button>
            </div>

            <nav className="sidebar-nav">
              <a href="#" className="nav-item active">
                <FiHome />
                <span>Home</span>
              </a>

              <a href="#" className="nav-item">
                <FiMessageSquare />
                <span>Notifications</span>
              </a>

              <a href="#" className="nav-item">
                <FiUsers />
                <span>Specialists</span>
              </a>

              <a href="#" className="nav-item">
                <FiUser />
                <span>My Questions</span>
              </a>

              <a href="#" className="nav-item" onClick={() => navigate('/zakładki')}>
                <FiBookmark />
                <span>Bookmarks</span>
              </a>
            </nav>

            <div className="sidebar-nav-secondary">
              <a href="#" className="nav-item" onClick={() => navigate('/settings')}>
                <FiSettings />
                <span>Settings</span>
              </a>

              <a href="#" className="nav-item" onClick={(e) => { e.preventDefault();navigate('/help');}}>
                <FiHelpCircle />
                <span>Help & FAQ</span>
              </a>
            </div>
          </div>

          <div className="sidebar-footer">
            <button className="sign-out-button" onClick={handleLogout}>
              <FiLogOut />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <h1>Hi, {currentUser?.name || 'Guest'}!</h1>
            <p>
              Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just
              solutions!
            </p>
          </div>

          <div className="posts-count">10 posts</div>

          {/* Question Cards */}
          <div className="question-cards">
            {[1, 2].map((item) => (
              <div key={item} className="question-card">
                <div className="question-card-header">
                  <div className="question-author">
                    <div className="avatar avatar-placeholder"></div>
                    <div className="placeholder-text">
                      <div className="placeholder-line-medium"></div>
                      <div className="placeholder-line-small"></div>
                    </div>
                  </div>
                  <div className="question-actions">
                    <button className="icon-button">
                      <FiBookmark />
                    </button>
                    <button className="icon-button">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>

                <div className="question-highlight">
                  <div className="placeholder-line-large"></div>
                </div>

                <div className="question-tags">
                  <div className="tag">Tag</div>
                  <div className="tag">Tag</div>
                  <div className="tag">Tag</div>
                </div>

                <div className="question-content">
                  <div className="placeholder-line-full"></div>
                  <div className="placeholder-line-full"></div>
                  <div className="placeholder-line-full"></div>
                </div>

                <div className="question-footer">
                  <div className="question-responders">
                    <div className="avatar avatar-placeholder"></div>
                    <div className="avatar avatar-placeholder"></div>
                    <div className="avatar avatar-placeholder"></div>
                  </div>

                  <div className="question-stats">
                    <div className="stat">
                      <FiHeart className="heart-icon" />
                      <span>23</span>
                    </div>
                    <div className="stat">
                      <FiEye />
                      <span>1284</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          {/* Top Experts */}
          <div className="experts-section">
            <h3>Top Experts</h3>
            <div className="experts-list">
              {[1, 2, 3, 4, 5, 6].map((expert) => (
                <div key={expert} className="expert-item">
                  <div className="avatar avatar-placeholder"></div>
                  <span>Anonymous</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="tags-section">
            <h3>Popular Tags</h3>
            <div className="tags-list">
              {["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript"].map((tag) => (
                <div key={tag} className="tag">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


export default Main;