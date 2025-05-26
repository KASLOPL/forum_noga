import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // import do nawigacji
import './help.css';
import {
  Search,
  ArrowLeft,
  Sun,
  Moon,
  Bell,
  Home,
  BookOpen,
  MessageSquare,
  Plus,
  Minus
} from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();  // hook do nawigacji
  const [darkMode, setDarkMode] = useState(false);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(2);
  const [query, setQuery] = useState('');

  const helpTopics = [
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' },
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' },
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' },
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' },
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' },
    { title: 'Top searches', description: 'Opis przykładowy tematu pomocy' }
  ];

  const faqList = [
    { question: 'Jak zresetować hasło?', answer: '' },
    { question: 'Jak zmienić adres e-mail?', answer: '' },
    {
      question: 'Gdzie znajdę moje odpowiedzi?',
      answer: 'Możesz znaleźć swoje odpowiedzi w sekcji "My Answers", dostępnej z menu nawigacyjnego.'
    },
    { question: 'Jak usunąć konto?', answer: '' },
    { question: 'Jak zgłosić problem?', answer: '' },
    { question: 'Czy moje dane są bezpieczne?', answer: '' }
  ];

  const navLinks = [
    { icon: <Home size={16} />, text: 'Home', active: true, to: '/main' },
    { icon: <Bell size={16} />, text: 'Notifications', to: '#' },
    { icon: <BookOpen size={16} />, text: 'Specialties', to: '#' },
    { icon: <MessageSquare size={16} />, text: 'My Answers', to: '#' }
  ];

  return (
    <div className="calosc">
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <header className="header">
          <div className="navbar">
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>

            <div className="logo-container">
  <div className="logo">
    <div className="logo-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <span className="logo-text">
      Snap<span className="logo-text-highlight">solve</span>
    </span>
  </div>
</div>


            <nav className="nav">
              <ul>
                {navLinks.map((item, index) => (
                  <li key={index} className={item.active ? 'active' : ''}>
                    <a href={item.to}>
                      {item.icon}
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="right-nav">
              <div className="theme-toggle">
                <button className={`theme-btn ${!darkMode ? 'active' : ''}`} onClick={() => setDarkMode(false)}>
                  <Sun size={16} />
                </button>
                <button className={`theme-btn ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(true)}>
                  <Moon size={16} />
                </button>
              </div>

              <button className="icon-btn">
                <Bell size={20} />
              </button>

              <button className="user-profile" onClick={() => navigate('/profile')}>
                <div className="avatar">RK</div>
                <div className="user-info">
                  <div className="name">Basjan Kojko</div>
                  <div className="role">Student</div>
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="main">
          <section className="search-section">
            <h1>
              How can <span className="highlight">we</span> help?
            </h1>

            <form className="search-container" onSubmit={(e) => e.preventDefault()}>
              <div className="search-icon">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for answer..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            <div className="top-searches">
              <h3>Top searches</h3>
              <div className="search-links">
                <a href="#">Account recovery</a>
                <a href="#">Pricing information</a>
                <a href="#">Terms of service</a>
              </div>
            </div>
          </section>

          <section className="topics-section">
            <h2>Explore all topics</h2>
            <div className="topics-grid">
              {helpTopics.map((topic, index) => (
                <div className="topic-card" key={index}>
                  <div className="topic-icon"></div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <a href="#" className="see-detail underlined">
                    See detail <span className="arrow">→</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="faq-section">
            <h2>Frequently asked questions</h2>
            <p className="faq-description">
              Nasza aplikacja zawiera wiele pytań i odpowiedzi, które mają na celu wyjaśnienie konkretnych zagadnień.
            </p>

            <div className="faq-container">
              {faqList.map((item, index) => (
                <div className={`faq-item ${expandedQuestionIndex === index ? 'active' : ''}`} key={index}>
                  <button
                    className="faq-question"
                    onClick={() =>
                      setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index)
                    }
                  >
                    <span className="icon">
                      {expandedQuestionIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                    <span>{item.question}</span>
                  </button>

                  <div className={`faq-answer ${expandedQuestionIndex === index ? 'visible' : ''}`}
                    style={{ maxHeight: expandedQuestionIndex === index ? '200px' : '0' }}>
                    <p>{item.answer}</p>
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