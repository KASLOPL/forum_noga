import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./main.css";
import defaultQuestions from '../../data/questions';

import {
  FiBookmark, FiChevronDown, FiChevronUp, FiEye, FiHeart, FiHelpCircle,
  FiHome, FiLogOut, FiMail, FiMessageSquare, FiMoon, FiMoreVertical,
  FiPlus, FiSearch, FiSettings, FiUser, FiUsers, FiZap
} from "react-icons/fi";

const useBookmarks = () => {
  // zmienna i funckja do zmiany jej 
  const [bookmarks, setBookmarks] = useState(() => {
    // wyjmuje bookarki jak sa takie z localstorage 
    const saved = localStorage.getItem("bookmarks");
    // jak nie pusta tablica 
    return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });

  // kiedy cos sie zmieni w zakladkach odrazu zapisuje sie w localStorage 
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // dodawanie zakladek 
  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      // czy juz jest zapisana 
      const isBookmarked = prev.some(b => b.id === item.id);
      return isBookmarked 
      // jak jest usuwa ja 
        ? prev.filter(b => b.id !== item.id) 
        // jak niema dodaje ja 
        : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  // sprawdza czy zakladka o takim id jest juz dodana 
  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);
  return { toggleBookmark, isBookmarked };
};

function Main() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  // rozwijanie pytan na poczatku zadne nie jest
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  // pobiera funkcje z bookmarks 
  const { toggleBookmark, isBookmarked } = useBookmarks();

  // lista polubionych pytan albo zadne 
  const [likedQuestions, setLikedQuestions] = useState(() => {
  const saved = localStorage.getItem("likedQuestions");
  return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
  });  

  // wyswietla pytania dodane jesli niema zadnych to domyslne zawsze 
  const [questions, setQuestions] = useState(() => {
  const saved = localStorage.getItem("questions");
  const localQuestions = saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    return saved && saved !== 'undefined' ? JSON.parse(saved) : defaultQuestions;
  });

  // jak cos sie zmienia zapisuje sie to odrazu w localstorage
  useEffect(() => {
  localStorage.setItem("likedQuestions", JSON.stringify(likedQuestions));
}, [likedQuestions]);


  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const goTo = useCallback((path) => navigate(path), [navigate]);

  // wylogowywanie i zerowanie zmian
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('likedQuestions');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  // rozwijanie pytan
  const toggleQuestion = useCallback((questionId, e) => {
    e.stopPropagation();
    setExpandedQuestion(prev => prev === questionId ? null // zwija je 
    : questionId); // rozwija 
  }, []);

  // dodawanie i usuwanie zakladek 
  const bookmarkClick = useCallback((question, e) => {
    e.stopPropagation();
    // uzywa togglequestion ( dodawanie i usuwanie )
    toggleBookmark(question);
  }, [toggleBookmark]);

  // klikniecie na pytanie przenosi do odpowiedzi 
  const cardClick = useCallback((question) => {
    navigate(`/answer_q/${question.id}`, { state: { question } });
  }, [navigate]);

  const getUserName = () => {
    return user?.userName || user?.name || 'Guest';
  };

  const getUserInitials = () => {
    const name = getUserName();
    if (name === 'Guest') return 'GU';
    return name.substring(0, 2).toUpperCase();
  };
console.log('questions:', questions, 'isArray:', Array.isArray(questions));

// polubienia 
const likeClick = (questionId, e) => {
  e.stopPropagation();
  
  const isAlreadyLiked = likedQuestions.includes(questionId);
  
  // sprawdza czy polubiona z listy filter
  if (isAlreadyLiked) {
    const newLiked = likedQuestions.filter(id => id !== questionId);
    setLikedQuestions(newLiked);
    
    // jesli polubione -1
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, likes: q.likes - 1 } : q
    ));
    
  } else {
    // jesli nie polubione +1
    const newLiked = [...likedQuestions, questionId];
    setLikedQuestions(newLiked);
    
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, likes: q.likes + 1 } : q
    ));
  }
};
  return (
    <div className="app-main">
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-content">
            {/* LOGO */}
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
          {/* NAWIGACJA  */}
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

          {/* BANER MAIN */}
          <main className="content">
            <div className="welcome-banner">
              <h1>Hi, {getUserName()}!</h1>
              <p>
                Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!
              </p>
            </div>

            {/* PYTANIA  */}
            <div className="posts-count">{questions.length} posts</div>
            <div className="questions-container">
              <div className="questions-list">
                {Array.isArray(questions) && questions.map((question) => (
                  <div 
                  // klikanie na pytanie i zmiana kursora
                    key={question.id} 
                    className="question-card"
                    onClick={() => cardClick(question)}
                    style={{ cursor: 'pointer' }}
                  >
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
                        <button 
                          className={`icon-btn ${isBookmarked(question.id) ? 'bookmarked' : ''}`}
                          onClick={(e) => bookmarkClick(question, e)}
                        >
                          <FiBookmark style={{ fill: isBookmarked(question.id) ? '#4CAF50' : 'none' }} />
                        </button>
                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); }}><FiMoreVertical /></button> 
                      </div>
                    </div>

                    <div className="question-title"><h3>{question.highlight}</h3></div>

                    <div className="question-content">
                      <p>{expandedQuestion === question.id ? question.fullContent : question.content}</p>
                      <button className="expand-btn" onClick={(e) => toggleQuestion(question.id, e)}>
                        {expandedQuestion === question.id ? <><span>Show less</span><FiChevronUp /></> : <><span>Read more</span><FiChevronDown /></>}
                      </button>
                    </div>

                    <div className="card-footer" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="responders">
                        {/* lista ludzi odpowiadajacych */}
                        {Array.from({ length: question.responders }, (_, i) => (
                          // niby ludzie ktorzy odpowiedzieli
                          <div key={i} className="avatar avatar-small"><span>{String.fromCharCode(65 + i)}</span></div>
                        ))}
                      </div>

                      <div className="stats">
                        <div 
                          className="stat like-btn" 
                          onClick={(e) => likeClick(question.id, e)}
                        >
                          <FiHeart 
                          className="heart-icon" 
                        style={{ 
                          fill: likedQuestions.includes(question.id) ? '#ff4757' : 'none',
                          color: likedQuestions.includes(question.id) ? '#ff4757' : '#666'
                        }} 
                      />
                        <span>{question.likes}</span>
                      </div>
                        <div className="stat"><FiEye /><span>{question.views}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* EKSPERCI */}
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
                  // kazdy ma imie i specjalizacje 
                  <div key={index} className="expert-item">
                    <div className="avatar avatar-small"><span>{expert.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="expert-info">
                      <div className="expert-name">{expert.name}</div>
                      <div className="expert-specialty">{expert.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                {/* TAGI */}
            <div className="tags-section">
              <h3>Popular Tags</h3>
              <div className="tags-list">
                {["Python", "GitHub", "Data Structures", "React.js", "Java", "JavaScript", "CSS", "Machine Learning", "SQL", "Node.js"].map(tag => (
                  // kazdy mozna klikac 
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