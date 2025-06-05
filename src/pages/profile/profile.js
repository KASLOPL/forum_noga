import React, { useState } from 'react';
import './profile.css';
import {
  FiSearch, FiArrowLeft, FiMail, FiHome, FiUsers, FiMessageSquare,
  FiPlus, FiMinus, FiZap, FiChevronDown, FiBookmark, FiUser,
  FiHelpCircle, FiMoreVertical, FiHeart, FiEye
} from 'react-icons/fi';
import { ThumbsUp, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  // Nawigacja i stan użytkownika
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Funkcje pomocnicze
  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };

  // Stany komponentu
  const [activeTab, setActiveTab] = useState('Questions & Replies');
  const [tags, setTags] = useState([
    'Python', 'Java', 'SQL', 'html', 'css', 'javascript', 'react',
    'node.js', 'flask', 'arduino', 'linux', 'database', 'networking',
    'school_project', 'teamwork', 'presentation', 'figma', 'ux/ui', 'pitch_deck'
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dane użytkownika
  const user = {
    name: 'Basjan Kojko',
    username: '@basjan.kojko',
    school: 'Zespół Szkół Energetycznych Technikum nr 13',
    bio: 'Klepię kod jak combo w ulubionych grze, bo nie ma lepszego uczucia niż zobaczyć jak wszystko w końcu działa 😎'
  };

  // Funkcje do obsługi tagów
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Nawigacja
  const navLinks = [
    { icon: <FiHome size={16} />, text: 'Home', active: false, path: '/main' }, 
    { icon: <FiMessageSquare size={16} />, text: 'Notifications', active: false },
    { icon: <FiUsers size={16} />, text: 'Specialists', active: false },
    { icon: <FiUser size={16} />, text: 'My Questions', active: false, path: '/my_questions' },
    { icon: <FiBookmark size={16} />, text: 'Bookmarks', active: false, path: '/zakładki'}
  ];

  // Przykładowe pytania
  const questions = [
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
  ];

  return (
    <div className='Profall'>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="navbar">
            <div className="left-section">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft size={20} />
              </button>
              <div className="logo">
                <div className="logo-icon"><FiZap size={20} /></div>
                <span className="logo-text">Snap<span className="highlight">solve</span></span>
              </div>
            </div>

            <nav className="nav">
              <ul>
                {navLinks.map((item, i) => (
                  <li key={i} className={item.active ? 'active' : ''}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      if (item.path) navigate(item.path);
                    }}>
                      {item.icon}{item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="right-nav">
              <button className="icon-btn"><FiMail size={20} /></button>
              <div className="user-profile" onClick={() => navigate('/profile')}>
                <div className="avatar"><span>{getUserInitials()}</span></div>
                <div className="user-info">
                  <div className="name">{getUserDisplayName()}</div>
                  <div className="role">Student</div>
                </div>
                <FiChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        <div className="main">
          <aside className="sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">BK</div>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-username">{user.username}</p>
                <p className="profile-school">{user.school}</p>
              </div>
              <div className="profile-bio">
                <p>{user.bio}</p>
              </div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-num">23</div>
                  <div className="stat-label">Questions</div>
                </div>
                <div className="stat">
                  <div className="stat-num">47</div>
                  <div className="stat-label">Answers</div>
                </div>
                <div className="stat">
                  <div className="stat-num">156</div>
                  <div className="stat-label">Likes</div>
                </div>
              </div>
            </div>

            <div className="interests">
              <h3>Interests</h3>
              <div className="tags-container">
                <div className="selected-tags">
                  {selectedTags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button 
                        className="tag-remove" 
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="dropdown-container">
                  <button 
                    className="dropdown-toggle"
                    onClick={toggleDropdown}
                  >
                    Select your interests
                    <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {tags
                        .filter(tag => !selectedTags.includes(tag))
                        .map((tag, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleTagSelect(tag)}
                          >
                            {tag}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <main className="content">
            <div className="content-header">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'Questions & Replies' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Questions & Replies')}
                >
                  Questions & Replies
                </button>
                <button 
                  className={`tab ${activeTab === 'Questions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Questions')}
                >
                  Questions
                </button>
              </div>
              <div className="actions">
                <button className="btn-edit">Edit profile</button>
                <button className="btn-settings">Settings</button>
              </div>
            </div>

            <div className="questions">
              {questions.map((question) => (
                <div className="question" key={question.id}>
                  <div className="question-header">
                    <div className="user-avatar">{question.author.substring(0, 2)}</div>
                    <div className="meta">
                      <div className="author-name">{question.author}</div>
                      <div className="author-time">{question.timeAgo}</div>
                    </div>
                    <button className="menu-btn"><FiMoreVertical size={16} /></button>
                  </div>
                  
                  <div className="question-content">
                    <div className="question-highlight">
                      <h3>{question.highlight}</h3>
                    </div>
                    
                    <div className="content-tags">
                      {question.tags.map((tag, i) => (
                        <span key={i} className="content-tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="question-text">
                      <p>{question.content}</p>
                    </div>
                  </div>

                  <div className="question-footer">
                    <div className="reactions">
                      {Array.from({ length: question.responders }, (_, i) => (
                        <div key={i} className="reaction">{String.fromCharCode(65 + i)}</div>
                      ))}
                    </div>
                    
                    <div className="engagement">
                      <span className="engagement-item">
                        <FiHeart size={14} /> {question.likes}
                      </span>
                      <span className="engagement-item">
                        <FiEye size={14} /> {question.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;