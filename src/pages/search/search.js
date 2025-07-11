import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiZap, FiPlus, FiHome, FiMessageSquare, FiUsers, FiUser, FiBookmark, FiSettings, FiHelpCircle, FiLogOut, FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import "./search.css";

const navItems = [
  { path: "/main", icon: FiHome, label: "Home" },
  { path: "/notifications", icon: FiMessageSquare, label: "Notifications" },
  { path: "/specialists", icon: FiUsers, label: "Specialists" },
  { path: "/my_questions", icon: FiUser, label: "My Questions" },
  { path: "/bookmarks", icon: FiBookmark, label: "Bookmarks" }
];
const secondaryNavItems = [
  { path: "/settings", icon: FiSettings, label: "Settings" },
  { path: "/help", icon: FiHelpCircle, label: "Help & FAQ" }
];
const availableTags = ["Python", "JavaScript", "React", "SQL", "CSS", "HTML", "Node.js", "Machine Learning", "UI/UX", "Java"];
const sortOptions = ["Recommended", "Newest", "Oldest"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const navigate = useNavigate();
  const [tags, setTags] = useState(["Python", "React"]);
  const [sort, setSort] = useState(sortOptions[0]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const handleRemoveTag = (tag) => setTags(tags.filter(t => t !== tag));
  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagDropdownOpen(false);
  };
  const handleSortChange = (e) => setSort(e.target.value);

  // Sidebar navigation
  const handleNav = (path) => navigate(path);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Placeholder for user
  const user = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', role: 'Student' };
  const getUserInitials = () => (user?.name || user?.userName || 'GU').substring(0, 2).toUpperCase();

  return (
    <div className="caloscAdd search-root">
      <div className="app-container">
        <aside className="template-sidebar">
          <div className="template-sidebar-content">
            <div className="template-logo">
              <div className="template-logo-icon"><FiZap /></div>
              <span className="template-logo-text">Snap<span className="template-logo-text-highlight">solve</span></span>
            </div>
            <div className="template-add-question-button-container">
              <button className="template-add-question-button" onClick={() => handleNav('/addquestion')}>
                <span>ADD QUESTION</span>
                <div className="template-plus-icon-container"><FiPlus /></div>
              </button>
            </div>
            <nav className="template-sidebar-nav">
              {navItems.map(item => (
                <a key={item.path} href="#" className="template-nav-item" onClick={e => { e.preventDefault(); handleNav(item.path); }}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
            <div className="template-sidebar-nav-secondary">
              {secondaryNavItems.map(item => (
                <a key={item.path} href="#" className="template-nav-item" onClick={e => { e.preventDefault(); handleNav(item.path); }}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="template-sidebar-footer">
            <div className="sidebar-user-box">
              <div className="sidebar-avatar">{getUserInitials()}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user?.name || user?.userName || 'Guest'}</div>
                <div className="sidebar-user-role">{user?.role || 'Student'}</div>
              </div>
            </div>
            <button className="template-sign-out-button" onClick={handleLogout}>
              <FiLogOut /> Sign out
            </button>
          </div>
        </aside>
        <div className="main-content search-main-content">
          <div className="search-bar-row">
            <div className="search-bar-wrapper">
              <FiSearch className="search-bar-icon" />
              <input className="search-bar-input" type="text" placeholder="Got a question? See if it's already asked!" value={searchTerm} readOnly />
              <button className="search-bar-btn" disabled><span>Search</span></button>
            </div>
          </div>
          <div className="search-tags-sort-row">
            <div className="search-tags-list">
              {tags.map(tag => (
                <span className="search-tag" key={tag}>{tag}<button className="search-tag-remove" onClick={() => handleRemoveTag(tag)}><FiX /></button></span>
              ))}
              <div className="search-tag-dropdown-container">
                <button className="search-add-tag-btn" onClick={() => setTagDropdownOpen(!tagDropdownOpen)}>Add tag <FiChevronDown /></button>
                {tagDropdownOpen && (
                  <div className="search-tag-dropdown">
                    {availableTags.filter(tag => !tags.includes(tag)).map(tag => (
                      <div className="search-tag-dropdown-item" key={tag} onClick={() => handleAddTag(tag)}>{tag}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="search-sort-box">
              <span>Sort By:</span>
              <select className="search-sort-select" value={sort} onChange={handleSortChange}>
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="search-results-info-row">
            <span className="search-results-count">523+ Results</span>
          </div>
          <div className="search-results-list">
            {[1,2,3].map(i => (
              <div className="search-result-card skeleton" key={i}>
                <div className="skeleton-title"></div>
                <div className="skeleton-tags"></div>
                <div className="skeleton-meta"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search; 