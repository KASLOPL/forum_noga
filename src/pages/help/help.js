import React, { useState } from 'react';
import './help.css';
import {
  Search,
  ArrowLeft,
  Bell,
  Home,
  BookOpen,
  MessageSquare,
  Plus,
  Minus,
  Zap,
  ChevronDown
} from 'lucide-react';
// biblioteka icon 

import { useNavigate } from 'react-router-dom'; 

const Help = () => {

  const navigate = useNavigate();
  // zmienne, rozwinietePytanie rozwijanie pytan domyslnie zawsze 2 rozwiniete
  const [rozwinietePytanie, ustawRozwiniete] = useState(2);
  // pole wyszukiwania
  const [szukajTekst, ustawSzukajTekst] = useState('');

  // zawartosc
  const uzytkownik = { imie: 'Gość' };

  const tematyPomocy = [
    { tytul: 'Jak zacząć', opis: 'Podstawy korzystania ze SnapSolve i jak zadać pierwsze pytanie.' },
    { tytul: 'Zarządzanie kontem', opis: 'Zarządzaj swoim profilem, ustawieniami i preferencjami konta.' },
    { tytul: 'Zadawanie pytań', opis: 'Najlepsze praktyki, aby zadawać pytania i otrzymywać lepsze odpowiedzi.' },
    { tytul: 'Znajdowanie ekspertów', opis: 'Jak połączyć się ze specjalistami w Twojej dziedzinie.' },
    { tytul: 'Zakładki i zapisane', opis: 'Organizuj i zapisuj ważne pytania i odpowiedzi.' },
    { tytul: 'Bezpieczeństwo i prywatność', opis: 'Poznaj nasze zasady społeczności i ustawienia prywatności.' }
  ];

  const listaFAQ = [
    { pytanie: 'Jak zresetować hasło?', odpowiedz: 'Możesz zresetować hasło klikając „Zapomniałem hasła” na stronie logowania i postępując według instrukcji wysłanych na email.' },
    { pytanie: 'Jak zmienić adres email?', odpowiedz: 'Przejdź do Ustawienia > Konto > Email, aby zaktualizować adres email. Będziesz musiał potwierdzić nowy email.' },
    { pytanie: 'Gdzie znajdę swoje pytania i odpowiedzi?', odpowiedz: 'Swoje pytania znajdziesz w sekcji „Moje pytania” w menu bocznym, a odpowiedzi na stronie profilu.' },
    { pytanie: 'Jak usunąć konto?', odpowiedz: 'Przejdź do Ustawienia > Konto > Usuń konto. Pamiętaj, że tej akcji nie można cofnąć.' },
    { pytanie: 'Jak zgłosić problem lub nieodpowiednie treści?', odpowiedz: 'Użyj menu trzech kropek przy każdym poście, aby zgłosić treść lub skontaktuj się z zespołem wsparcia.' },
    { pytanie: 'Czy moje dane są bezpieczne?', odpowiedz: 'Tak, używamy standardowego szyfrowania i zabezpieczeń, aby chronić Twoje dane osobowe.' }
  ];

  const linkiNawigacji = [
    { ikona: <Home size={16} />, tekst: 'Start', aktywny: false, sciezka: '/main' }, 
    { ikona: <Bell size={16} />, tekst: 'Powiadomienia', aktywny: false },
    { ikona: <BookOpen size={16} />, tekst: 'Specjaliści', aktywny: false },
    { ikona: <MessageSquare size={16} />, tekst: 'Moje pytania', aktywny: false }
  ];

  // zapobiega odswierzaniu strony, sprawdzanie co wpisal urzytkownik + dodac prawdziwe wyszukiwanie ...
  const szukaj = (e) => {
    e.preventDefault();
    if (szukajTekst.trim()) console.log('Szukam:', szukajTekst);
  };
  // jedno pytanie naraz tylko moze sie rozwijac, zwiniecie rozwinietego pytania : null
  const zmienFAQ = (index) => {
    ustawRozwiniete(rozwinietePytanie === index ? null : index);
  };


  // strzałka w lewo do poprzedniej strony
  const wroc = () => {
    window.history.back();
  };

  // app
  return (
    <div className="calosc">
      <div className="app-container">

        {/* HEADER */}
        <header className="header">
          <div className="navbar">
            <div className="left-section">
              <button
                className="back-button"
                onClick={() => navigate(-1)} // >>> DODANE cofnięcie do poprzedniej strony
              >
                <ArrowLeft size={20} />
              </button>

              <div className="logo-container">
                <div className="logo-icon"><Zap size={20} /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            <nav className="nav">
              <ul>
                {linkiNawigacji.map((el, idx) => (
                  <li key={idx} className={el.aktywny ? 'active' : ''}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (el.sciezka) navigate(el.sciezka); // >>> DODANE nawigacja do main.js na "Start"
                      }}
                    >
                      {el.ikona}{el.tekst}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="right-nav">
              <button className="icon-btn"><Bell size={20} /></button>

              <div
                className="user-profile"
                onClick={() => navigate('/profile')} // >>> DODANE nawigacja do profile.js
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/profile');
                  }
                }}
                aria-label="Profil użytkownika"
              >
                <div className="avatar">
                  <span>{uzytkownik.imie.substring(0, 2)}</span>
                </div>
                <div className="user-info">
                  <div className="name">{uzytkownik.imie}</div>
                  <div className="role">Student</div>
                </div>
                {/* ikona i jej styl dodany */}
                <ChevronDown size={16} style={{ color: '#9d9d9d', marginLeft: '4px' }} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main">

          {/* SEARCH */}
          <section className="search-section">
            <h1>How can <span className="highlight">we</span> help?</h1>
            <form className="search-container" onSubmit={szukaj}>
              <div className="search-icon"><Search size={20} /></div>
              <input
                type="text"
                placeholder="Search for answer..."
                value={szukajTekst}
                onChange={(e) => ustawSzukajTekst(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            <div className="top-searches">
              <h3>Top searches</h3>
              <div className="search-links">
                {['Odzyskiwanie konta', 'Zadawanie pytań', 'Znajdowanie ekspertów', 'Ustawienia prywatności'].map((txt, i) => (
                  <a key={i} href="#" onClick={(e) => e.preventDefault()}>{txt}</a>
                ))}
              </div>
            </div>
          </section>

          {/* HELP  */}
          <section className="topics-section">
            <h2>Explore all topics</h2>
            <div className="topics-grid">
              {tematyPomocy.map((temat, idx) => (
                <div className="topic-card" key={idx}>
                  <div className="topic-icon"></div>
                  <h3>{temat.tytul}</h3>
                  <p>{temat.opis}</p>
                  <a href="#" className="see-detail" onClick={(e) => e.preventDefault()}>See detail →</a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ - pytania */}
          <section className="faq-section">
            <h2>Frequently asked questions</h2>
            <p className="faq-description">
              Find quick answers to the most common questions about using SnapSolve. If you can't find what you're looking for, feel free to contact our support team.
            </p>

            <div className="faq-container">
              {listaFAQ.map((item, idx) => (
                // umozliwianie animacji ( rozwiniecie moze do zmiany)
                <div className={`faq-item ${rozwinietePytanie === idx ? 'active' : ''}`} key={idx}>
                  <button className="faq-question" onClick={() => zmienFAQ(idx)}>
                    <span className="faq-icon">
                      {rozwinietePytanie === idx ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span>{item.pytanie}</span>
                  </button>
                  
                  {/* pokazywanie odpowiedzi tylko po kliknieciu + dodanie po kliknieciu visible ( css )  */}
                  <div className={`faq-answer ${rozwinietePytanie === idx ? 'visible' : ''}`}>
                    <p>{item.odpowiedz}</p>
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

export default Help;
