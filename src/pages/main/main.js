import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./main.css";

// Ikony z react-icons
import {
  FiBookmark,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";

function Main() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // id pytania ktore jest rozwijane
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [questions] = useState([
    {
      id: 1,
      author: "Anna K.",
      timeAgo: "2 godziny temu",
      highlight: "Jak zoptymalizować zapytania SQL w dużej bazie danych?",
      tags: ["SQL", "Database", "Performance"],
      content: "Mam problem z wydajnością zapytań SQL w bazie danych zawierającej miliony rekordów...",
      fullContent: "Pracuję nad aplikacją, która musi przetwarzać duże ilości danych...",
      likes: 23,
      views: 1284,
      responders: 3
    },
    {
      id: 2,
      author: "Tomasz M.",
      timeAgo: "4 godziny temu",
      highlight: "React Hook useEffect - problem z nieskończoną pętlą",
      tags: ["React", "JavaScript", "Hooks"],
      content: "Mój useEffect wchodzi w nieskończoną pętlą rerenderowania...",
      fullContent: "Pracuję nad komponentem React, który ma pobierać dane z API...",
      likes: 45,
      views: 892,
      responders: 5
    },
    {
      id: 3,
      author: "Michał P.",
      timeAgo: "6 godzin temu",
      highlight: "Algorytmy sortowania - który wybrać dla dużych zbiorów danych?",
      tags: ["Algorithms", "Performance", "Data Structures"],
      content: "Potrzebuję posortować tablicę z 100,000+ elementów...",
      fullContent: "Pracuję nad aplikacją, która musi sortować bardzo duże zbiory danych...",
      likes: 31,
      views: 567,
      responders: 4
    },
    {
      id: 4,
      author: "Julia W.",
      timeAgo: "8 godzin temu",
      highlight: "CSS Grid vs Flexbox - kiedy używać którego?",
      tags: ["CSS", "Layout", "Frontend"],
      content: "Ciągle się zastanawiam, kiedy powinienem używać CSS Grid...",
      fullContent: "Uczę się nowoczesnego CSS-a i mam problem z wyborem między Grid a Flexbox...",
      likes: 18,
      views: 743,
      responders: 6
    }
  ]);

  // Wylogowanie
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');  // po wylogowaniu idziemy do logowania (strona główna teraz to logowanie)
  };

  // Sprawdzenie, czy użytkownik jest zalogowany (czy isLoggedIn istnieje i czy jego wartość to true)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/');  // jeśli nie jest zalogowany to przekieruj na stronę logowania
    }
  }, [navigate]);

  // Rozwijanie i zwijanie pytań (tylko jedno naraz - toggleQuestion)
  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="caloscMain">
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="header-container">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            <div className="search-group">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <input className="search-input" placeholder="Got a question? See if it's already asked!" type="text" />
                </div>
              </div>
              <button className="add-button" onClick={() => navigate('/addquestion')}>
                <FiPlus />
              </button>
              <div className="sort-dropdown">
                <span>Sort by</span>
                <FiChevronDown />
              </div>
            </div>

            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-button"><FiMoon /></button>
              <button className="icon-button"><FiMail /></button>
              <div className="user-profile" onClick={() => navigate('/profile')}>
                <div className="avatar">
                  <span>{currentUser?.name?.substring(0, 2) || 'GU'}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser?.name || 'Guest'}</span>
                  <span className="user-role">Student</span>
                </div>
                <FiChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <div className="main-container">

          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-content">
              <div className="add-question-button-container">
                <button className="add-question-button" onClick={() => navigate('/addquestion')}>
                  <span>ADD QUESTION</span>
                  <div className="plus-icon-container"><FiPlus /></div>
                </button>
              </div>

              <nav className="sidebar-nav">
                {/* zmienione na navigate zamiast href, home do main.js */}
                <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/main'); }}><FiHome /><span>Home</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}><FiMessageSquare /><span>Notifications</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/specialists'); }}><FiUsers /><span>Specialists</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/myquestions'); }}><FiUser /><span>My Questions</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/zakładki'); }}><FiBookmark /><span>Bookmarks</span></a>
              </nav>

              <div className="sidebar-nav-secondary">
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}><FiSettings /><span>Settings</span></a>
                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/help'); }}><FiHelpCircle /><span>Help & FAQ</span></a>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="sign-out-button" onClick={handleLogout}>
                <FiLogOut /> Sign out
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            <div className="welcome-banner">
              <h1>Hi, {currentUser?.name || 'Guest'}!</h1>
              <p>
                Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!
              </p>
            </div>

            <div className="posts-count">{questions.length} posts</div>

            <div className="question-cards-container">
              <div className="question-cards">
                {questions.map((question) => (
                  <div key={question.id} className="question-card">
                    <div className="question-card-header">
                      <div className="question-author">
                        <div className="avatar"><span>{question.author.substring(0, 2)}</span></div>
                        <div className="author-info">
                          <div className="author-name">{question.author}</div>
                          <div className="author-time">{question.timeAgo}</div>
                        </div>
                      </div>
                      <div className="question-actions">
                        <button className="icon-button"><FiBookmark /></button>
                        <button className="icon-button"><FiMoreVertical /></button>
                      </div>
                    </div>

                    <div className="question-highlight"><h3>{question.highlight}</h3></div>

                    <div className="question-tags">
                      {question.tags.map((tag, index) => (
                        <div key={index} className="tag">{tag}</div>
                      ))}
                    </div>

                    <div className="question-content">
                      <p>{expandedQuestion === question.id ? question.fullContent : question.content}</p>
                      <button className="expand-button" onClick={() => toggleQuestion(question.id)}>
                        {expandedQuestion === question.id ? <><span>Show less</span><FiChevronUp /></> : <><span>Read more</span><FiChevronDown /></>}
                      </button>
                    </div>

                    <div className="question-footer">
                      <div className="question-responders">
                        {Array.from({ length: question.responders }, (_, i) => (
                          <div key={i} className="avatar avatar-small"><span>{String.fromCharCode(65 + i)}</span></div>
                        ))}
                      </div>

                      <div className="question-stats">
                        <div className="stat"><FiHeart className="heart-icon" /><span>{question.likes}</span></div>
                        <div className="stat"><FiEye /><span>{question.views}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
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
                    <div className="avatar avatar-small"><span>{expert.name.split(' ').map(n => n[0]).join('')}</span></div>
                    <div className="expert-details">
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
