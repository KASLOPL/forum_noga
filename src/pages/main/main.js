import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import "./main.css";
import { getAllQuestions, incrementViews, likeQuestion,unlikeQuestion } from '../../utils/firebaseUtils';
import Modal from '../notifications/Modal';
import Notifications from '../notifications/Notifications';
import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap 
} from "react-icons/fi"; 
import {useRedirectToHomeRootWhenNotLoggedIn} from "../../hooks/redirect_to_home_root_when_not_logged_in";
import SortBy from '../../components/sort_by/sort_by';
import Filters from '../../components/filters/filters';
import filtersImg from '../../images/filters.png';
import SearchPopout from '../../components/search_popout/search_popout';
import Sidebar from '../../components/side_bar/side_bar.js';
import QuestionField from '../../components/question_field/question_field';
import { usePaginatedPostsContext } from '../../hooks/paginated_posts_context';
import Pagination from '../../components/pagination/Pagination';

// pobiera zakladki z localstorage na profilu
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

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const getUserName = useCallback(() => user?.userName || user?.name || 'Guest', [user]);
  const getUserInitials = useCallback(() => {
    const name = getUserName();
    return name === 'Guest' ? 'GU' : name.substring(0, 2).toUpperCase();
  }, [getUserName]);

  return (
    <UserContext value={{ user, setUser, getUserName, getUserInitials }}>
      {children}
    </UserContext>
  );
};

function Main() {
  const navigate = useNavigate();
  const {user, setUser} = React.useContext(UserContext);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  // PAGINACJA z nową funkcją changeSort:
  const {
    posts: questions,
    loading,
    currentPage,
    totalPages,
    currentSort,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changeSort
  } = usePaginatedPostsContext();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // id pytan ladownych z localstorage
  const [likedQuestions, setLikedQuestions] = useState(() => {
    const saved = localStorage.getItem("likedQuestions");
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  const goTo = useCallback((path) => navigate(path), [navigate]);

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
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const loadQuestions = useCallback(async () => {
    if (!isLoggedIn) return;
    // Funkcjonalność przeniesiona do PaginatedPostsContext
  }, [isLoggedIn]);

  const likeClick = useCallback(async (questionId, e) => {
    e.stopPropagation();
    const isAlreadyLiked = likedQuestions.includes(questionId);
    
    if (isAlreadyLiked) {
      const result = await unlikeQuestion(questionId);
      if (result.success) {
        const newLiked = likedQuestions.filter(id => id !== questionId);
        setLikedQuestions(newLiked);
      }
    } else {
      const result = await likeQuestion(questionId);
      if (result.success) {
        const newLiked = [...likedQuestions, questionId];
        setLikedQuestions(newLiked);
      }
    }
  }, [likedQuestions]);

  const getUserName = useCallback(() => user?.userName || user?.name || 'Guest', [user]);
  const getUserInitials = useCallback(() => {
    const name = getUserName();
    return name === 'Guest' ? 'GU' : name.substring(0, 2).toUpperCase();
  }, [getUserName]);

  useRedirectToHomeRootWhenNotLoggedIn();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
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

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  React.useEffect(() => {
    if (!isSearchOpen) return;
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Sortowanie i filtrowanie pytań - teraz sortowanie jest już zrobione globalnie w bazie
  const displayedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return [];
    
    // Tylko filtrowanie lokalne (jeśli potrzebne) i priorytetyzacja według zainteresowań
    const userTags = user?.tags || user?.interests || [];
    
    // Jeśli użytkownik ma tagi, priorytetyzuj pytania z tymi tagami
    if (userTags.length > 0) {
      const matchingQuestions = questions.filter(q => 
        q.tags?.some(tag => userTags.includes(tag))
      );
      const otherQuestions = questions.filter(q => 
        !q.tags?.some(tag => userTags.includes(tag))
      );
      
      return [...matchingQuestions, ...otherQuestions];
    }
    
    return questions;
  }, [questions, user]);

  // Filter questions based on selected filters
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

  // Nowy handler sortowania używający changeSort z kontekstu
  const handleSortChange = useCallback((option) => {
    changeSort(option);
  }, [changeSort]);

  if (!user || !isLoggedIn) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Checking authentication...</div>
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
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
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
            <div className="welcome-banner">
              <h1>Hi, {getUserName()}!</h1>
              <p>Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!</p>
            </div>

            <div className="posts-count" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SortBy onSortChange={handleSortChange} currentSort={currentSort} />
              </div>
            </div>

            <div className="questions-container">
              <div className="questions-list" style={{ minHeight: 120 }}>
                {Array.isArray(displayedQuestions) && displayedQuestions.map((question) => (
                  <QuestionField
                    key={question.id}
                    question={question}
                    expandedQuestion={expandedQuestion}
                    onCardClick={cardClick}
                    onBookmarkClick={bookmarkClick}
                    isBookmarked={isBookmarked(question.id)}
                    onToggleExpand={toggleQuestion}
                    onLikeClick={likeClick}
                    liked={likedQuestions.includes(question.id)}
                  />
                ))}
              </div>
              <Pagination />
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
                  <div key={tag} className="tag tag-clickable" onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}>{tag}</div>
                ))}
              </div>
            </div>
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

export default Main;