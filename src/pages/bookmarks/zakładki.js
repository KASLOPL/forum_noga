import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import { FiBookmark, FiHome, FiLogOut, FiMessageSquare, FiPlus, FiSettings, FiUser, FiUsers, FiHelpCircle, FiZap } from 'react-icons/fi';
import './zakładki.css';

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      // zakladki w localStorage - pamiec przegladarki ladowe po starcie dopiero
      const saved = localStorage.getItem("bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // zapisuje nowy stan zakladek do localStorage - po usunieciu np
  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Save error:', error);
    }
  }, []);

  // automatyczny zapis gdy cos sie zmiania w zakladkach 
  useEffect(() => saveBookmarks(bookmarks), [bookmarks, saveBookmarks]);

  // usuwa albo dodaje zakladke w zaleznosci czy istnieje juz
  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      return exists ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  // usuwa zakladki po ich id 
  const removeBookmark = useCallback((id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  return { bookmarks, toggleBookmark, removeBookmark };
}

// rect.memo - zeby recat nie generowal od nowa tej samej zakladki w ktorej nic sie nie zmienilo
const BookmarkItem = React.memo(({ bookmark, onRemove }) => {
  // usuwa zakladke po kliknieciu przycisku
  const handleRemove = useCallback(() => onRemove(bookmark.id), [bookmark.id, onRemove]);

  return (
    <div className="bookmark-item">
      <div className="bookmark-content">
        <div className="bookmark-avatar">
          {(bookmark.author || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="bookmark-text">
          <div className="bookmark-title">
            {bookmark.title || bookmark.question || 'Untitled'}
          </div>
          <div className="bookmark-description">
            {bookmark.description || bookmark.content || 'No description'}
          </div>
          <div className="bookmark-separator">
            by {bookmark.author || 'Anonymous'}
          </div>
        </div>
      </div>
      <div className="bookmark-actions">
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

// strona kiedy niema zapisanych zadnych zakladek 
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
  // pzremieszczanie sie bez przeladowywania strony 
  const navigate = useNavigate();
  // aktywna podstrona teraz
  const [activeItem, setActiveItem] = useState('/bookmarks');
  // hook do zarzadzania zakladkami
  const { bookmarks, removeBookmark } = useBookmarks();

  // przechodznie do innych stron
  const handleNavigation = useCallback((path) => {
    setActiveItem(path);
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    // usuwa z localStorage informacje o zalogowanym urzytkowniku - przenosi do logowania
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') navigate('/');
    } catch {
      navigate('/');
    }
  }, [navigate]);

  // NAWIGACJA 
  const navItems = [
    { path: '/main', icon: FiHome, label: 'Home' },
    { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
    { path: '/specialists', icon: FiUsers, label: 'Specialists' },
    { path: '/myquestions', icon: FiUser, label: 'My Questions' },
    { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' }
  ];

  // POD NAWIGACJA
  const secondaryNavItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help & FAQ' }
  ];

  // podswietlenie zaladowanej teraz strony np
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
                // przenosi do formularza
                className="template-add-question-button" 
                onClick={() => handleNavigation('/addquestion')}
              >
                <span>ADD QUESTION</span>
                <div className="template-plus-icon-container"><FiPlus /></div>
              </button>
            </div>

            {/* tablica opisujaca kazda czesc nawigacji, nacitem ikona i + nazwa */}
            <nav className="template-sidebar-nav">
              {navItems.map(item => <NavItem key={item.path} item={item} />)}
            </nav>

            {/* menu z settings i help */}
            <div className="template-sidebar-nav-secondary">
              {secondaryNavItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>

          {/* wylogowywanie => do handleLogout */}
          <div className="template-sidebar-footer">
            <button className="template-sign-out-button" onClick={handleLogout}>
              {/* ikona  */}
              <FiLogOut /> Sign out
            </button>
          </div>
        </aside>

        <main className="template-main-content">
          <div className="bookmarks-main-content">
            {/* sprawdza czy jest jakas zakladka czy nie  */}
            {bookmarks.length === 0 ? (
              // jesli niema nic do funkcji EmptyState
              <EmptyState />
            ) : (
              // jesli nie jest pusta kazda zakladka swoje osobne dane oraz 
              // podlaczoan do funkcji ktora daje mozliwosc jej usuniecia 
              <div className="bookmark-list">
                {bookmarks.map(bookmark => (
                  <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    onRemove={removeBookmark}
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