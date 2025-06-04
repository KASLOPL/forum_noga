import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import { FiBookmark, FiHome, FiLogOut, FiMessageSquare, FiPlus, FiSettings, FiUser, FiUsers, FiHelpCircle, FiZap } from 'react-icons/fi';
import './zakładki.css';

function useBookmarks() {
  // localStorage jesli jakies pytania byly na tym koncie zadane to je wyswietli
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // zapisuje wszystkie dodanie zakladki w localstorage + zmiane
  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Save error:', error);
    }
  }, []);

  useEffect(() => saveBookmarks(bookmarks), [bookmarks, saveBookmarks]);

  // dodawanie i usuwanie zakladki
  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      return exists ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  // usuwa po id zakladke 
  const removeBookmark = useCallback((id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  return { bookmarks, toggleBookmark, removeBookmark };
}

// zabezpiecza jak klikasz naglowek to onclick nie widzi i nie przenosi cie do answer
const BookmarkItem = React.memo(({ bookmark, onRemove, onCardClick }) => {
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    onRemove(bookmark.id);
  }, [bookmark.id, onRemove]);

  const handleCardClick = useCallback(() => {
    onCardClick(bookmark);
  }, [bookmark, onCardClick]);

  // sprawdza pokoleji co zostalo dodane w formularzu i jak jest to dodaje to do wygladu zakladki - WYBOROWO
  const getTitle = () => bookmark.title || bookmark.highlight || bookmark.question || 'Untitled';
  const getDescription = () => bookmark.description || bookmark.content || bookmark.fullContent || 'No description';

  return (
    <div className="bookmark-item" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="bookmark-content">
        <div className="bookmark-avatar">
          {(bookmark.author || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="bookmark-text">
          <div className="bookmark-title">{getTitle()}</div>
          <div className="bookmark-description">{getDescription()}</div>
          <div className="bookmark-separator">
            by {bookmark.author || 'Anonymous'} • {bookmark.timeAgo || 'Recently'}
          </div>
        </div>
      </div>
      <div className="bookmark-actions" onClick={(e) => e.stopPropagation()}>
        <div className="bookmark-likes">
          <Heart size={16} className="heart-icon" />
          <span className="likes-count">{bookmark.likes || 0}</span>
        </div>
        <button className="bookmark-button" onClick={handleRemove} title="Remove bookmark">
          <Bookmark size={20} className="bookmark-icon" />
        </button>
      </div>
    </div>
  );
});

// Ggdy nie ZADNYCH zakladek to ekran domyslny
const EmptyState = React.memo(() => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <Bookmark size={48} />
    </div>
    <p>No bookmarks yet</p>
    <p>Save interesting questions and answers to find them easily later</p>
  </div>
));

function Zakladki() {
  // uzywanie hooka bookmarks oraz obsluga nawigacji na stronie 
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/bookmarks');
  const { bookmarks, removeBookmark } = useBookmarks();

  // zmiana aktywnego elementu na stronie w naiwgacji 
  const handleNavigation = useCallback((path) => {
    setActiveItem(path);
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  }, [navigate]);

  const handleCardClick = useCallback((bookmark) => {
    navigate(`/answer_q/${bookmark.id}`, { state: { question: bookmark } });
  }, [navigate]);

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') navigate('/');
    } catch {
      navigate('/');
    }
  }, [navigate]);

  const navItems = [
    { path: '/main', icon: FiHome, label: 'Home' },
    { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
    { path: '/specialists', icon: FiUsers, label: 'Specialists' },
    { path: '/my_questions', icon: FiUser, label: 'My Questions' },
    { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' }
  ];

  const secondaryNavItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help & FAQ' }
  ];

  // podswietalnie podstrony na ktorej jestes aktualnie oraz onclick
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <a
        href="#"
        className={`template-nav-item ${activeItem === item.path ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}
      >
        <Icon />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <div className='bookall'>
      <div className="template-app">
        <header className="template-header">
          <div className="template-header-container">
            <div className="template-logo">
              <div className="template-logo-icon"><FiZap /></div>
              <span className="template-logo-text">
                Snap<span className="template-logo-text-highlight">solve</span>
              </span>
            </div>
            <div className="template-header-title">
              <h1>TWOJE ZAKŁADKI</h1>
            </div>
          </div>
        </header>

        <div className="template-main-container">
          <aside className="template-sidebar">
            <div className="template-sidebar-content">
              <div className="template-add-question-button-container">
                <button 
                  className="template-add-question-button" 
                  onClick={() => handleNavigation('/addquestion')}
                >
                  <span>ADD QUESTION</span>
                  <div className="template-plus-icon-container"><FiPlus /></div>
                </button>
              </div>

              <nav className="template-sidebar-nav">
                {navItems.map(item => <NavItem key={item.path} item={item} />)}
              </nav>

              <div className="template-sidebar-nav-secondary">
                {secondaryNavItems.map(item => <NavItem key={item.path} item={item} />)}
              </div>
            </div>

            <div className="template-sidebar-footer">
              <button className="template-sign-out-button" onClick={handleLogout}>
                <FiLogOut /> Sign out
              </button>
            </div>
          </aside>

          <main className="template-main-content">
            <div className="bookmarks-main-content">
              {bookmarks.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="bookmark-list">
                  {bookmarks.map(bookmark => (
                    <BookmarkItem
                      key={bookmark.id}
                      bookmark={bookmark}
                      onRemove={removeBookmark}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Zakladki;