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

const Help = () => {
  // Stan dla rozwiniętego pytania FAQ
  const [expandedQuestion, setExpandedQuestion] = useState(2);
  // Stan dla tekstu wyszukiwania
  const [searchText, setSearchText] = useState('');

  // Dane użytkownika (uproszczone)
  const currentUser = { name: 'Guest' };

  // Lista tematów pomocy
  const helpTopics = [
    { 
      title: 'Getting Started', 
      description: 'Learn the basics of using SnapSolve and asking your first question.' 
    },
    { 
      title: 'Account Management', 
      description: 'Manage your profile, settings, and account preferences.' 
    },
    { 
      title: 'Asking Questions', 
      description: 'Best practices for asking questions to get better answers.' 
    },
    { 
      title: 'Finding Experts', 
      description: 'How to connect with specialists in your field of interest.' 
    },
    { 
      title: 'Bookmarks & Saved Content', 
      description: 'Organize and save important questions and answers.' 
    },
    { 
      title: 'Safety & Privacy', 
      description: 'Learn about our community guidelines and privacy settings.' 
    }
  ];

  // Lista FAQ
  const faqList = [
    { 
      question: 'How do I reset my password?', 
      answer: 'You can reset your password by clicking "Forgot Password" on the login page and following the instructions sent to your email.' 
    },
    { 
      question: 'How do I change my email address?', 
      answer: 'Go to Settings > Account > Email Settings to update your email address. You\'ll need to verify the new email.' 
    },
    {
      question: 'Where can I find my questions and answers?',
      answer: 'You can find your questions in the "My Questions" section in the sidebar, and your answers in your profile page.'
    },
    { 
      question: 'How do I delete my account?', 
      answer: 'Go to Settings > Account > Delete Account. Please note that this action cannot be undone.' 
    },
    { 
      question: 'How do I report a problem or inappropriate content?', 
      answer: 'Use the three-dot menu on any post to report content, or contact our support team directly.' 
    },
    { 
      question: 'Is my data safe and secure?', 
      answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information and data.' 
    }
  ];

  // Linki nawigacyjne
  const navLinks = [
    { icon: <Home size={16} />, text: 'Home', active: false },
    { icon: <Bell size={16} />, text: 'Notifications', active: false },
    { icon: <BookOpen size={16} />, text: 'Specialists', active: false },
    { icon: <MessageSquare size={16} />, text: 'My Questions', active: false }
  ];

  // Funkcja obsługi wyszukiwania
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      console.log('Searching for:', searchText);
      // Tutaj można dodać logikę wyszukiwania
    }
  };

  // Funkcja przełączania FAQ
  const toggleFAQ = (index) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null); // Zamknij jeśli już otwarte
    } else {
      setExpandedQuestion(index); // Otwórz wybrane pytanie
    }
  };

  return (
    <div className='calosc'>
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="navbar">
          <div className="left-section">
            <button className="back-button">
              <ArrowLeft size={20} />
            </button>

            <div className="logo-container">
              <div className="logo-icon">
                <Zap size={20} />
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
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {item.icon}
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="right-nav">
            <button className="icon-btn">
              <Bell size={20} />
            </button>

            <div className="user-profile">
              <div className="avatar">
                <span>{currentUser.name.substring(0, 2)}</span>
              </div>
              <div className="user-info">
                <div className="name">{currentUser.name}</div>
                <div className="role">Student</div>
              </div>
              <ChevronDown size={16} style={{ color: '#9d9d9d', marginLeft: '4px' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Główna treść */}
      <main className="main">
        {/* Sekcja wyszukiwania */}
        <section className="search-section">
          <h1>
            How can <span className="highlight">we</span> help?
          </h1>

          <form className="search-container" onSubmit={handleSearch}>
            <div className="search-icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for answer..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="top-searches">
            <h3>Top searches</h3>
            <div className="search-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Account recovery</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Asking questions</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Finding experts</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy settings</a>
            </div>
          </div>
        </section>

        {/* Sekcja tematów */}
        <section className="topics-section">
          <h2>Explore all topics</h2>
          <div className="topics-grid">
            {helpTopics.map((topic, index) => (
              <div className="topic-card" key={index}>
                <div className="topic-icon"></div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <a 
                  href="#" 
                  className="see-detail" 
                  onClick={(e) => e.preventDefault()}
                >
                  See detail →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Sekcja FAQ */}
        <section className="faq-section">
          <h2>Frequently asked questions</h2>
          <p className="faq-description">
            Find quick answers to the most common questions about using SnapSolve. 
            If you can't find what you're looking for, feel free to contact our support team.
          </p>

          <div className="faq-container">
            {faqList.map((item, index) => (
              <div 
                className={`faq-item ${expandedQuestion === index ? 'active' : ''}`} 
                key={index}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-icon">
                    {expandedQuestion === index ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                  <span>{item.question}</span>
                </button>

                <div 
                  className={`faq-answer ${expandedQuestion === index ? 'visible' : ''}`}
                >
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