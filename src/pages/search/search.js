import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import "./search.css";
import { getAllQuestions, incrementViews, likeQuestion } from '../../utils/firebaseUtils';
import Modal from '../notifications/Modal';
import Notifications from '../notifications/Notifications';
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiChevronRight, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap, FiGrid, FiList
} from "react-icons/fi"; 
import {useRedirectToHomeRootWhenNotLoggedIn} from "../../hooks/redirect_to_home_root_when_not_logged_in";
import SortBy from '../../components/sort_by/sort_by';
import Filters from '../../components/filters/filters';
import SearchPopout from '../../components/search_popout/search_popout';
import Sidebar from '../../components/side_bar/side_bar.js';

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
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

export const UserContext = React.createContext();

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [questions, setQuestions] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  const [likedQuestions, setLikedQuestions] = useState(() => {
    const saved = localStorage.getItem("likedQuestions");
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  const [currentFilters, setCurrentFilters] = useState({});

  const goTo = useCallback((path) => navigate(path), [navigate]);
  
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('likedQuestions');
    navigate('/', { replace: true });
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
    await incrementViews(question.id);
    setQuestions(prev => prev.map(q => 
      q.id === question.id ? { ...q, views: (q.views || 0) + 1 } : q
    ));
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const loadQuestions = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    const result = await getAllQuestions();
    if (result.success) {
      setQuestions(result.questions);
    }
    setLoading(false);
  }, [isLoggedIn]);

  const likeClick = useCallback(async (questionId, e) => {
    e.stopPropagation();
    const isAlreadyLiked = likedQuestions.includes(questionId);
    
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
  }, [likedQuestions]);

  const getUserName = useCallback(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.userName || currentUser?.name || 'Guest';
  }, []);
  const getUserInitials = useCallback(() => {
    const name = getUserName();
    return name === 'Guest' ? 'GU' : name.substring(0, 2).toUpperCase();
  }, [getUserName]);

  useRedirectToHomeRootWhenNotLoggedIn();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      return true;
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) loadQuestions();
  }, [isLoggedIn, loadQuestions]);

  useEffect(() => {
    localStorage.setItem("likedQuestions", JSON.stringify(likedQuestions));
  }, [likedQuestions]);

  useEffect(() => {
    let results = questions;
    
    // Apply search filter
    if (initialQuery && questions.length > 0) {
      results = questions.filter(question => 
        question.title?.toLowerCase().includes(initialQuery.toLowerCase()) ||
        question.content?.toLowerCase().includes(initialQuery.toLowerCase()) ||
        question.tags?.some(tag => tag.toLowerCase().includes(initialQuery.toLowerCase()))
      );
    }
    
    // Apply other filters
    results = filterQuestions(results, currentFilters);
    results = filterByTime(results, timeFilter);
    results = filterByStatus(results, statusFilter);
    
    setFilteredResults(results);
  }, [initialQuery, questions, currentFilters, timeFilter, statusFilter]);

  // DODAJ te nowe funkcje:
const timeFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

const statusFilterOptions = [
  { value: 'all', label: 'Question Status' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'answered', label: 'Answered' },
  { value: 'solved', label: 'Solved' }
];

const getTimeFilterLabel = () => {
  return timeFilterOptions.find(option => option.value === timeFilter)?.label || 'All Time';
};

const getStatusFilterLabel = () => {
  return statusFilterOptions.find(option => option.value === statusFilter)?.label || 'Question Status';
};

const toggleSidebar = () => {
  setIsSidebarCollapsed(!isSidebarCollapsed);
};

const filterByTime = (questions, timeFilter) => {
  if (timeFilter === 'all') return questions;
  
  const now = new Date();
  const filterDate = new Date();
  
  switch (timeFilter) {
    case 'today':
      filterDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      filterDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      filterDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return questions;
  }
  
  return questions.filter(question => {
    const questionDate = new Date(question.createdAt);
    return questionDate >= filterDate;
  });
};

const filterByStatus = (questions, statusFilter) => {
  if (statusFilter === 'all') return questions;
  
  switch (statusFilter) {
    case 'unanswered':
      return questions.filter(q => !q.responders || q.responders === 0);
    case 'answered':
      return questions.filter(q => q.responders && q.responders > 0 && !q.solved);
    case 'solved':
      return questions.filter(q => q.solved);
    default:
      return questions;
  }
};

  const [sortOption, setSortOption] = useState({ value: 'newest', label: 'Newest first' });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const sortQuestions = (questions, option) => {
    if (!option) return questions;
    switch (option.value) {
      case 'newest':
        return [...questions].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      case 'upvoted':
        return [...questions].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'answered':
        return [...questions].sort((a, b) => (b.responders || 0) - (a.responders || 0));
      case 'viewed':
        return [...questions].sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'solved':
        return [...questions].sort((a, b) => (b.solved ? 1 : 0) - (a.solved ? 1 : 0));
      default:
        return questions;
    }
  };

  const filterQuestions = (questions, filters) => {
    if (!filters || Object.keys(filters).every(key => !filters[key] || filters[key].length === 0)) {
      return questions;
    }

    return questions.filter(question => {
      if (filters.category && filters.category.length > 0) {
        if (!question.category || !filters.category.includes(question.category)) {
          return false;
        }
      }

      if (filters.tags && filters.tags.length > 0) {
        if (!question.tags || !filters.tags.some(tag => question.tags.includes(tag))) {
          return false;
        }
      }

      if (filters.questionType && filters.questionType.length > 0) {
        if (!question.type || !filters.questionType.includes(question.type)) {
          return false;
        }
      }

      return true;
    });
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false); // zamknij popout natychmiast
      e.target.blur(); // zabierz focus z inputa
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Dodaj efekt zamykania popouta po kliknięciu poza search-boxem
  useEffect(() => {
    if (!isSearchOpen) return;
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  if (!isLoggedIn) {
  return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  const sortedResults = sortQuestions(filteredResults, sortOption);

  if (loading) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Loading questions...</div>
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
              <div className="search-box" ref={searchBoxRef}>
                <div className="search-wrapper">
                  <FiSearch className="search-icon" />
            <input
                    className={`search-input${isInputFocused ? ' search-input--active' : ''}`}
                    placeholder="Got a question? See if it's already asked!"
              type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => { setIsInputFocused(true); setIsSearchOpen(true); }}
                    onBlur={() => setIsInputFocused(false)}
                    onKeyDown={handleSearchEnter}
                  />
                  <SearchPopout
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    anchorRef={searchBoxRef}
            />
          </div>
              </div>
              <Filters onFiltersChange={setCurrentFilters} currentFilters={currentFilters} />
            </div>

            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-btn"><FiMoon /></button>
              <button className="icon-btn" onClick={() => setIsNotificationModalOpen(true)}>
                <FiMail />
              </button>
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
          <Sidebar onNotificationClick={() => setIsNotificationModalOpen(true)} />

          <main className="content">
            <div className="search-results-header">
              {initialQuery && <p>Results for: "<strong>{initialQuery}</strong>"</p>}
              <div className="results-count">
                <span>{sortedResults.length}+ Results</span>
              </div>
            </div>

            <div className="results-controls">
              <div className="controls-center">
                <div className="filter-dropdown">
                  <button 
                    className="dropdown-btn"
                    onClick={() => {
                      setIsTimeDropdownOpen(!isTimeDropdownOpen);
                      setIsStatusDropdownOpen(false);
                    }}
                  >
                    <span>{getTimeFilterLabel()}</span>
                    <FiChevronDown size={14} />
                  </button>
                  {isTimeDropdownOpen && (
                    <div className="dropdown-content">
                      {timeFilterOptions.map(option => (
                        <div
                          key={option.value}
                          className={`dropdown-item ${timeFilter === option.value ? 'active' : ''}`}
                          onClick={() => {
                            setTimeFilter(option.value);
                            setIsTimeDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-dropdown">
                  <button 
                    className="dropdown-btn"
                    onClick={() => {
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      setIsTimeDropdownOpen(false);
                    }}
                  >
                    <span>{getStatusFilterLabel()}</span>
                    <FiChevronDown size={14} />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="dropdown-content">
                      {statusFilterOptions.map(option => (
                        <div
                          key={option.value}
                          className={`dropdown-item ${statusFilter === option.value ? 'active' : ''}`}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setIsStatusDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="controls-right">
                <div className="sort-section">
                  <SortBy onSortChange={setSortOption} currentSort={sortOption} />
                </div>
                <div className="view-toggle" style={{marginLeft: '32px'}}>
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                    <FiGrid size={18} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                    <FiList size={18} />
                </button>
                </div>
              </div>
            </div>

            <div className="questions-container">
              <div className={`questions-list ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {sortedResults.length === 0 ? (
                  <div className="no-results">
                    <h3>No results found</h3>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                ) : (
                  sortedResults.map((question) => (
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
                  ))
                )}
              </div>
            </div>
          </main>

          <aside className={`right-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <FiChevronRight />
            </button>
            {/* Sidebar content tylko jeśli nie jest zwinięty */}
            {!isSidebarCollapsed && <>
              <div className="search-tips">
                <h3>Search Tips</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <strong>Use quotes</strong> for exact phrases
                  </div>
                  <div className="tip-item">
                    <strong>Add tags</strong> to narrow results
                  </div>
                  <div className="tip-item">
                    <strong>Try synonyms</strong> for better matches
                  </div>
                </div>
              </div>
              <div className="tags-section">
                <h3>Popular Tags</h3>
                <div className="tags-list">
                  {["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript", "CSS", "Machine Learning", "SQL", "Node.js"].map(tag => (
                    <div key={tag} className="tag tag-clickable" onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/search?q=${encodeURIComponent(tag)}`);
                    }}>{tag}</div>
            ))}
          </div>
              </div>
            </>}
          </aside>
        </div>
    </div>

      <Modal 
        isOpen={isNotificationModalOpen} 
        onClose={() => setIsNotificationModalOpen(false)}
        size="large"
        title="Notifications"
      >
        <Notifications 
          onClose={() => setIsNotificationModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default SearchPage;