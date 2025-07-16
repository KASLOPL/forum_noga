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
import Header from '../../components/header/Header';
import { HeaderProvider } from '../../hooks/header_context';

const Pomoc = () => {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(2);
  const [searchText, setSearchText] = useState('');
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
  ];

  const toggleFAQ = (idx) => {
    setOpenQuestion(openQuestion === idx ? null : idx);
  };
  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <HeaderProvider>
      <Header />
      <div className="calosc">
        <div className="app-container">

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
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button type="button" className="search-btn">Szukaj</button>
              </div>

              <div className="top-searches">
                <h3>Popularne wyszukiwania</h3>
                <div className="search-links">
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
                {faqItems.map((item, i) => (
                  <div className={`faq-item ${openQuestion === i ? 'active' : ''}`} key={i}>
                    <button className="faq-question" onClick={() => toggleFAQ(i)}>
                      <span className="faq-icon">
                        {openQuestion === i ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                      <span>{item.q}</span>
                    </button>
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
    </HeaderProvider>
  );
};

export default Pomoc;