import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./my_questions.css";
import defaultQuestions from '../../data/questions';  
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMessageSquare, FiMoreVertical, FiPlus, FiSettings, 
  FiUser, FiUsers, FiZap, FiCheck
} from "react-icons/fi";

// jaki kolor do jakiego statusu pytania 
const statusColors = {
  complete: '#4CAF50',
  in_progress: '#FF9800'
};
const statusNames = {
  complete: 'Complete',
  in_progress: 'In Progress'
};

// elemnty menu
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

// Hook do uwierzytelniania
const useAuth = (navigate) => {
  const [user, setUser] = useState({});

  // czy urzytkownik zalogowany jak nie wraca na logowanie 
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

// Zlicza ile pytan z jakiego rodzaju np
const getStats = (questions) => {
  // ile wedlug ich rodzaju wlasnie ( reduce do zliczania )
  return questions.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    acc.total = questions.length;
    return acc;
  }, {});
};

// Komponenty
const NavItem = ({ icon: Icon, text, path, active, onClick }) => (
  <a 
  // wyroznienie i podpiecie css pod aktualna strone
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
          // przycisk wywoluje onNawigate ktora ma scierzke do add question
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </nav>
      
      {/* to samo dla ustawien i hrlp  */}
      <div className="sidebar-nav-secondary">
        {settingsItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onNavigate} />
        ))}
      </div>
    </div>
    
    {/* funkcja wylogowania po kliknieciu przycisku  */}
    <div className="sidebar-footer">
      <button className="sign-out-button" onClick={onLogout}>
        <FiLogOut /> Sign out
      </button>
    </div>
  </aside>
);

// dany kolor = status podany pod niego
const StatusBadge = ({ status }) => (
  <div className="status-badge" style={{ backgroundColor: statusColors[status] }}>
    {/* tylko dla complete icona check */}
    {status === 'complete' && <FiCheck />}
    <span>{statusNames[status]}</span>
  </div>
);

const QuestionResponders = ({ count }) => (
  <div className="question-responders">
    {/* awatary ludzi odpowiadajacyh  */}
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="avatar avatar-small">
        {/* A,B,C itp kodem ASCII dlatego 65 pierwsze  */}
        <span>{String.fromCharCode(65 + i)}</span>
      </div>
    ))}
    <span className="responders-text">{count} responses</span>
  </div>
);

// GLOWNY KOMPONENT pytania ktory laczy wszytskie funkcje w jednym miejscu 
const QuestionCard = ({ 
  question, 
  isExpanded, 
  onToggleExpand, 
  onCardClick 
}) => (
  <div 
  // DODAJE kalse complete do pytania o statusie complete 
    className={`question-card ${question.status === 'complete' ? 'complete' : ''}`} 
    onClick={onCardClick}
  >
    <div className="question-card-header" onClick={(e) => e.stopPropagation()}>
      <div className="question-author">
        <div className="avatar">
          <span>{question.author === "You" ? "YU" : (question.author || "??").substring(0, 2)}</span>
        </div>
        <div className="author-info">
          <div className="author-name">{question.author}</div>
          <div className="author-time">{question.timeAgo}</div>
        </div>
      </div>
      
      <div className="question-actions">
        <StatusBadge status={question.status} />
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

  // Pytania z localStorage automatycznie ktore przypisane do konta 
const [questions, setQuestions] = useState(() => {
  const saved = localStorage.getItem("questions");
  return saved ? JSON.parse(saved) : defaultQuestions;
});

  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  const { user, logout } = useAuth(navigate);

  const goTo = useCallback((path) => navigate(path), [navigate]);

  // przelaczanie rozwijania pytania 
  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  const openQuestion = useCallback((question) => {
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const stats = getStats(questions);

const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const userName = currentUser?.userName;
console.log(userName)

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
              <StatItem number={questions.filter(q => q.author === userName).length} label="Total Questions" className="total" />
            </div>
            
            <div className="posts-count">{questions.filter(q => q.author === userName).length} questions asked</div>
            
            <div className="question-cards-container">
              <div className="question-cards">
                {questions
                .filter((question) => question.author === userName)
                .map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isExpanded={expandedQuestion === question.id}
                    onToggleExpand={(e) => toggleQuestion(question.id, e)}
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