import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./my_questions.css";
import { getAllQuestions, getUserQuestions } from '../../utils/firebaseUtils';
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMessageSquare, FiMoreVertical, FiPlus, FiSettings, 
  FiUser, FiUsers, FiZap, FiCheck
} from "react-icons/fi";
import {useRedirectToHomeRootWhenNotLoggedIn} from "../../hooks/redirect_to_home_root_when_not_logged_in";

// kolor obramowania z zaleznosci od statusu pytania 
const statusColors = { complete: '#4CAF50', in_progress: '#FF9800' };
const statusNames = { complete: 'Complete', in_progress: 'In Progress' };

// nawigacja 
const navItems = [
  { icon: FiHome, text: "Home", path: "/main" },
  { icon: FiMessageSquare, text: "Notifications", path: "/notifications" },
  { icon: FiUsers, text: "Specialists", path: "/specialists" },
  { icon: FiUser, text: "My Questions", path: "/myquestions", active: true },
  { icon: FiBookmark, text: "Bookmarks", path: "/zakładki" }
];

// poboczna nawigacja 
const settingsItems = [
  { icon: FiSettings, text: "Settings", path: "/settings" },
  { icon: FiHelpCircle, text: "Help & FAQ", path: "/help" }
];

// zarzadzanie logowaniem oraz stan urzytkownika 
const useAuth = (navigate) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // sprawdzanie czy urzytkonik zalogowany jak nie to wraca na strone logowania 
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    
    try {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  // funkcja wylogowywania 
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('likedQuestions');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  }, [navigate]);

  return { user, logout, isLoggedIn };
};

// statustyki urzytkownika ile pytan zadal itp o jeden w gore zwieksza
const getStats = (questions) => questions.reduce((acc, q) => {
  acc[q.status] = (acc[q.status] || 0) + 1;
  acc.total = questions.length;
  return acc;
}, {});

// pojedynczy element nawigacji budowa - pobiera dane z tablicy wyzej 
const NavItem = ({ icon: Icon, text, path, active, onClick }) => (
  <a href="#" className={`nav-item ${active ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onClick(path); }}>
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
      {/* nawigacja i pobieranie danych z tablicy */}
      <nav className="sidebar-nav">
        {navItems.map((item) => <NavItem key={item.path} {...item} onClick={onNavigate} />)}
      </nav>
      <div className="sidebar-nav-secondary">
        {settingsItems.map((item) => <NavItem key={item.path} {...item} onClick={onNavigate} />)}
      </div>
    </div>
    {/* przycisk wylogowywania */}
    <div className="sidebar-footer">
      <button className="sign-out-button" onClick={onLogout}>
        <FiLogOut /> Sign out
      </button>
    </div>
  </aside>
);

// status pytania i pod niego kolor
const StatusBadge = ({ status }) => (
  <div className="status-badge" style={{ backgroundColor: statusColors[status] }}>
    {/* ikona check tylko dla complete czyli zielonego  */}
    {status === 'complete' && <FiCheck />}
    <span>{statusNames[status]}</span>
  </div>
);

// awatary kodem acii losowa ilosc 
const QuestionResponders = ({ count }) => (
  <div className="question-responders">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="avatar avatar-small">
        <span>{String.fromCharCode(65 + i)}</span>
      </div>
    ))}
    {/* liczba odpowiedzi  */}
    <span className="responders-text">{count} responses</span>
  </div>
);

// pytanie i jego zawartosc jakie dane sa takie umieszcza pokoleji 
const QuestionCard = ({ question, isExpanded, onToggleExpand, onCardClick }) => (
  <div className={`question-card ${question.status === 'complete' ? 'complete' : ''}`} onClick={onCardClick}>
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
      {question.tags && question.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
    </div>
    {/* rozwijanie i odwrotnie pytan  */}
    <div className="question-content">
      <p>{isExpanded ? question.fullContent : question.content}</p>
      <button className="expand-button" onClick={onToggleExpand}>
        {isExpanded ? <><span>Show less</span><FiChevronUp /></> : <><span>Read more</span><FiChevronDown /></>}
      </button>
    </div>
    <div className="question-footer" onClick={(e) => e.stopPropagation()}>
      <QuestionResponders count={question.responseCount || question.responders || 0} />
      <div className="question-stats">
        <div className="stat">
          {/* statystyki jesli niema to domyslne 0 */}
          <FiHeart className="heart-icon" />
          <span>{question.likes || 0}</span>
        </div>
        <div className="stat">
          <FiEye />
          <span>{question.views || 0}</span>
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

function MyQuestions() {
  // nawigacja 
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, logout, isLoggedIn } = useAuth(navigate);
  const goTo = useCallback((path) => navigate(path), [navigate]);
  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);
  // sprawdzanie czy urzytkownik jest zalogowany
  const openQuestion = useCallback((question) => {
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  useRedirectToHomeRootWhenNotLoggedIn();

  const loadUserQuestions = useCallback(async () => {
    if (!isLoggedIn || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // pobieranie nazwy urzytkownika 
      const userName = user.userName || user.name;
      let result = await getUserQuestions(userName);
      
      if (!result || !result.success) {
        console.log('getUserQuestions not available, falling back to getAllQuestions');
        const allQuestionsResult = await getAllQuestions();
        
        if (allQuestionsResult.success) {
          const userQuestions = allQuestionsResult.questions.filter(q => q.author === userName);
          result = { success: true, questions: userQuestions };
        } else {
          result = allQuestionsResult;
        }
      }
      
      // bledy zaladowywania 
      if (result.success) {
        setQuestions(result.questions);
      } else {
        setError(result.error || 'Failed to load questions');
        console.error('Error loading user questions:', result.error);
      }
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error in loadUserQuestions:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  // laduje pytania kiedy urzytkownik jest zalogowany
  useEffect(() => {
    if (isLoggedIn && user) loadUserQuestions();
  }, [isLoggedIn, user, loadUserQuestions]);

  // loading screen podczas sprawdzania danych 
  if (!user || !isLoggedIn) {
    return (
      <div className="caloscMyQuestions">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  // lodaing podczas ladowania pytan 
  if (loading) {
    return (
      <div className="caloscMyQuestions">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Loading your questions...</div>
        </div>
      </div>
    );
  }

  // error ladowania pytan 
  if (error) {
    return (
      <div className="caloscMyQuestions">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Error loading questions: {error}</div>
          <button onClick={loadUserQuestions} style={{ marginTop: '10px' }}>Retry</button>
        </div>
      </div>
    );
  }

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
                  <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="main-container">
          <Sidebar onNavigate={goTo} onLogout={logout} />
          
          <main className="main-content">
            <div className="stats-banner">
              {/* baner z statystykami urzytkownika  */}
              <StatItem number={stats.complete || 0} label="Complete" className="complete" />
              <StatItem number={stats.in_progress || 0} label="In Progress" className="in-progress" />
              <StatItem number={questions.length} label="Total Questions" className="total" />
            </div>
            
            <div className="posts-count">{questions.length} questions asked</div>
            
            <div className="question-cards-container">
              <div className="question-cards">
                {questions.length === 0 ? (
                  // jesli niema pytan empty state 
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <p>You haven't asked any questions yet.</p>
                    {/* jesli niema nic to przycisk do formularza  */}
                    <button onClick={() => goTo('/addquestion')} style={{ 
                      marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50',
                      color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                      Ask Your First Question
                    </button>
                  </div>
                ) : (
                  questions.map((question) => (
                    // obsluga pytania i wszytskie jego dane i funkcje 
                    <QuestionCard
                      key={question.id}
                      question={question}
                      isExpanded={expandedQuestion === question.id}
                      onToggleExpand={(e) => toggleQuestion(question.id, e)}
                      onCardClick={() => openQuestion(question)}
                    />
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MyQuestions;