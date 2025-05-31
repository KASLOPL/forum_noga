import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./main.css";
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap
} from "react-icons/fi";

// Mock data
const MOCK_QUESTIONS = [
  { id: 1, author: "Anna K.", timeAgo: "2 godziny temu", highlight: "Jak zoptymalizować zapytania SQL w dużej bazie danych?", 
    tags: ["SQL", "Database", "Performance"], content: "Mam problem z wydajnością zapytań SQL w bazie danych zawierającej miliony rekordów...",
    fullContent: "Pracuję nad aplikacją, która musi przetwarzać duże ilości danych...", likes: 23, views: 1284, responders: 3 },
  { id: 2, author: "Tomasz M.", timeAgo: "4 godziny temu", highlight: "React Hook useEffect - problem z nieskończoną pętlą",
    tags: ["React", "JavaScript", "Hooks"], content: "Mój useEffect wchodzi w nieskończoną pętlą rerenderowania...",
    fullContent: "Pracuję nad komponentem React, który ma pobierać dane z API...", likes: 45, views: 892, responders: 5 },
  { id: 3, author: "Michał P.", timeAgo: "6 godzin temu", highlight: "Algorytmy sortowania - który wybrać dla dużych zbiorów danych?",
    tags: ["Algorithms", "Performance"], content: "Potrzebuję posortować tablicę z 100,000+ elementów...",
    fullContent: "Pracuję nad aplikacją, która musi sortować bardzo duże zbiory danych...", likes: 31, views: 567, responders: 4 },
  { id: 4, author: "Julia W.", timeAgo: "8 godzin temu", highlight: "CSS Grid vs Flexbox - kiedy używać którego?",
    tags: ["CSS", "Layout", "Frontend"], content: "Ciągle się zastanawiam, kiedy powinienem używać CSS Grid...",
    fullContent: "Uczę się nowoczesnego CSS-a i mam problem z wyborem między Grid a Flexbox...", likes: 18, views: 743, responders: 6 }
];

const EXPERTS_DATA = [
  { name: "Dr. Sarah Chen", specialty: "Machine Learning" },
  { name: "Mike Johnson", specialty: "Web Development" },
  { name: "Lisa Park", specialty: "Data Science" },
  { name: "David Kim", specialty: "Mobile Apps" },
  { name: "Emma Wilson", specialty: "UI/UX Design" },
  { name: "Alex Rodriguez", specialty: "DevOps" }
];

const POPULAR_TAGS = ["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript", "CSS", "Machine Learning", "SQL", "Node.js"];

// Custom hooks
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
      return isBookmarked ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);
  return { toggleBookmark, isBookmarked };
};

// Components
const SearchBar = ({ onAddQuestion }) => (
  <div className="search-group">
    <div className="search-container">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input className="search-input" placeholder="Got a question? See if it's already asked!" type="text" />
      </div>
    </div>
    <button className="add-button" onClick={onAddQuestion}><FiPlus /></button>
    <div className="sort-dropdown"><span>Sort by</span><FiChevronDown /></div>
  </div>
);

const UserProfile = ({ user, onProfileClick }) => (
  <div className="user-profile" onClick={onProfileClick}>
    <div className="avatar"><span>{user?.name?.substring(0, 2) || 'GU'}</span></div>
    <div className="user-info">
      <span className="user-name">{user?.name || 'Guest'}</span>
      <span className="user-role">Student</span>
    </div>
    <FiChevronDown className="dropdown-icon" />
  </div>
);

const Sidebar = ({ onNavigate, onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-content">
      <div className="add-question-button-container">
        <button className="add-question-button" onClick={() => onNavigate('/addquestion')}>
          <span>ADD QUESTION</span>
          <div className="plus-icon-container"><FiPlus /></div>
        </button>
      </div>
      <nav className="sidebar-nav">
        {[
          { icon: FiHome, text: "Home", path: "/main", active: true },
          { icon: FiMessageSquare, text: "Notifications", path: "/notifications" },
          { icon: FiUsers, text: "Specialists", path: "/specialists" },
          { icon: FiUser, text: "My Questions", path: "/myquestions" },
          { icon: FiBookmark, text: "Bookmarks", path: "/zakładki" }
        ].map(({ icon: Icon, text, path, active }) => (
          <a key={path} href="#" className={`nav-item ${active ? 'active' : ''}`} 
             onClick={(e) => { e.preventDefault(); onNavigate(path); }}>
            <Icon /><span>{text}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-nav-secondary">
        <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('/settings'); }}>
          <FiSettings /><span>Settings</span>
        </a>
        <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('/help'); }}>
          <FiHelpCircle /><span>Help & FAQ</span>
        </a>
      </div>
    </div>
    <div className="sidebar-footer">
      <button className="sign-out-button" onClick={onLogout}>
        <FiLogOut /> Sign out
      </button>
    </div>
  </aside>
);

const QuestionCard = ({ question, isExpanded, isBookmarked, onToggleExpand, onToggleBookmark, onCardClick }) => (
  <div className="question-card" onClick={onCardClick}>
    <div className="question-card-header" onClick={(e) => e.stopPropagation()}>
      <div className="question-author">
        <div className="avatar"><span>{question.author.substring(0, 2)}</span></div>
        <div className="author-info">
          <div className="author-name">{question.author}</div>
          <div className="author-time">{question.timeAgo}</div>
        </div>
      </div>
      <div className="question-actions">
        <button className={`icon-button ${isBookmarked ? 'bookmarked' : ''}`} onClick={onToggleBookmark}>
          <FiBookmark style={{ fill: isBookmarked ? '#4CAF50' : 'none' }} />
        </button>
        <button className="icon-button" onClick={(e) => e.stopPropagation()}>
          <FiMoreVertical />
        </button>
      </div>
    </div>
    <div className="question-highlight">
      <h3>{question.highlight}</h3>
    </div>
    <div className="question-content">
      <p>{isExpanded ? question.fullContent : question.content}</p>
      <button className="expand-button" onClick={onToggleExpand}>
        {isExpanded ? (<><span>Show less</span><FiChevronUp /></>) : (<><span>Read more</span><FiChevronDown /></>)}
      </button>
    </div>
    <div className="question-footer" onClick={(e) => e.stopPropagation()}>
      <div className="question-responders">
        {Array.from({ length: question.responders }, (_, i) => (
          <div key={i} className="avatar avatar-small">
            <span>{String.fromCharCode(65 + i)}</span>
          </div>
        ))}
      </div>
      <div className="question-stats">
        <div className="stat"><FiHeart className="heart-icon" /><span>{question.likes}</span></div>
        <div className="stat"><FiEye /><span>{question.views}</span></div>
      </div>
    </div>
  </div>
);

const ExpertsSection = () => (
  <div className="experts-section">
    <h3>Top Experts</h3>
    <div className="experts-list">
      {EXPERTS_DATA.map((expert, index) => (
        <div key={index} className="expert-item">
          <div className="avatar avatar-small">
            <span>{expert.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="expert-details">
            <div className="expert-name">{expert.name}</div>
            <div className="expert-specialty">{expert.specialty}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TagsSection = () => (
  <div className="tags-section">
    <h3>Popular Tags</h3>
    <div className="tags-list">
      {POPULAR_TAGS.map(tag => <div key={tag} className="tag tag-clickable">{tag}</div>)}
    </div>
  </div>
);

// Main component
function Main() {
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleNavigation = useCallback((path) => navigate(path), [navigate]);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') navigate('/');
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
            <SearchBar onAddQuestion={() => handleNavigation('/addquestion')} />
            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-button"><FiMoon /></button>
              <button className="icon-button"><FiMail /></button>
              <UserProfile user={currentUser} onProfileClick={() => handleNavigation('/profile')} />
            </div>
          </div>
        </header>

        <div className="main-container">
          <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} />
          
          <main className="main-content">
            <div className="welcome-banner">
              <h1>Hi, {currentUser?.name || 'Guest'}!</h1>
              <p>Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!</p>
            </div>
            <div className="posts-count">{MOCK_QUESTIONS.length} posts</div>
            <div className="question-cards-container">
              <div className="question-cards">
                {MOCK_QUESTIONS.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isExpanded={expandedQuestion === question.id}
                    isBookmarked={isBookmarked(question.id)}
                    onToggleExpand={(e) => handleToggleQuestion(question.id, e)}
                    onToggleBookmark={(e) => handleBookmarkToggle(question, e)}
                    onCardClick={() => handleCardClick(question)}
                  />
                ))}
              </div>
            </div>
          </main>

          <aside className="right-sidebar">
            <ExpertsSection />
            <TagsSection />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Main;