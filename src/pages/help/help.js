import React, { useState } from 'react';
import './help.css';
import {
  FiSearch as SzukajIkona,
  FiArrowLeft as StrzalkaLewo,
  FiBell as Dzwonek,
  FiHome as Dom,
  FiBookOpen as Ksiazka,
  FiMessageSquare as Wiadomosc,
  FiPlus as Plus,
  FiMinus as Minus,
  FiZap as Piorun,
  FiChevronDown as StrzalkaDol,
  FiBookmark as Zakladka
} from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';

const Pomoc = () => {
  const nawiguj = useNavigate();

  const [aktywnePytanie, ustawAktywnePytanie] = useState(2);
  const [tekstWyszukiwania, ustawTekstWyszukiwania] = useState('');

  const uzytkownik = { imie: 'Gość' };

  const tematyPomocnicze = [
    { tytul: 'Jak zacząć', opis: 'Podstawy korzystania ze SnapSolve i jak zadać pierwsze pytanie.' },
    { tytul: 'Zarządzanie kontem', opis: 'Zarządzaj swoim profilem, ustawieniami i preferencjami konta.' },
    { tytul: 'Zadawanie pytań', opis: 'Najlepsze praktyki, aby zadawać pytania i otrzymywać lepsze odpowiedzi.' },
    { tytul: 'Znajdowanie ekspertów', opis: 'Jak połączyć się ze specjalistami w Twojej dziedzinie.' },
    { tytul: 'Zakładki i zapisane', opis: 'Organizuj i zapisuj ważne pytania i odpowiedzi.' },
    { tytul: 'Bezpieczeństwo i prywatność', opis: 'Poznaj nasze zasady społeczności i ustawienia prywatności.' }
  ];

  const czestoZadawane = [
    { pytanie: 'Jak zresetować hasło?', odpowiedz: 'Możesz zresetować hasło klikając „Zapomniałem hasła” na stronie logowania i postępując według instrukcji wysłanych na email.' },
    { pytanie: 'Jak zmienić adres email?', odpowiedz: 'Przejdź do Ustawienia > Konto > Email, aby zaktualizować adres email. Będziesz musiał potwierdzić nowy email.' },
    { pytanie: 'Gdzie znajdę swoje pytania i odpowiedzi?', odpowiedz: 'Swoje pytania znajdziesz w sekcji „Moje pytania” w menu bocznym, a odpowiedzi na stronie profilu.' },
    { pytanie: 'Jak usunąć konto?', odpowiedz: 'Przejdź do Ustawienia > Konto > Usuń konto. Pamiętaj, że tej akcji nie można cofnąć.' },
    { pytanie: 'Jak zgłosić problem lub nieodpowiednie treści?', odpowiedz: 'Użyj menu trzech kropek przy każdym poście, aby zgłosić treść lub skontaktuj się z zespołem wsparcia.' },
    { pytanie: 'Czy moje dane są bezpieczne?', odpowiedz: 'Tak, używamy standardowego szyfrowania i zabezpieczeń, aby chronić Twoje dane osobowe.' }
  ];

  const linkiNawigacyjne = [
    { ikona: <Dom size={16} />, tekst: 'Start', aktywny: false, sciezka: '/main' },
    { ikona: <Dzwonek size={16} />, tekst: 'Powiadomienia', aktywny: false },
    { ikona: <Ksiazka size={16} />, tekst: 'Specjaliści', aktywny: false },
    { ikona: <Wiadomosc size={16} />, tekst: 'Moje pytania', aktywny: false },
    { ikona: <Zakladka size={16} />, tekst: 'Zakładki', aktywny: false}
  ];

  const wyszukaj = (e) => {
    e.preventDefault();
    if (tekstWyszukiwania.trim()) console.log('Szukam:', tekstWyszukiwania);
  };

  const przelaczFAQ = (index) => {
    ustawAktywnePytanie(aktywnePytanie === index ? null : index);
  };

  return (
    <div className="calosc">
      <div className="app-container">

        {/* NAGŁÓWEK */}
        <header className="header">
          <div className="navbar">
            <div className="left-section">
              <button className="back-button" onClick={() => nawiguj(-1)}>
                <StrzalkaLewo size={20} />
              </button>

              <div className="logo-container">
                <div className="logo-icon"><Piorun size={20} /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            <nav className="nav">
              <ul>
                {linkiNawigacyjne.map((el, idx) => (
                  <li key={idx} className={el.aktywny ? 'active' : ''}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (el.sciezka) nawiguj(el.sciezka);
                      }}
                    >
                      {el.ikona}{el.tekst}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="right-nav">
              <button className="icon-btn"><Dzwonek size={20} /></button>

              <div
                className="user-profile"
                onClick={() => nawiguj('/profile')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    nawiguj('/profile');
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
                <StrzalkaDol size={16} style={{ color: '#9d9d9d', marginLeft: '4px' }} />
              </div>
            </div>
          </div>
        </header>

        {/* GŁÓWNA TREŚĆ */}
        <main className="main">

          {/* WYSZUKIWARKA */}
          <section className="search-section">
            <h1>W czym możemy <span className="highlight">pomóc</span>?</h1>
            <form className="search-container" onSubmit={wyszukaj}>
              <div className="search-icon"><SzukajIkona size={20} /></div>
              <input
                type="text"
                placeholder="Wpisz, czego szukasz..."
                value={tekstWyszukiwania}
                onChange={(e) => ustawTekstWyszukiwania(e.target.value)}
              />
              <button type="submit" className="search-btn">Szukaj</button>
            </form>

            <div className="top-searches">
              <h3>Popularne wyszukiwania</h3>
              <div className="search-links">
                {['Odzyskiwanie konta', 'Zadawanie pytań', 'Znajdowanie ekspertów', 'Ustawienia prywatności'].map((txt, i) => (
                  <a key={i} href="#" onClick={(e) => e.preventDefault()}>{txt}</a>
                ))}
              </div>
            </div>
          </section>

          {/* TEMATY POMOCY */}
          <section className="topics-section">
            <h2>Przeglądaj tematy</h2>
            <div className="topics-grid">
              {tematyPomocnicze.map((temat, idx) => (
                <div className="topic-card" key={idx}>
                  <div className="topic-icon"></div>
                  <h3>{temat.tytul}</h3>
                  <p>{temat.opis}</p>
                  <a href="#" className="see-detail" onClick={(e) => e.preventDefault()}>Zobacz więcej →</a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="faq-section">
            <h2>Najczęściej zadawane pytania</h2>
            <p className="faq-description">
              Znajdź szybkie odpowiedzi na najczęstsze pytania dotyczące korzystania ze SnapSolve. Jeśli nie znajdziesz odpowiedzi, skontaktuj się z naszym zespołem wsparcia.
            </p>

            <div className="faq-container">
              {czestoZadawane.map((item, idx) => (
                <div className={`faq-item ${aktywnePytanie === idx ? 'active' : ''}`} key={idx}>
                  <button className="faq-question" onClick={() => przelaczFAQ(idx)}>
                    <span className="faq-icon">
                      {aktywnePytanie === idx ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span>{item.pytanie}</span>
                  </button>
                  <div className={`faq-answer ${aktywnePytanie === idx ? 'visible' : ''}`}>
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

export default Pomoc;
