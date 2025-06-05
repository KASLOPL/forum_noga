import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import { FiBookmark, FiHome, FiLogOut, FiMessageSquare, FiPlus, FiSettings, FiUser, FiUsers, FiHelpCircle, FiZap } from 'react-icons/fi';
import './zakładki.css';

function useBookmarks() {
  // funckja zeby wyjac istniejace funkcje z localStorage albo jak niema zadnych wyswietlic ze niema zadnych
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      // wyciaganie wlasnie z localStorage z bookmarks
      const saved = localStorage.getItem("bookmarks");
      // jesli niema pusta strona 
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // zapisuje wszystkie dodane zakladki w localstorage 
  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      // zamiana calej zakladki na tekst zeby mozna je dodac do do localstorage
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Save error:', error);
    }
  }, []);

  useEffect(() => saveBookmarks(bookmarks), [bookmarks, saveBookmarks]);

  // dodawanie i usuwanie zakladki
  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      // jesli istnieje - usuwamy ja 
      const exists = prev.some(b => b.id === item.id);
      // jak niema dodajemy ( wszytskie stare i ta nowa )
      return exists ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, isBookmarked: true }];
    });
  }, []);

  // usuwa po id zakladke 
  const removeBookmark = useCallback((id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  // aktualizuje likes w bookmarkach
  const updateBookmarkLikes = useCallback((id, newLikes) => {
    setBookmarks(prev => prev.map(b => 
      b.id === id ? { ...b, likes: newLikes } // zmiania like i wsyztsko tak samo inne z zakladki 
      : b
    ));
  }, []);

  return { bookmarks, toggleBookmark, removeBookmark, updateBookmarkLikes };
}

// sprawdza czy nic z tych rzeczy sie nie zmienilo zeby nie renderowac od nowa ( wydajnosc )
const BookmarkItem = React.memo(({ bookmark, onRemove, onCardClick, onLike, isLiked }) => {
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    // funckja do usuniecia zakladki z tym id
    onRemove(bookmark.id);
  }, [bookmark.id, onRemove]);

  const handleClick = useCallback(() => {
    onCardClick(bookmark);
  }, [bookmark, onCardClick]);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    onLike(bookmark.id, e);
  }, [bookmark.id, onLike]);

  // sprawdza pokoleji co zostalo dodane w formularzu i jak jest to dodaje to do wygladu zakladki - WYBOROWO
  const getTitle = () => bookmark.title || bookmark.highlight || bookmark.question || 'Untitled';
  const getDesc = () => bookmark.description || bookmark.content || bookmark.fullContent || 'No description';

  return (
    <div className="item" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="content">
        <div className="avatar">
          {(bookmark.author || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="text">
          <div className="title">{getTitle()}</div>
          <div className="desc">{getDesc()}</div>
          <div className="meta">
            by {bookmark.author || 'Anonymous'} • {bookmark.timeAgo || 'Recently'}
          </div>
        </div>
      </div>
      <div className="actions" onClick={(e) => e.stopPropagation()}>
        <div className="likes" onClick={handleLike} style={{ cursor: 'pointer' }}>
          <Heart 
            size={16} 
            className="heart" 
            style={{ 
              fill: isLiked ? '#ff4757' : 'none',
              color: isLiked ? '#ff4757' : '#666'
            }}
          />
          <span className="count">{bookmark.likes || 0}</span>
        </div>
        <button className="btn" onClick={handleRemove} title="Remove bookmark">
          <Bookmark size={20} className="icon" />
        </button>
      </div>
    </div>
  );
});

// Ggdy nie ZADNYCH zakladek to ekran domyslny
const EmptyState = React.memo(() => (
  <div className="empty">
    <div className="empty-icon">
      <Bookmark size={48} />
    </div>
    <p>No bookmarks yet</p>
    <p>Save interesting questions and answers to find them easily later</p>
  </div>
));

function Zakladki() {
  // uzywanie hooka bookmarks oraz obsluga nawigacji na stronie 
  const nav = useNavigate();
  const [active, setActive] = useState('/bookmarks');
  const { bookmarks, removeBookmark, updateBookmarkLikes } = useBookmarks();
  
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("likedQuestions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // jak zmienia sie liked zapisuje sie w localstorage 
    localStorage.setItem("likedQuestions", JSON.stringify(liked));
  }, [liked]);

  // zmiana aktywnego elementu na stronie w naiwgacji 
  const handleNav = useCallback((path) => {
    setActive(path);
    nav(path);
  }, [nav]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('');
    } catch (error) {
      console.error('Logout error:', error);
    }
    nav('/');
  }, [nav]);

  const handleClick = useCallback((bookmark) => {
    nav(`/answer_q/${bookmark.id}`, { state: { question: bookmark } });
  }, [nav]);

  // sprawdza czy jest sie zalogowanym jak nie przenosi na strone logowania 
  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') nav('/');
    } catch {
      nav('/');
    }
  }, [nav]);
  
  // e - event klikniecia i id pytania ktore polubiamy 
  const handleLike = useCallback((questionId, e) => {
    e.stopPropagation();
    
    // czy pytanie jest polubione i w zaleznosci zmienic o jedno w gore albo w dol
    const isLiked = liked.includes(questionId);
    const inc = isLiked ? -1 : 1;
    
    setLiked(prev => 
      isLiked ? prev.filter(id => id !== questionId) // usuwa polubienie
      : [...prev, questionId] // dodaje do polubionych 
    );
    
    // Aktualizuj likes w bookmarkach
    const bookmark = bookmarks.find(b => b.id === questionId);
    if (bookmark) {
      // jesli istnieje 
      const newLikes = (bookmark.likes || 0) + inc;
      updateBookmarkLikes(questionId, newLikes);
      
      // Aktualizuj również w głównej liście pytań w localStorage
      try {
        const questions = localStorage.getItem("questions");
        if (questions) {
          const parsedQuestions = JSON.parse(questions);
          // aktuazlizuje z tym samym id 
          const updatedQuestions = parsedQuestions.map(q => 
            q.id === questionId ? { ...q, likes: q.likes + inc } : q
          );
          localStorage.setItem("questions", JSON.stringify(updatedQuestions));
        }
      } catch (error) {
        console.error('Error updating questions:', error);
      }
    }
    // gdy zmienis ie jakas z tych wartosci aktualizacja 
  }, [liked, bookmarks, updateBookmarkLikes]);

  const navItems = [
    { path: '/main', icon: FiHome, label: 'Home' },
    { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
    { path: '/specialists', icon: FiUsers, label: 'Specialists' },
    { path: '/my_questions', icon: FiUser, label: 'My Questions' },
    { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' }
  ];

  const secItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help & FAQ' }
  ];

  // podswietalnie podstrony na ktorej jestes aktualnie oraz onclick
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <a
        href="#"
        className={`nav-item ${active === item.path ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); handleNav(item.path); }}
      >
        <Icon />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <div className='bookall'>
      <div className="app">
        <header className="header">
          <div className="header-container">
            <div className="logo">
              <div className="logo-icon"><FiZap /></div>
              <span className="logo-text">
                Snap<span className="logo-highlight">solve</span>
              </span>
            </div>
            <div className="header-title">
              <h1>TWOJE ZAKŁADKI</h1>
            </div>
          </div>
        </header>

        <div className="main-container">
          <aside className="sidebar">
            <div className="sidebar-content">
              <div className="add-btn-container">
                <button 
                  className="add-btn" 
                  onClick={() => handleNav('/addquestion')}
                >
                  <span>ADD QUESTION</span>
                  <div className="plus-icon"><FiPlus /></div>
                </button>
              </div>

              <nav className="nav">
                {navItems.map(item => <NavItem key={item.path} item={item} />)}
              </nav>

              <div className="nav-sec">
                {secItems.map(item => <NavItem key={item.path} item={item} />)}
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut /> Sign out
              </button>
            </div>
          </aside>

          <main className="main">
            <div className="main-content">
              {/* jesli niema zakladek pokazuje ekran ze nic neima  */}
              {bookmarks.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="list">
                  {bookmarks.map(bookmark => (
                    <BookmarkItem
                    // jesli sa pokazuje liste i wszystkie wyswietla ( co sie zmienilo )
                      key={bookmark.id}
                      // wsyztskie dane zakladki (prop)
                      bookmark={bookmark}
                      onRemove={removeBookmark}
                      onCardClick={handleClick}
                      onLike={handleLike}
                      // czy jest polubiona 
                      isLiked={liked.includes(bookmark.id)}
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