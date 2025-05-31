import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import {
  FiBookmark,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiPlus,
  FiSettings,
  FiUser,
  FiUsers,
  FiHelpCircle,
  FiZap
} from 'react-icons/fi';
import './zakładki.css';

// Custom hook for managing bookmarks with optimizations
function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const savedBookmarks = localStorage.getItem("bookmarks");
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  });

  // Memoized save function to prevent unnecessary updates
  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, []);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks, saveBookmarks]);

  // Optimized bookmark operations with useCallback
  const addBookmark = useCallback((item) => {
    setBookmarks((prevBookmarks) => {
      if (prevBookmarks.some((bookmark) => bookmark.id === item.id)) {
        return prevBookmarks;
      }
      return [...prevBookmarks, { ...item, isBookmarked: true }];
    });
  }, []);

  const removeBookmark = useCallback((id) => {
    setBookmarks((prevBookmarks) => 
      prevBookmarks.filter((bookmark) => bookmark.id !== id)
    );
  }, []);

  const toggleBookmark = useCallback((item) => {
    setBookmarks((prevBookmarks) => {
      const isCurrentlyBookmarked = prevBookmarks.some((bookmark) => bookmark.id === item.id);
      if (isCurrentlyBookmarked) {
        return prevBookmarks.filter((bookmark) => bookmark.id !== item.id);
      } else {
        return [...prevBookmarks, { ...item, isBookmarked: true }];
      }
    });
  }, []);

  const isBookmarked = useCallback((id) => {
    return bookmarks.some((bookmark) => bookmark.id === id);
  }, [bookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
}

// BookmarkItem component for better performance
const BookmarkItem = React.memo(({ bookmark, onRemove }) => {
  const handleRemove = useCallback(() => {
    onRemove(bookmark.id);
  }, [bookmark.id, onRemove]);

  return (
    <div className="bookmark-item">
      <div className="bookmark-content">
        <div className="bookmark-avatar">
          {bookmark.author ? bookmark.author.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="bookmark-text">
          <div className="bookmark-title">
            {bookmark.title || bookmark.question || 'Untitled'}
          </div>
          <div className="bookmark-description">
            {bookmark.description || bookmark.content || 'No description available'}
          </div>
          <div className="bookmark-separator">
            by {bookmark.author || 'Anonymous'}
          </div>
        </div>
      </div>
      <div className="bookmark-actions">
        <div className="bookmark-likes">
          <Heart size={16} className="heart-icon" />
          <span className="likes-count">
            {bookmark.likes || 0}
          </span>
        </div>
        <button
          className="bookmark-button"
          onClick={handleRemove}
          title="Remove bookmark"
          aria-label={`Remove bookmark: ${bookmark.title || bookmark.question || 'Untitled'}`}
        >
          <Bookmark size={20} className="bookmark-icon" />
        </button>
      </div>
    </div>
  );
});

// Empty state component
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
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/bookmarks');
  const { bookmarks, removeBookmark } = useBookmarks();
  
  // Memoized current user to prevent unnecessary re-renders
  const currentUser = useMemo(() => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing current user:', error);
      return null;
    }
  }, []);

  // Optimized navigation handlers
  const handleNavigation = useCallback((path) => {
    setActiveItem(path);
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  }, [navigate]);

  // Authentication check with error handling
  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn !== 'true') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      navigate('/');
    }
  }, [navigate]);

  // Memoized bookmark list to prevent unnecessary re-renders
  const bookmarkList = useMemo(() => (
    bookmarks.map((bookmark) => (
      <BookmarkItem
        key={bookmark.id}
        bookmark={bookmark}
        onRemove={removeBookmark}
      />
    ))
  ), [bookmarks, removeBookmark]);

  return (
    <div className="template-app">
      {/* HEADER */}
      <header className="template-header">
        <div className="template-header-container">
          <div className="template-logo-container">
            <div className="template-logo">
              <div className="template-logo-icon">
                <FiZap />
              </div>
              <span className="template-logo-text">
                Snap<span className="template-logo-text-highlight">solve</span>
              </span>
            </div>
          </div>
          <div className="template-header-title">
            <h1>TWOJE ZAKŁADKI</h1>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="template-main-container">
        {/* LEFT SIDEBAR */}
        <aside className="template-sidebar">
          <div className="template-sidebar-content">
            <div className="template-add-question-button-container">
              <button 
                className="template-add-question-button" 
                onClick={() => handleNavigation('/addquestion')}
              >
                <span>ADD QUESTION</span>
                <div className="template-plus-icon-container">
                  <FiPlus />
                </div>
              </button>
            </div>

            <nav className="template-sidebar-nav">
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/main' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/main'); }}
              >
                <FiHome />
                <span>Home</span>
              </a>
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/notifications' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/notifications'); }}
              >
                <FiMessageSquare />
                <span>Notifications</span>
              </a>
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/specialists' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/specialists'); }}
              >
                <FiUsers />
                <span>Specialists</span>
              </a>
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/myquestions' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/myquestions'); }}
              >
                <FiUser />
                <span>My Questions</span>
              </a>
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/bookmarks' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/bookmarks'); }}
              >
                <FiBookmark />
                <span>Bookmarks</span>
              </a>
            </nav>

            <div className="template-sidebar-nav-secondary">
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/settings' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/settings'); }}
              >
                <FiSettings />
                <span>Settings</span>
              </a>
              <a 
                href="#" 
                className={`template-nav-item ${activeItem === '/help' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/help'); }}
              >
                <FiHelpCircle />
                <span>Help & FAQ</span>
              </a>
            </div>
          </div>

          <div className="template-sidebar-footer">
            <button className="template-sign-out-button" onClick={handleLogout}>
              <FiLogOut /> Sign out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="template-main-content">
          <div className="bookmarks-main-content">
            {bookmarks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="bookmark-list">
                {bookmarkList}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Zakladki;