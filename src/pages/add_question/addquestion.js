// Importujemy potrzebne rzeczy z Reacta i bibliotek
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addquestion.css'; // Stylowanie CSS komponentu
import { Upload, ChevronDown, ChevronLeft } from 'lucide-react'; // Ikony z biblioteki lucide-react
import {
  FiBookmark, FiHome, FiLogOut, FiMessageSquare, FiPlus,
  FiSettings, FiUser, FiUsers, FiHelpCircle, FiZap
} from 'react-icons/fi'; // Więcej ikon z react-icons
import { addQuestion } from '../../utils/firebaseUtils'; // Funkcja dodająca pytanie do bazy danych (Firebase)
import Sidebar from '../../components/side_bar/side_bar.js';
import Notifications from '../notifications/Notifications'; // Import komponentu Notifications
import Modal from '../notifications/Modal'; // Import komponentu Modal
import FileUpload from '../../components/file_upload/file_upload';

// Główna funkcja komponentu AddQuestion
const AddQuestion = () => {
  const navigate = useNavigate(); // Hook do przechodzenia między stronami

  // Śledzenie aktualnie aktywnego linku nawigacyjnego
  const [activeItem, setActiveItem] = useState('/addquestion');
  const [selectedFile, setSelectedFile] = useState(null);

  const [answerVisibility, setAnswerVisibility] = useState(null); // np. 'everyone', 'specialists', 'friends'

  // Formularz danych pytania
  const [formData, setFormData] = useState({
    title: '', // Tytuł pytania
    caption: '', // Opis pytania
    category: '', // Kategoria pytania
    type: 'Error in code', // Typ pytania
    urgent: false, // Czy pytanie jest pilne
    answerDate: '' // Data oczekiwanej odpowiedzi
  });

  const [tags, setTags] = useState([]); // Lista wybranych tagów
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false); // Czy rozwijane menu tagów jest otwarte
  const [user, setUser] = useState({ name: 'Guest', role: 'Visitor' }); // Informacje o użytkowniku
  const [isSubmitting, setIsSubmitting] = useState(false); // Czy formularz jest aktualnie wysyłany
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  

  // Hook, który uruchamia się po załadowaniu komponentu
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Sprawdzenie czy użytkownik jest zalogowany
    if (isLoggedIn !== 'true') return navigate('/'); // Jeśli nie – przekieruj na stronę główną

    const userData = localStorage.getItem('currentUser');
    let currentUser = {};

    if (userData && userData !== 'undefined' && userData !== 'null') {
      try {
        currentUser = JSON.parse(userData); // Spróbuj sparsować dane użytkownika z localStorage
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Ustawienie imienia i roli użytkownika
    const name = currentUser.name || currentUser.userName || 'Guest';
    const role = currentUser.role || 'Visitor';

    setUser({ name, role });
    setFormData(prev => ({ ...prev, author: name }));
  }, [navigate]);

  // Funkcja do zmiany strony w menu bocznym
  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  // Wylogowanie użytkownika
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Funkcja do aktualizacji danych formularza
  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // Usunięcie tagu z listy
  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));

  // Dodanie nowego tagu (jeśli jeszcze go nie ma)
  const addTag = (newTag) => {
    if (!tags.includes(newTag)) setTags([...tags, newTag]);
    setTagDropdownOpen(false); // Zamykanie dropdowna
  };

  // Obsługa kliknięcia przycisku Post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sprawdzenie czy wszystkie wymagane pola są wypełnione
    if (!formData.title.trim() || !formData.caption.trim()) {
  alert('Wypełnij wszystkie wymagane pola!');
  return;
}

if (tags.length === 0) {
  alert('Dodaj przynajmniej jeden tag!');
  return;
}

if (!answerVisibility) {
  alert('Wybierz kto może odpowiedzieć na pytanie!');
  return;
}

    setIsSubmitting(true); // Zablokowanie formularza

    try {
      const userData = localStorage.getItem('currentUser');
      let currentUser = {};

      if (userData && userData !== 'undefined' && userData !== 'null') {
        currentUser = JSON.parse(userData);
      }

      // Przygotowanie danych do wysłania
      const questionData = {
        author: currentUser?.userName || currentUser?.name || 'Anonymous',
        title: formData.title,
        content: formData.caption,
        fullContent: formData.caption,
        category: formData.category,
        type: formData.type,
        urgent: formData.urgent,
        answerDate: formData.answerDate || null,
        tags: tags.map(tag => tag.trim()),
        visibility: answerVisibility,
        UID: currentUser?.uid,
      };

      // Wysłanie pytania do Firebase
      const result = await addQuestion(questionData);

      if (result.success) {
        // Wyczyszczenie formularza
        setFormData({
          title: '', caption: '', category: '', type: 'Error in code', urgent: false, answerDate: ''
        });
        setTags([]);
        alert("Pytanie zostało dodane!");
        navigate('/main');
      } else {
        alert('Błąd podczas dodawania pytania: ' + result.error);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Błąd podczas dodawania pytania. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false); // Odblokowanie formularza
    }

    if (selectedFile) {
  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const uploadResponse = await fetch('http://localhost:3001/api/uploadQuestions', {
      method: 'POST',
      body: formData,
    });

    if (uploadResponse.ok) {
      console.log('Plik przesłany!');
    } else {
      console.error('Błąd przesyłania pliku.');
    }
  } catch (uploadError) {
    console.error('Błąd podczas przesyłania pliku:', uploadError);
  }
}

  };

  // Lista dostępnych tagów do wyboru
  const availableTags = [
    'Python', 'Java', 'SQL', 'html', 'css', 'javascript', 'react',
    'node.js', 'flask', 'arduino', 'linux', 'database', 'networking',
    'school_project', 'teamwork', 'presentation', 'figma', 'ux/ui', 'pitch_deck'
  ];

  // Lista głównych elementów menu
  const navItems = [
    { path: '/main', icon: FiHome, label: 'Home' },
    { path: '/notifications', icon: FiMessageSquare, label: 'Notifications' },
    { path: '/specialists', icon: FiUsers, label: 'Specialists' },
    { path: '/myquestions', icon: FiUser, label: 'My Questions' },
    { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' }
  ];

  // Lista drugorzędnych opcji w menu
  const secondaryNavItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help & FAQ' }
  ];

  // Komponent reprezentujący jeden przycisk nawigacji
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <a href="#" className={`template-nav-item ${activeItem === item.path ? 'active' : ''}`}
         onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}>
        <Icon />
        <span>{item.label}</span>
      </a>
    );
  };

  // JSX – kod HTML tej strony (formularz i nawigacja)
  return (
    <div className="caloscAdd">
      {/* Nagłówek z nazwą strony */}
      <header className="template-header">
        <div className="template-header-container">
          <div className="header-left">
            <div className="template-logo">
              <div className="template-logo-icon"><FiZap /></div>
              <span className="template-logo-text">
                Snap<span className="template-logo-text-highlight">solve</span>
              </span>
            </div>
            <button className="back-btn" onClick={() => navigate('/main')}>
              <ChevronLeft size={20} />
            </button>
            <span className="page-title">Add Question</span>
          </div>
          <div className="header-right">
            <button className="cancel-btn" onClick={() => navigate('/main')}>Cancel</button>
            <button className="post-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </header>

      {/* Główna zawartość aplikacji */}
      <div className="app-container">
          {/* Menu boczne */}
          <Sidebar onNotificationClick={() => setIsNotificationModalOpen(true)} />

        <div className="main-content">
          <div className="content-wrapper">
            {/* Formularz dodawania pytania */}
            <div className="form-container">
              <div className="form-header">
                <h1>Ask a Specialist</h1>
                <p className="form-description">
                  Need help with your code? Ask an expert and get a quick answer! You can{' '}
                  <span className="highlight">attach a code file</span>, select a question type, and{' '}
                  <span className="highlight">mark it as urgent</span>.
                </p>
              </div>

              <form className="question-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Question Title<span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your question title"
                    value={formData.title} 
                    onChange={(e) => updateForm('title', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caption<span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Write the question caption"
                    value={formData.caption} 
                    onChange={(e) => updateForm('caption', e.target.value)} 
                    rows={6}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="character-count">{formData.caption.length}/500 Characters</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Add Some Tags <span className="min-tags">(min. 1)</span><span className="required">*</span>
                  </label>
                  <div className="tags-container">
                    {tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                        <button type="button" className="tag-remove" onClick={() => removeTag(tag)} disabled={isSubmitting}>
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="simple-tag-dropdown-container">
                      <button 
                        type="button" 
                        className="simple-add-tag-btn"
                        onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                        disabled={isSubmitting}
                      >
                        Add Tags <ChevronDown size={16} />
                      </button>
                      {tagDropdownOpen && (
                        <div className="simple-tag-dropdown">
                          <div className="simple-tag-list">
                            {availableTags.filter(tag => !tags.includes(tag)).map(tag => (
                              <div key={tag} className="simple-tag-item" onClick={() => addTag(tag)}>
                                {tag}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Choose who can answer your question<span className="required">*</span></label>
                    <div className="answer-options">
                      <button
                        type="button"
                        className={`answer-button ${answerVisibility === 'everyone' ? 'selected' : ''}`}
                        onClick={() => setAnswerVisibility('everyone')}
                      >
                        Specialists Only
                      </button>
                      <button
                        type="button"
                        className={`answer-button ${answerVisibility === 'specialists' ? 'selected' : ''}`}
                        onClick={() => setAnswerVisibility('specialists')}
                      >
                        Everyone
                      </button>
                    </div>
                  </div>

                </div>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.urgent}
                    onChange={(e) => updateForm('urgent', e.target.checked)}
                    disabled={isSubmitting}
                  />
                  I need a quick answer
                </label>
              </form>
            </div>

            <div className="file-upload-section">
              <FileUpload 
                onFileSelect={(file) => setSelectedFile(file)}
                disabled={isSubmitting}
              />
            </div>

            {/* Przycisk wysyłania pytania */}
            <div className="submit-section">
              <button type="submit" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div> {/* content-wrapper */}
        </div> {/* main-content */}
      </div> {/* app-container */}
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
};

export default AddQuestion;
