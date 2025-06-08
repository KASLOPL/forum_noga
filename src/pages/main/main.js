import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./main.css";
import { getAllQuestions, incrementViews, likeQuestion } from '../../utils/firebaseUtils';
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap
} from "react-icons/fi";

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("bookmarks");
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
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
  const [user, setUser] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedQuestions, setLikedQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem("likedQuestions");
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const goTo = useCallback((path) => navigate(path), [navigate]);
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('likedQuestions');
      navigate('/', { replace: true });
    } catch (error) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  const bookmarkClick = useCallback((question, e) => {
    e.stopPropagation();
    toggleBookmark(question);
  }, [toggleBookmark]);

  const cardClick = useCallback(async (question) => {
    try {
      await incrementViews(question.id);
      setQuestions(prev => prev.map(q => 
        q.id === question.id ? { ...q, views: (q.views || 0) + 1 } : q
      ));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const loadQuestions = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAllQuestions();
      if (result.success) {
        setQuestions(result.questions);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const likeClick = useCallback(async (questionId, e) => {
    e.stopPropagation();
    const isAlreadyLiked = likedQuestions.includes(questionId);
    
    try {
      if (isAlreadyLiked) {
        const newLiked = likedQuestions.filter(id => id !== questionId);
        setLikedQuestions(newLiked);
        setQuestions(prev => prev.map(q => 
          q.id === questionId ? { ...q, likes: Math.max((q.likes || 0) - 1, 0) } : q
        ));
      } else {
        const result = await likeQuestion(questionId);
        if (result.success) {
          const newLiked = [...likedQuestions, questionId];
          setLikedQuestions(newLiked);
          setQuestions(prev => prev.map(q => 
            q.id === questionId ? { ...q, likes: (q.likes || 0) + 1 } : q
          ));
        }
      }
    } catch (error) {
      console.error('Error in likeClick:', error);
    }
  }, [likedQuestions]);

  const getUserName = useCallback(() => user?.userName || user?.name || 'Guest', [user]);
  const getUserInitials = useCallback(() => {
    const name = getUserName();
    return name === 'Guest' ? 'GU' : name.substring(0, 2).toUpperCase();
  }, [getUserName]);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const userData = localStorage.getItem('currentUser');
      
      if (!loggedIn || loggedIn !== 'true' || !userData) {
        navigate('/', { replace: true });
        return false;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        return true;
      } catch (error) {
        navigate('/', { replace: true });
        return false;
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) loadQuestions();
  }, [isLoggedIn, loadQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem("likedQuestions", JSON.stringify(likedQuestions));
    } catch (error) {
      console.error('Error saving liked questions:', error);
    }
  }, [likedQuestions]);

  if (!user || !isLoggedIn) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  const userTags = user?.tags || user?.interests || [];
  const filteredQuestions = questions.filter(q => q.tags?.some(tag => userTags.includes(tag)));
  const remainingQuestions = questions.filter(q => !filteredQuestions.includes(q));
  const orderedQuestions = [...filteredQuestions, ...remainingQuestions];

  if (loading) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Error loading questions: {error}</div>
          <button onClick={loadQuestions} style={{ marginTop: '10px' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-accent">solve</span></span>
              </div>
            </div>

            <div className="search-section">
              <div className="search-box">
                <div className="search-wrapper">
                  <FiSearch className="search-icon" />
                  <input className="search-input" placeholder="Got a question? See if it's already asked!" type="text" />
                </div>
              </div>
              <button className="add-btn" onClick={() => goTo('/addquestion')}>
                <FiPlus />
              </button>
              <div className="sort-btn">
                <span>Sort by</span>
                <FiChevronDown />
              </div>
            </div>

            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-btn"><FiMoon /></button>
              <button className="icon-btn"><FiMail /></button>
              <div className="user-menu" onClick={() => goTo('/profile')}>
                <div className="avatar">
                  <span>{getUserInitials()}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{getUserName()}</span>
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
              <div className="add-question-section">
                <button className="add-question-btn" onClick={() => goTo('/addquestion')}>
                  <span>ADD QUESTION</span>
                  <div className="plus-icon"><FiPlus /></div>
                </button>
              </div>

              <nav className="nav">
                <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); goTo('/main'); }}><FiHome /><span>Home</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/notifications'); }}><FiMessageSquare /><span>Notifications</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/specialists'); }}><FiUsers /><span>Specialists</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/my_questions'); }}><FiUser /><span>My Questions</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/zakładki'); }}><FiBookmark /><span>Bookmarks</span></a>
              </nav>

              <div className="nav-secondary">
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/settings'); }}><FiSettings /><span>Settings</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); goTo('/help'); }}><FiHelpCircle /><span>Help & FAQ</span></a>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="logout-btn" onClick={logout}>
                <FiLogOut /> Sign out
              </button>
            </div>
          </aside>

          <main className="content">
            <div className="welcome-banner">
              <h1>Hi, {getUserName()}!</h1>
              <p>Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!</p>
            </div>

            <div className="posts-count">{questions.length} posts</div>
            <div className="questions-container">
              <div className="questions-list">
                {Array.isArray(orderedQuestions) && orderedQuestions.map((question) => (
                  <div key={question.id} className="question-card" onClick={() => cardClick(question)} style={{ cursor: 'pointer' }}>
                    <div className="card-header" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="author">
                        <div className="avatar">
                          <span>{question.author?.substring(0, 2).toUpperCase() || '??'}</span>
                        </div>
                        <div className="author-info">
                          <div className="author-name">{question.author || 'Unknown Author'}</div>
                          <div className="author-time">{question.timeAgo}</div>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button className={`icon-btn ${isBookmarked(question.id) ? 'bookmarked' : ''}`} onClick={(e) => bookmarkClick(question, e)}>
                          <FiBookmark style={{ fill: isBookmarked(question.id) ? '#4CAF50' : 'none' }} />
                        </button>
                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); }}><FiMoreVertical /></button> 
                      </div>
                    </div>

                    <div className="question-title">
                      <h3>{question.title || question.highlight}</h3>
                    </div>
                    <div className="question-tags">
                      {question.tags && question.tags.map(tag => (
                         <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>

                    <div className="question-content">
                      <p>{expandedQuestion === question.id ? question.fullContent : question.content}</p>
                      {question.fullContent && question.fullContent !== question.content && (
                        <button className="expand-btn" onClick={(e) => toggleQuestion(question.id, e)}>
                          {expandedQuestion === question.id ? 
                            <><span>Show less</span><FiChevronUp /></> : 
                            <><span>Read more</span><FiChevronDown /></>
                          }
                        </button>
                      )}
                    </div>

                    <div className="card-footer" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="responders">
                        {Array.from({ length: question.responders || 0 }, (_, i) => (
                          <div key={i} className="avatar avatar-small">
                            <span>{String.fromCharCode(65 + i)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="stats">
                        <div className="stat like-btn" onClick={(e) => likeClick(question.id, e)}>
                          <FiHeart 
                            className="heart-icon" 
                            style={{ 
                              fill: likedQuestions.includes(question.id) ? '#ff4757' : 'none',
                              color: likedQuestions.includes(question.id) ? '#ff4757' : '#666'
                            }} 
                          />
                          <span>{question.likes || 0}</span>
                        </div>
                        <div className="stat"><FiEye /><span>{question.views || 0}</span></div>
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
                    <div className="avatar avatar-small">
                      <span>{expert.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="expert-info">
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