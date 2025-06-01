import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./my_questions.css";
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMessageSquare, FiMoreVertical, FiPlus, FiSettings, 
  FiUser, FiUsers, FiZap, FiCheck
} from "react-icons/fi";

const statusColors = {
  complete: '#4CAF50',
  in_progress: '#FF9800'
};
const statusNames = {
  complete: 'Complete',
  in_progress: 'In Progress'
};

const navItems = [
  { icon: FiHome, text: "Home", path: "/main" },
  { icon: FiMessageSquare, text: "Notifications", path: "/notifications" },
  { icon: FiUsers, text: "Specialists", path: "/specialists" },
  { icon: FiUser, text: "My Questions", path: "/myquestions", active: true },
  { icon: FiBookmark, text: "Bookmarks", path: "/zakładki" }
];

const settingsItems = [
  { icon: FiSettings, text: "Settings", path: "/settings" },
  { icon: FiHelpCircle, text: "Help & FAQ", path: "/help" }
];

// Przykładowe pytania
const questions = [
  { 
    id: 1, 
    author: "You", 
    timeAgo: "2 dni temu", 
    title: "Jak zoptymalizować React hooks w dużych aplikacjach?", 
    tags: ["React", "Hooks", "Performance"], 
    content: "Pracuję nad dużym projektem React i mam problem z wydajnością...",
    fullContent: "Pracuję nad dużym projektem React i mam problem z wydajnością komponentów. Używam wielu useState i useEffect hooków, ale aplikacja staje się coraz wolniejsza. Czy są jakieś najlepsze praktyki dla optymalizacji hooków w dużych aplikacjach? Szczególnie interesuje mnie jak unikać niepotrzebnych rerenderów.", 
    likes: 15, 
    views: 234, 
    responseCount: 3,
    status: "complete"
  },
  { 
    id: 2, 
    author: "You", 
    timeAgo: "5 dni temu", 
    title: "Problem z CSS Grid w responsive design", 
    tags: ["CSS", "Grid", "Responsive"], 
    content: "Mam problem z układem CSS Grid na różnych urządzeniach...",
    fullContent: "Tworzę responsive layout używając CSS Grid, ale na mniejszych ekranach układ się psuje. Próbowałem różnych podejść z media queries, ale nie mogę uzyskać pożądanego efektu. Czy ktoś może podpowiedzieć jak prawidłowo obsłużyć breakpointy w Grid?", 
    likes: 8, 
    views: 167, 
    responseCount: 2,
    status: "in_progress"
  },
  { 
    id: 3, 
    author: "You", 
    timeAgo: "1 tydzień temu", 
    title: "Najlepsze praktyki dla API calls w React", 
    tags: ["React", "API", "JavaScript"], 
    content: "Szukam najlepszych praktyk dla wykonywania zapytań API...",
    fullContent: "Pracuję nad aplikacją która wykonuje dużo zapytań do API. Używam fetch w useEffect, ale zastanawiam się czy to najlepsze rozwiązanie. Czy powinienem używać bibliotek jak Axios czy React Query? Jakie są zalety i wady różnych podejść?", 
    likes: 23, 
    views: 445, 
    responseCount: 5,
    status: "complete"
  },
  { 
    id: 4, 
    author: "You", 
    timeAgo: "2 tygodnie temu", 
    title: "TypeScript vs JavaScript w nowych projektach", 
    tags: ["TypeScript", "JavaScript", "Development"], 
    content: "Zastanawiam się czy warto przejść na TypeScript...",
    fullContent: "Rozpoczynam nowy projekt i zastanawiam się czy użyć TypeScript czy zostać przy JavaScript. Słyszałem wiele pozytywnych opinii o TS, ale martwię się o krzywą uczenia i dodatkową złożoność. Czy dla średniego projektu React warto inwestować czas w naukę TypeScript?", 
    likes: 12, 
    views: 298, 
    responseCount: 4,
    status: "in_progress"
  },
  { 
    id: 5, 
    author: "You", 
    timeAgo: "3 tygodnie temu", 
    title: "Optymalizacja obrazów na stronie internetowej", 
    tags: ["Performance", "Images", "Web"], 
    content: "Moja strona ładuje się wolno z powodu dużych obrazów...",
    fullContent: "Moja strona internetowa ładuje się bardzo wolno, głównie z powodu dużej ilości obrazów. Próbowałem kompresji, ale jakość się pogorszyła. Czy są jakieś nowoczesne formaty obrazów które powinienem rozważyć? Jak obsłużyć lazy loading?", 
    likes: 19, 
    views: 356, 
    responseCount: 6,
    status: "in_progress"
  }
];

// Hook do zarządzania zakładkami
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

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

// Hook do uwierzytelniania
const useAuth = (navigate) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const isLoggedIn = true;
    if (!isLoggedIn) {
      navigate('/');
    }
    setUser({ name: 'Current User' });
  }, [navigate]);

  const logout = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return { user, logout };
};

// Funkcje pomocnicze
const getStats = (questions) => {
  return questions.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    acc.total = questions.length;
    return acc;
  }, {});
};

// Komponenty
const NavItem = ({ icon: Icon, text, path, active, onClick }) => (
  <a 
    href="#" 
    className={`nav-item ${active ? 'active' : ''}`} 
    onClick={(e) => { e.preventDefault(); onClick(path); }}
  >
    <Icon /><span>{text}</span>
  </a>
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
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </nav>
      
      <div className="sidebar-nav-secondary">
        {settingsItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>
    
    <div className="sidebar-footer">
      <button className="sign-out-button" onClick={onLogout}>
        <FiLogOut /> Sign out
      </button>
    </div>
  </aside>
);

const StatusBadge = ({ status }) => (
  <div className="status-badge" style={{ backgroundColor: statusColors[status] }}>
    {status === 'complete' && <FiCheck />}
    <span>{statusNames[status]}</span>
  </div>
);

const QuestionResponders = ({ count }) => (
  <div className="question-responders">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="avatar avatar-small">
        <span>{String.fromCharCode(65 + i)}</span>
      </div>
    ))}
    <span className="responders-text">{count} responses</span>
  </div>
);

const QuestionCard = ({ 
  question, 
  isExpanded, 
  isBookmarked, 
  onToggleExpand, 
  onToggleBookmark, 
  onCardClick 
}) => (
  <div 
    className={`question-card ${question.status === 'complete' ? 'complete' : ''}`} 
    onClick={onCardClick}
  >
    <div className="question-card-header" onClick={(e) => e.stopPropagation()}>
      <div className="question-author">
        <div className="avatar">
          <span>{question.author === "You" ? "YU" : question.author.substring(0, 2)}</span>
        </div>
        <div className="author-info">
          <div className="author-name">{question.author}</div>
          <div className="author-time">{question.timeAgo}</div>
        </div>
      </div>
      
      <div className="question-actions">
        <StatusBadge status={question.status} />
        <button 
          className={`icon-button ${isBookmarked ? 'bookmarked' : ''}`} 
          onClick={onToggleBookmark}
        >
          <FiBookmark style={{ fill: isBookmarked ? '#4CAF50' : 'none' }} />
        </button>
        <button className="icon-button" onClick={(e) => e.stopPropagation()}>
          <FiMoreVertical />
        </button>
      </div>
    </div>
    
    <div className="question-highlight">
      <h3>{question.title}</h3>
    </div>
    
    <div className="question-tags">
      {question.tags.map(tag => (
        <span key={tag} className="tag">{tag}</span>
      ))}
    </div>
    
    <div className="question-content">
      <p>{isExpanded ? question.fullContent : question.content}</p>
      <button className="expand-button" onClick={onToggleExpand}>
        {isExpanded ? (
          <><span>Show less</span><FiChevronUp /></>
        ) : (
          <><span>Read more</span><FiChevronDown /></>
        )}
      </button>
    </div>
    
    <div className="question-footer" onClick={(e) => e.stopPropagation()}>
      <QuestionResponders count={question.responseCount} />
      <div className="question-stats">
        <div className="stat">
          <FiHeart className="heart-icon" />
          <span>{question.likes}</span>
        </div>
        <div className="stat">
          <FiEye />
          <span>{question.views}</span>
        </div>
      </div>
    </div>
  </div>
);

const StatItem = ({ number, label, className }) => (
  <div className="stat-item">
    <div className={`stat-number ${className}`}>{number}</div>
    <div className="stat-label">{label}</div>
  </div>
);

// Główny komponent
function MyQuestions() {
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  const { user, logout } = useAuth(navigate);
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const goTo = useCallback((path) => navigate(path), [navigate]);

  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  const handleBookmark = useCallback((question, e) => {
    e.stopPropagation();
    toggleBookmark(question);
  }, [toggleBookmark]);

  const openQuestion = useCallback((question) => {
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const stats = getStats(questions);

  return (
    <div className="caloscMyQuestions">
      <div className="app">
        <header className="header">
          <div className="header-container">
            <div className="header-left">
              <div className="logo-container">
                <div className="logo">
                  <div className="logo-icon"><FiZap /></div>
                  <span className="logo-text">
                    Snap<span className="logo-text-highlight">solve</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="main-container">
          <Sidebar onNavigate={goTo} onLogout={logout} />
          
          <main className="main-content">
            <div className="stats-banner">
              <StatItem number={stats.complete || 0} label="Complete" className="complete" />
              <StatItem number={stats.in_progress || 0} label="In Progress" className="in-progress" />
              <StatItem number={stats.total} label="Total Questions" className="total" />
            </div>
            
            <div className="posts-count">{questions.length} questions asked</div>
            
            <div className="question-cards-container">
              <div className="question-cards">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isExpanded={expandedQuestion === question.id}
                    isBookmarked={isBookmarked(question.id)}
                    onToggleExpand={(e) => toggleQuestion(question.id, e)}
                    onToggleBookmark={(e) => handleBookmark(question, e)}
                    onCardClick={() => openQuestion(question)}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MyQuestions;