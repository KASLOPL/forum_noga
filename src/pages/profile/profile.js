import React, { useState, useEffect } from 'react';
import './profile.css';
import {
  FiSearch, FiArrowLeft, FiMail, FiHome, FiUsers, FiMessageSquare,
  FiPlus, FiMinus, FiZap, FiChevronDown, FiBookmark, FiUser,
  FiHelpCircle, FiMoreVertical, FiHeart, FiEye, FiCheck, FiX
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getAllQuestions } from '../../utils/firebaseUtils';
import EditProfile from '../edit_prof/edit_profile';

const Modal = ({ isOpen, onClose, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    full: 'max-w-xl'
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className={`modal-content ${sizeClasses[size]}`}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '85vh',
          overflowY: 'auto', // <-- TUTAJ SCROLL
          overflowX: 'hidden',
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Usuwamy overflow z tego wrappera */}
        {children}
      </div>
    </div>
  );
};


const Profile = () => {
  const navigate = useNavigate();
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Pobieranie danych aktualnego użytkownika z localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        if (parsedUser.selectedTags) setSelectedTags(parsedUser.selectedTags);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Pobieranie pytan użytkownika z bazy danych
  useEffect(() => {
    const loadUserQuestions = async () => {
      if (!currentUser?.userName) return;
      setLoading(true);
      try {
        const result = await getAllQuestions();
        if (result.success) {
          const myQuestions = result.questions.filter(q => q.author === currentUser.userName);
          setUserQuestions(myQuestions);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserQuestions();
  }, [currentUser]);

  const getUserDisplayName = () => currentUser?.userName || currentUser?.name || 'Guest';
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName === 'Guest' ? 'GU' : displayName.substring(0, 2).toUpperCase();
  };

  const tags = [
    'Python', 'Java', 'SQL', 'html', 'css', 'javascript', 'react',
    'node.js', 'flask', 'arduino', 'linux', 'database', 'networking',
    'school_project', 'teamwork', 'presentation', 'figma', 'ux/ui', 'pitch_deck', 'other', 'none'
  ];

  const user = {
    name: currentUser?.userName || 'Guest User', 
    username: `@${currentUser?.userName?.toLowerCase().replace(' ', '.') || 'guest'}`,
    school: currentUser?.school || 'Zespół Szkół Energetycznych Technikum nr 13',
    bio: currentUser?.bio || 'Klepię kod jak combo w ulubionych grze, bo nie ma lepszego uczucia niż zobaczyć jak wszystko w końcu działa 😎'
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      if (currentUser) {
        const updatedUser = { ...currentUser, selectedTags: updatedTags };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    if (currentUser) {
      const updatedUser = { ...currentUser, selectedTags: updatedTags };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
  };

  // Funkcja do zapisywania zmian profilu
  const handleProfileSave = (newData) => {
    const updatedUser = {
      ...currentUser,
      userName: newData.name,
      school: newData.school,
      fieldOfStudy: newData.fieldOfStudy,
      bio: newData.bio
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsEditModalOpen(false); // Zamknij modal po zapisaniu
  };

  const navLinks = [
    { icon: <FiHome size={16} />, text: 'Home', path: '/main' },
    { icon: <FiMessageSquare size={16} />, text: 'Notifications' },
    { icon: <FiUsers size={16} />, text: 'Specialists' },
    { icon: <FiUser size={16} />, text: 'My Questions', path: '/my_questions' },
    { icon: <FiBookmark size={16} />, text: 'Bookmarks', path: '/zakładki'}
  ];

  const StatusBadge = ({ status }) => (
    <div className="status-badge" style={{ backgroundColor: status === 'complete' ? '#4CAF50' : '#FF9800' }}> 
      {status === 'complete' && <FiCheck />} 
      <span>{status === 'complete' ? 'Complete' : 'In Progress'}</span>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Loading user data...</div>;

  return (
    <div className='Profall'>
      <div className="app">
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
                  <li key={i}>
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
                <div className="profile-avatar">{getUserInitials()}</div>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-username">{user.username}</p>
                <p className="profile-school">{user.school}</p>
              </div>
              <div className="profile-bio">
                <p>{user.bio}</p>
              </div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-num">{userQuestions.length}</div>
                  <div className="stat-label">Questions</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{userQuestions.filter(q => q.status === 'complete').length}</div>
                  <div className="stat-label">Answers</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{userQuestions.reduce((sum, q) => sum + (q.likes || 0), 0)}</div>
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
                      <button className="tag-remove" onClick={() => handleRemoveTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="dropdown-container">
                  <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    Select your interests
                    <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {tags.filter(tag => !selectedTags.includes(tag)).map((tag, index) => (
                        <div key={index} className="dropdown-item" onClick={() => handleTagSelect(tag)}>
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
                <button className="tab active">Questions ({userQuestions.length})</button>
              </div>
              <div className="actions">
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit profile
                </button>
                <button className="btn-settings">Settings</button>
              </div>
            </div>

            <div className="questions">
              {userQuestions.length === 0 ? (
                <div className="no-questions">
                  <p>Nie masz jeszcze żadnych pytań.</p>
                </div>
              ) : (
                userQuestions.map((question) => (
                  <div className={`question ${question.status === 'complete' ? 'complete' : ''}`} key={question.id}>
                    <div className="question-header">
                      <div className="user-avatar">{getUserInitials()}</div>
                      <div className="meta">
                        <div className="author-name">{getUserDisplayName()}</div>
                        <div className="author-time">{question.timeAgo}</div>
                      </div>
                      <div className="question-actions">
                        <StatusBadge status={question.status || 'in_progress'} />
                        <button className="menu-btn"><FiMoreVertical size={16} /></button>
                      </div>
                    </div>
                
                    <div className="question-content">
                      <div className="question-highlight">
                        <h3>{question.title}</h3>
                      </div>
                      <div className="content-tags">
                        {question.tags && question.tags.map((tag, i) => (
                          <span key={i} className="content-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="question-text">
                        <p>{question.content}</p>
                      </div>
                    </div>
                
                    <div className="question-footer">
                      <div className="reactions">
                        {Array.from({ length: question.responseCount || question.responders || 0 }, (_, i) => (
                          <div key={i} className="reaction">{String.fromCharCode(65 + i)}</div>
                        ))}
                        <span className="responders-text">{question.responseCount || question.responders || 0} responses</span>
                      </div>
                      <div className="engagement">
                        <span className="engagement-item">
                          <FiHeart size={14} /> {question.likes || 0}
                        </span>
                        <span className="engagement-item">
                          <FiEye size={14} /> {question.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {/* Modal for editing profile */}
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          size="large"
        >
          <EditProfile 
            currentUser={currentUser}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleProfileSave}
          />
        </Modal>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;