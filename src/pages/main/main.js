import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import "./main.css";
import { getAllQuestions, incrementViews, likeQuestion } from '../../utils/firebaseUtils';
import Modal from '../notifications/Modal'; // Import komponentu Modal
import Notifications from '../notifications/Notifications'; // Import komponentu Notifications
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

// pobiera zakladki z localstorage na profilu
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    // jesli nie pusta tablica = strona
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  // kiedy zmieni sie bookmarks automatycznie zapisuje sie w localstorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // usuwanie i dodawanie zakladek 
  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(b => b.id === item.id);
      return isBookmarked 
        ? prev.filter(b => b.id !== item.id) 
        : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  // sprawdza czy element o tym id jest w zakladkach 
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Dodaj stan dla modal notifications
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // id pytan ladownych z localstorage
  const [likedQuestions, setLikedQuestions] = useState(() => {
    const saved = localStorage.getItem("likedQuestions");
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  // funkcja do nawigacji 
  const goTo = useCallback((path) => navigate(path), [navigate]);
  // wylogowywanie i usuwanie danych z localstorage
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('likedQuestions');
    navigate('/', { replace: true });
  }, [navigate]);

  // zwijanie i rozwijanie pytan w zalenzosci w jakim stanie sa 
  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  }, []);

  // klikanie w zakladke czyli ikone do zapisywania
  const bookmarkClick = useCallback((question, e) => {
    e.stopPropagation();
    toggleBookmark(question);
  }, [toggleBookmark]);

  // klikanie w pytanie na stronie do answer przekierowuje 
  const cardClick = useCallback(async (question) => {
    await incrementViews(question.id);
    // zwiekszanie liczbe wyswietlen o wejsciu i zapisuje w bazie danych je 
    setQuestions(prev => prev.map(q => 
      q.id === question.id ? { ...q, views: (q.views || 0) + 1 } : q
    ));
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  // laduje pytania z bazy danych 
  const loadQuestions = useCallback(async () => {
    if (!isLoggedIn) return; // jesli zalogowany urzytkownik
    setLoading(true);
    const result = await getAllQuestions(); // pobiera dane z firebase 
    if (result.success) {
      setQuestions(result.questions); // aktualizuje pytania 
    }
    setLoading(false);
  }, [isLoggedIn]);

  // polubianie pytan 
  const likeClick = useCallback(async (questionId, e) => {
    e.stopPropagation();
    const isAlreadyLiked = likedQuestions.includes(questionId);
    
    if (isAlreadyLiked) {
      // jesli jest polubione usuwa loklanie i w bazie 
      const newLiked = likedQuestions.filter(id => id !== questionId);
      setLikedQuestions(newLiked);
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, likes: Math.max((q.likes || 0) - 1, 0) } : q
      ));
    } else {
      const result = await likeQuestion(questionId);
      if (result.success) {
        const newLiked = [...likedQuestions, questionId];
        // jesli nie jest dodaje lokalnie i w bazie 
        setLikedQuestions(newLiked);
        setQuestions(prev => prev.map(q => 
          q.id === questionId ? { ...q, likes: (q.likes || 0) + 1 } : q
        ));
      }
    }
  }, [likedQuestions]);

  // pobiera imie urzytkownika i tworzy inicjaly 
  const getUserName = useCallback(() => user?.userName || user?.name || 'Guest', [user]);
  const getUserInitials = useCallback(() => {
    const name = getUserName();
    return name === 'Guest' ? 'GU' : name.substring(0, 2).toUpperCase();
  }, [getUserName]);

  useRedirectToHomeRootWhenNotLoggedIn();

  // wylogowanie jesli podczas zaladowywanie wykruje blad
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

  // ladowanie pytan gdy zaloguje sie urzytkownik 
  useEffect(() => {
    if (isLoggedIn) loadQuestions();
  }, [isLoggedIn, loadQuestions]);

  // zapisywanie polubionych pytan w localstorage 
  useEffect(() => {
    localStorage.setItem("likedQuestions", JSON.stringify(likedQuestions));
  }, [likedQuestions]);

  const [sortOption, setSortOption] = useState({ value: 'newest', label: 'Newest first' });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // Sorting logic for questions
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

  // Filter questions based on selected filters
  const filterQuestions = (questions, filters) => {
    if (!filters || Object.keys(filters).every(key => !filters[key] || filters[key].length === 0)) {
      return questions;
    }

    return questions.filter(question => {
      // Filter by category
      if (filters.category && filters.category.length > 0) {
        if (!question.category || !filters.category.includes(question.category)) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        if (!question.tags || !filters.tags.some(tag => question.tags.includes(tag))) {
          return false;
        }
      }

      // Filter by question type
      if (filters.questionType && filters.questionType.length > 0) {
        if (!question.type || !filters.questionType.includes(question.type)) {
          return false;
        }
      }

      return true;
    });
  };

  // ekran po zalogowaniu
  if (!user || !isLoggedIn) {
    return (
      <div className="app-main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Checking authentication...</div>
        </div>
      </div>
    );
  }

  // sortowanie pytan - pierszenstwo maja te z zainteresowaniami urzytkownika potem reszta
  const userTags = user?.tags || user?.interests || [];
  // pytania ktore zgadzaja sie przynajmniej jednym z zainteresowaniami
  const filteredQuestions = questions.filter(q => q.tags?.some(tag => userTags.includes(tag)));
  // inne
  const remainingQuestions = questions.filter(q => !filteredQuestions.includes(q));
  // poukladaj od tych pod urzytkownika do tych nie pasujacyh w tej kolejnosci 
  const orderedQuestions = sortQuestions([...filteredQuestions, ...remainingQuestions], sortOption);

  // ladowanie strony na srodku napis loading 
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
                    className={`search-input${isSearchOpen ? ' search-input--active' : ''}`}
                    placeholder="Got a question? See if it's already asked!"
                    type="text"
                    onFocus={() => setIsSearchOpen(true)}
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

            {/* HEADER */}
            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-btn"><FiMoon /></button>
              {/* Zaktualizowany przycisk dla notifications */}
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

        {/* NAWIGACJA  */}
        <div className="main-container">
          <aside className="sidebar">
            <div className="sidebar-content">
              <div className="add-question-section">
                {/* pytanie dodaj */}
                <button className="add-question-btn" onClick={() => goTo('/addquestion')}>
                  <span>ADD QUESTION</span>
                  <div className="plus-icon"><FiPlus /></div>
                </button>
              </div>

              <nav className="nav">
                <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); goTo('/main'); }}><FiHome /><span>Home</span></a>
                {/* Zaktualizowany link do notifications */}
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setIsNotificationModalOpen(true); }}><FiMessageSquare /><span>Notifications</span></a>
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

          {/* BANER */}
          <main className="content">
            <div className="welcome-banner">
              <h1>Hi, {getUserName()}!</h1>
              <p>Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!</p>
            </div>

              {/* PYTANIE */}
            <div className="posts-count" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{questions.length} posts</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <SortBy onSortChange={setSortOption} currentSort={sortOption} />
              </div>
            </div>

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
                        {/* styl i klikniecie na ikone zakladki  */}
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
                      {/* tersc pytania rozwinieta albo nie  */}
                      <p>{expandedQuestion === question.id ? question.fullContent : question.content}</p>
                      {question.fullContent && question.fullContent !== question.content && (
                        <button className="expand-btn" onClick={(e) => toggleQuestion(question.id, e)}>
                          {expandedQuestion === question.id ? 
                          // rozwijanie z ikonami 
                            <><span>Show less</span><FiChevronUp /></> : 
                            <><span>Read more</span><FiChevronDown /></>
                          }
                        </button>
                      )}
                    </div>

                    <div className="card-footer" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="responders">
                        {/* awatary i ilosc losowa oraz litery na nich z kodu ascii dlatego liczby  */}
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
                              // zmiana wygaldu serca po polubieniu itp
                              fill: likedQuestions.includes(question.id) ? '#ff4757' : 'none',
                              color: likedQuestions.includes(question.id) ? '#ff4757' : '#666'
                            }} 
                          />
                          <span>{question.likes || 0}</span>
                        </div>
                        {/* ile osob zobaczylo */}
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
                {/* lista ekspertow  */}
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
                      {/* kazdy ma imie i specializacje  */}
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
                {/* lista tagow i tworzenie im osobnych divow ( jako osobne elemnty ) */}
                {["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript", "CSS", "Machine Learning", "SQL", "Node.js"].map(tag => (
                  <div key={tag} className="tag tag-clickable">{tag}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal for notifications */}
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