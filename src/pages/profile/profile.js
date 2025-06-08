import React, { useState, useEffect } from 'react';
import './profile.css';
import {
  FiSearch, FiArrowLeft, FiMail, FiHome, FiUsers, FiMessageSquare,
  FiPlus, FiMinus, FiZap, FiChevronDown, FiBookmark, FiUser,
  FiHelpCircle, FiMoreVertical, FiHeart, FiEye, FiCheck
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getAllQuestions } from '../../utils/firebaseUtils';

const Profile = () => {
  const navigate = useNavigate();
  const [userQuestions, setUserQuestions] = useState([]); // lista pytan uzytkownika
  const [loading, setLoading] = useState(false); // stan ladowania danych
  const [currentUser, setCurrentUser] = useState(null); // aktualny uzytkownik
  const [selectedTags, setSelectedTags] = useState([]); // wybrane tagi przez uzytkownika
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // stan rozwinięcia dropdowna z tagami

  // Pobieranie danych aktualnego użytkownika z localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser'); // pobieranie danych uzytkownika z localStorage
    if (userData) { // sprawdzanie czy dane uzytkownika istnieja
      try {
        const parsedUser = JSON.parse(userData); // parsowanie danych uzytkownika
        setCurrentUser(parsedUser); // ustawianie aktualnego uzytkownika
        if (parsedUser.selectedTags) setSelectedTags(parsedUser.selectedTags); // ustawianie wybranych tagów
      } catch (error) { // obsluga bledow parsowania danych uzytkownika
        console.error('Error parsing user data:', error); // logowanie bledow parsowania danych uzytkownika
      }
    }
  }, []);

  // Pobieranie pytan użytkownika z bazy danych
  useEffect(() => {
    const loadUserQuestions = async () => { // sprawdzanie czy aktualny uzytkownik istnieje
      if (!currentUser?.userName) return; // jesli nie ma uzytkownika, nie pobieraj pytan
      setLoading(true);
      try {
        const result = await getAllQuestions(); //  pobieranie wszystkich pytan z bazy danych
        if (result.success) { // sprawdzanie czy pobieranie pytan zakonczone sukcesem
          const myQuestions = result.questions.filter(q => q.author === currentUser.userName); // filtrowanie pytan uzytkownika
          setUserQuestions(myQuestions); // ustawianie pytan uzytkownika
        }
      } catch (err) {
        console.error('Error loading questions:', err); // logowanie bledow pobierania pytan
      } finally {
        setLoading(false); // ustawianie stanu ladowania na false po pobraniu pytan
      }
    };
    loadUserQuestions(); // wywolanie funkcji pobierajacej pytania uzytkownika
  }, [currentUser]);

  const getUserDisplayName = () => currentUser?.userName || currentUser?.name || 'Guest'; // funkcja zwracajaca nazwe uzytkownika lub 'Guest' jesli nie ma uzytkownika
  const getUserInitials = () => {
    const displayName = getUserDisplayName(); // pobieranie nazwy uzytkownika
    return displayName === 'Guest' ? 'GU' : displayName.substring(0, 2).toUpperCase(); // funkcja zwracajaca inicjaly uzytkownika lub 'GU' jesli nie ma uzytkownika
  };

  
// lista wszystkich tagow, z ktorych mozna wybierac zainteresowania
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

  const handleTagSelect = (tag) => { // funkcja obslugujaca wybieranie tagow
    if (!selectedTags.includes(tag)) { // sprawdzanie czy tag nie jest juz wybrany
      const updatedTags = [...selectedTags, tag]; //  tworzenie nowej tablicy z wybranymi tagami
      setSelectedTags(updatedTags); // ustawianie wybranych tagów
      if (currentUser) { // sprawdzanie czy aktualny uzytkownik istnieje
        const updatedUser = { ...currentUser, selectedTags: updatedTags }; // tworzenie nowego obiektu uzytkownika z wybranymi tagami
        localStorage.setItem('currentUser', JSON.stringify(updatedUser)); //  zapisanie aktualnego uzytkownika do localStorage
        setCurrentUser(updatedUser);
      }
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagToRemove) => { // funkcja obslugujaca usuwanie tagow
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove); // tworzenie nowej tablicy z wybranymi tagami bez usuwanego tagu
    setSelectedTags(updatedTags); //  ustawianie wybranych tagów bez usuwanego tagu
    if (currentUser) {
      const updatedUser = { ...currentUser, selectedTags: updatedTags }; // tworzenie nowego obiektu uzytkownika z wybranymi tagami bez usuwanego tagu
      localStorage.setItem('currentUser', JSON.stringify(updatedUser)); //  zapisanie aktualnego uzytkownika do localStorage
      setCurrentUser(updatedUser);
    }
  };

  const navLinks = [
    { icon: <FiHome size={16} />, text: 'Home', path: '/main' },
    { icon: <FiMessageSquare size={16} />, text: 'Notifications' },
    { icon: <FiUsers size={16} />, text: 'Specialists' },
    { icon: <FiUser size={16} />, text: 'My Questions', path: '/my_questions' },
    { icon: <FiBookmark size={16} />, text: 'Bookmarks', path: '/zakładki'}
  ];

  const StatusBadge = ({ status }) => ( // komponent do wyswietlania statusu pytania
    <div className="status-badge" style={{ backgroundColor: status === 'complete' ? '#4CAF50' : '#FF9800' }}> 
      {status === 'complete' && <FiCheck />} 
      <span>{status === 'complete' ? 'Complete' : 'In Progress'}</span>
    </div>
  );

  if (loading) return <div>Loading...</div>; // komponent ladowania danych
  if (!currentUser) return <div>Loading user data...</div>; // komponent ladowania danych uzytkownika   

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
                {navLinks.map((item, i) => ( // mapowanie linków nawigacyjnych
                  <li key={i}> {/* renderowanie linkow nawigacyjnych*/}
                    <a href="#" onClick={(e) => { // obsluga klikniecia w linki nawigacyjne   
                      e.preventDefault();   // zapobieganie domyslnemu zachowaniu linku
                      if (item.path) navigate(item.path); // nawigacja do sciezki jesli jest zdefiniowana
                    }}>
                      {item.icon}{item.text}   {/* renderowanie ikony i tekstu linku nawigacyjnego */}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="right-nav">
              <button className="icon-btn"><FiMail size={20} /></button> {/* przycisk do wiadomosci */}
              <div className="user-profile" onClick={() => navigate('/profile')}> {/* przycisk do profilu uzytkownika */}
                <div className="avatar"><span>{getUserInitials()}</span></div> {/* avatar uzytkownika */}
                <div className="user-info">
                  <div className="name">{getUserDisplayName()}</div> {/* nazwa uzytkownika */}
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
                <h2 className="profile-name">{user.name}</h2>    {/* nazwa uzytkownika */}
                <p className="profile-username">{user.username}</p>
                <p className="profile-school">{user.school}</p>
              </div>
              <div className="profile-bio">
                <p>{user.bio}</p> {/* bio uzytkownika */}
              </div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-num">{userQuestions.length}</div> {/* liczba pytan uzytkownika */}
                  <div className="stat-label">Questions</div> {/* etykieta dla liczby pytan */}
                </div>
                <div className="stat">
                  <div className="stat-num">{userQuestions.filter(q => q.status === 'complete').length}</div> {/* liczba pytan zakonczinycj*/}
                  <div className="stat-label">Answers</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{userQuestions.reduce((sum, q) => sum + (q.likes || 0), 0)}</div> {/* suma wszystkich polubien pytan uzytkownika */}
                  <div className="stat-label">Likes</div>
                </div>
              </div>
            </div>

            <div className="interests">
              <h3>Interests</h3>
              <div className="tags-container">
                <div className="selected-tags">
                  {selectedTags.map((tag, index) => ( // renderowanie wybranych tagów
                    <span key={index} className="tag"> 
                      {tag}
                      <button className="tag-remove" onClick={() => handleRemoveTag(tag)}>×</button> {/* przycisk do usuwania tagu */}
                    </span>
                  ))}
                </div>
                <div className="dropdown-container">
                  <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>  {/* przycisk do rozwijania dropdowna */}
                    Select your interests
                    <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />  {/* ikona strzałki */}
                  </button>
                  {isDropdownOpen && ( // sprawdzanie czy dropdown jest otwarty
                    <div className="dropdown-menu">
                      {tags.filter(tag => !selectedTags.includes(tag)).map((tag, index) => ( // filtrowanie tagów, aby nie pokazywać już wybranych
                        <div key={index} className="dropdown-item" onClick={() => handleTagSelect(tag)}> {/* renderowanie tagów w dropdownie */}
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
                <button className="tab active">Questions ({userQuestions.length})</button> {/* Pole hasła */}
              </div>
              <div className="actions">
                <button className="btn-edit">Edit profile</button>
                <button className="btn-settings">Settings</button>
              </div>
            </div>

            <div className="questions">
              {userQuestions.length === 0 ? ( // sprawdzanie czy uzytkownik ma pytania
                <div className="no-questions">
                  <p>Nie masz jeszcze żadnych pytań.</p>
                </div>
              ) : (
                userQuestions.map((question) => ( // renderowanie pytan uzytkownika
                  <div className={`question ${question.status === 'complete' ? 'complete' : ''}`} key={question.id}> {/* sprawdzanie statusu pytania i dodawanie klasy 'complete' */}
                    
                    {/* gora pytania - avatar, kto napisal, kiedy i status */}
                    <div className="question-header">
                      <div className="user-avatar">{getUserInitials()}</div>
                      <div className="meta">
                        <div className="author-name">{getUserDisplayName()}</div> {/* nazwa uzytkownika */}
                        <div className="author-time">{question.timeAgo}</div> {/* ile czasu temu */}
                      </div>
                      <div className="question-actions">
                        <StatusBadge status={question.status || 'in_progress'} /> {/* status pytania */}
                        <button className="menu-btn"><FiMoreVertical size={16} /></button> {/* 3 kropki (opcje) */}
                      </div>
                    </div>
                
                    {/* srodek pytania tytul, tagi i tresc */}
                    <div className="question-content">
                      <div className="question-highlight">
                        <h3>{question.title}</h3> {/* tytul pytania */}
                      </div>
                      <div className="content-tags">
                        {/* wypisuje wszystkie tagi do pytania */}
                        {question.tags && question.tags.map((tag, i) => ( //sprawdzanie czy pytanie ma tagi i mapowanie ich
                          <span key={i} className="content-tag">{tag}</span>
                        ))}
                      </div>
                      <div className="question-text">
                        <p>{question.content}</p> {/* glowna tresc pytania */}
                      </div>
                    </div>
                
                    {/* dol pytania reakcje i statystyki */}
                    <div className="question-footer">
                      <div className="reactions">
                        {/* reakcje na pytanie, pokazuje ile jest odpowiedzi */}
                        {Array.from({ length: question.responseCount || question.responders || 0 }, (_, i) => ( // tworzenie tablicy z odpowiedziami
                          <div key={i} className="reaction">{String.fromCharCode(65 + i)}</div>
                        ))}
                        {/* pokazuje ile odpowiedzi jest */}
                        <span className="responders-text">{question.responseCount || question.responders || 0} responses</span>
                      </div>
                      <div className="engagement">
                        {/* ilosc lajkow */}
                        <span className="engagement-item">
                          <FiHeart size={14} /> {question.likes || 0}
                        </span>
                        {/* ilosc wyswietlen */}
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
      </div>
    </div>
  );
};

export default Profile;
