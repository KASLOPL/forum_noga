import React, { useState } from 'react';
import './help.css';
import {
  FiSearch as SearchIcon,
  FiArrowLeft as BackArrow,
  FiBell as Bell,
  FiHome as Home,
  FiBookOpen as Book,
  FiMessageSquare as Message,
  FiPlus as Plus,
  FiMinus as Minus,
  FiZap as Lightning,
  FiChevronDown as ArrowDown,
  FiBookmark as Bookmark
} from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';

const Pomoc = () => {
  const navigate = useNavigate();

// KTORE PYTANIE JEST ROZWINIETE, tekst w polu wyszukiwania
  const [openQuestion, setOpenQuestion] = useState(2);
  const [searchText, setSearchText] = useState('');
  // dane urzytkownika bierze z localStorage 
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const helpTopics = [
    { title: 'Jak zacząć', desc: 'Podstawy korzystania ze SnapSolve i jak zadać pierwsze pytanie.' },
    { title: 'Zarządzanie kontem', desc: 'Zarządzaj swoim profilem, ustawieniami i preferencjami konta.' },
    { title: 'Zadawanie pytań', desc: 'Najlepsze praktyki, aby zadawać pytania i otrzymywać lepsze odpowiedzi.' },
    { title: 'Znajdowanie ekspertów', desc: 'Jak połączyć się ze specjalistami w Twojej dziedzinie.' },
    { title: 'Zakładki i zapisane', desc: 'Organizuj i zapisuj ważne pytania i odpowiedzi.' },
    { title: 'Bezpieczeństwo i prywatność', desc: 'Poznaj nasze zasady społeczności i ustawienia prywatności.' }
  ];

  const faqItems = [
    { q: 'Jak zresetować hasło?', a: 'Możesz zresetować hasło klikając „Zapomniałem hasła" na stronie logowania i postępując według instrukcji wysłanych na email.' },
    { q: 'Jak zmienić adres email?', a: 'Przejdź do Ustawienia > Konto > Email, aby zaktualizować adres email. Będziesz musiał potwierdzić nowy email.' },
    { q: 'Gdzie znajdę swoje pytania i odpowiedzi?', a: 'Swoje pytania znajdziesz w sekcji „Moje pytania" w menu bocznym, a odpowiedzi na stronie profilu.' },
    { q: 'Jak usunąć konto?', a: 'Przejdź do Ustawienia > Konto > Usuń konto. Pamiętaj, że tej akcji nie można cofnąć.' },
    { q: 'Jak zgłosić problem lub nieodpowiednie treści?', a: 'Użyj menu trzech kropek przy każdym poście, aby zgłosić treść lub skontaktuj się z zespołem wsparcia.' },
    { q: 'Czy moje dane są bezpieczne?', a: 'Tak, używamy standardowego szyfrowania i zabezpieczeń, aby chronić Twoje dane osobowe.' }
  ];

  const navLinks = [
    { icon: <Home size={16} />, text: 'Start', active: false, path: '/main' },
    { icon: <Bell size={16} />, text: 'Powiadomienia', active: false },
    { icon: <Book size={16} />, text: 'Specjaliści', active: false },
    { icon: <Message size={16} />, text: 'Moje pytania', active: false, path: '/my_questions' },
    { icon: <Bookmark size={16} />, text: 'Zakładki', active: false, path: '/zakładki'}
  ];
  
  // jesli klikasz otwarte pytanie zzamyka uzywa null jesli na odwrot index 
  const toggleFAQ = (idx) => {
    setOpenQuestion(openQuestion === idx ? null : idx);
  };
  // Funkcja do wyświetlania nazwy użytkownika
  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };

  // Funkcja do wyświetlania inicjałów użytkownika
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="calosc">
      <div className="app-container">

        {/* HEADER */}
        <header className="header">
          <div className="navbar">
            <div className="left-section">
              {/* cofanie do poprzednio otwartej strony */}
              <button className="back-button" onClick={() => navigate(-1)}>
                <BackArrow size={20} />
              </button>

              <div className="logo-container">
                <div className="logo-icon"><Lightning size={20} /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            {/* menu z linkami */}
            <nav className="nav">
              <ul>
                {/* lista linkow np main help itp odnoszenie */}
                {navLinks.map((link, i) => (
                  <li key={i} className={link.active ? 'active' : ''}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (link.path) navigate(link.path);
                      }}
                    >
                      {link.icon}{link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* powiadomienia + profil uzytkownika */}
            <div className="right-nav">
              <button className="icon-btn"><Bell size={20} /></button>

              <div
                className="user-profile" onClick={() => navigate('/profile')}
                role="button" style={{ cursor: 'pointer' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/profile');
                  }
                }}
                aria-label="Profil użytkownika"
              >
                <div className="avatar">
                <span>{getUserInitials()}</span>
                </div>
                <div className="user-info">
                <span className="user-name">{getUserDisplayName()}</span>
                  <div className="role">Student</div>
                </div>
                <ArrowDown size={16} style={{ color: '#9d9d9d', marginLeft: '4px' }} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main">

          {/* SEARCH */}
          <section className="search-section">
            <h1>W czym możemy <span className="highlight">pomóc</span>?</h1>
            <div className="search-container">
              <div className="search-icon"><SearchIcon size={20} /></div>
              <input
                type="text"
                placeholder="Wpisz, czego szukasz..."
                value={searchText}
                // zapamietanie wpisanego tekstu w search - przechowanie go do pozniejszego uzycia 
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="button" className="search-btn">Szukaj</button>
            </div>

            <div className="top-searches">
              <h3>Popularne wyszukiwania</h3>
              <div className="search-links">
                {/* 4 linki tekstowe nic nie robia , nie przeladowuja strony */}
                {['Odzyskiwanie konta', 'Zadawanie pytań', 'Znajdowanie ekspertów', 'Ustawienia prywatności'].map((txt, i) => (
                  <a key={i} href="#" onClick={(e) => e.preventDefault()}>{txt}</a>
                ))}
              </div>
            </div>
          </section>

          {/* QUESTIONS - POMOC */}
          <section className="topics-section">
            <h2>Przeglądaj tematy</h2>
            <div className="topics-grid">
              {/* dla kazdego temtu tworzy karte z opisem i tytulem + link */}
              {helpTopics.map((topic, i) => (
                <div className="topic-card" key={i}>
                  <div className="topic-icon"></div>
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                  <a href="#" className="see-detail" onClick={(e) => e.preventDefault()}>Zobacz więcej →</a>
                </div>
              ))}
            </div>
          </section>

          {/* PYTANIA ZADAWANE */}
          <section className="faq-section">
            <h2>Najczęściej zadawane pytania</h2>
            <p className="faq-description">
              Znajdź szybkie odpowiedzi na najczęstsze pytania dotyczące korzystania ze SnapSolve. Jeśli nie znajdziesz odpowiedzi, skontaktuj się z naszym zespołem wsparcia.
            </p>

            <div className="faq-container">
              {/* czestozadawane => jesli pytanie aktywne */}
              {faqItems.map((item, i) => (
                <div className={`faq-item ${openQuestion === i ? 'active' : ''}`} key={i}>
                  <button className="faq-question" onClick={() => toggleFAQ(i)}>
                    <span className="faq-icon">
                      {/* WTEDY ikona minus albo plus */}
                      {openQuestion === i ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span>{item.q}</span>
                  </button>
                  {/* jesli pytanie otwarte dodaje visible jesli nie bez  */}
                  <div className={`faq-answer ${openQuestion === i ? 'visible' : ''}`}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Pomoc;