import React, { useState } from 'react';
import './profile.css';
import {
  Bell,
  Home,
  BookOpen,
  MessageSquare,
  Settings,
  HelpCircle,
  Moon,
  Mail,
  ChevronDown,
  MoreVertical,
  ThumbsUp,
  Eye,
  Heart,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  const uzytkownik = {
    imie: 'Basjan Kojko',
    username: '@basjan.kojko',
    szkola: 'Zespół Szkół Energetycznych Technikum nr 13',
    opis: 'Klepię kod jak combo w ulubionych grze, bo nie ma lepszego uczucia niż zobaczyć jak wszystko w końcu działa 😎'
  };

  const linkiNawigacji = [
    { ikona: <Home size={16} />, tekst: 'Home', aktywny: true, sciezka: '/main' },
    { ikona: <Bell size={16} />, tekst: 'Notifications', aktywny: false },
    { ikona: <BookOpen size={16} />, tekst: 'Specialists', aktywny: false },
    { ikona: <MessageSquare size={16} />, tekst: 'My Answers', aktywny: false }
  ];

  const [activeTab, setActiveTab] = useState('Questions & Replies');

  const pytania = [
    {
      id: 1,
      user: 'U',
      likes: 2,
      views: 36,
      hasHighlight: false,
      reactions: []
    },
    {
      id: 2,
      user: 'U',
      hasHighlight: true,
      tags: 3,
      reactions: ['U', 'U', 'U'],
      hasHeart: true
    },
    {
      id: 3,
      user: 'U',
      likes: 2,
      views: 36,
      hasHighlight: false,
      reactions: []
    },
    {
      id: 4,
      user: 'U',
      hasContent: false
    }
  ];

  return (
    <div className="profile-app">
      {/* HEADER - taki sam jak w Help */}
      <header className="header">
        <div className="navbar">
          <div className="left-section">
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
                      if (el.sciezka) navigate(el.sciezka);
                    }}
                  >
                    {el.ikona}{el.tekst}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="right-nav">
            <button className="icon-btn"><Settings size={18} /></button>
            <button className="icon-btn"><HelpCircle size={18} /></button>
            <button className="icon-btn"><Moon size={18} /></button>
            <button className="icon-btn"><Mail size={18} /></button>

            <div className="user-profile">
              <div className="avatar">
                <span>BK</span>
              </div>
              <div className="user-info">
                <div className="name">Basjan Kojko</div>
                <div className="role">Student</div>
              </div>
              <ChevronDown size={16} style={{ color: '#9d9d9d', marginLeft: '4px' }} />
            </div>
          </div>
        </div>
      </header>

      {/* GŁÓWNA ZAWARTOŚĆ */}
      <div className="main-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">BK</div>
              <h2 className="profile-name">{uzytkownik.imie}</h2>
              <p className="profile-username">{uzytkownik.username}</p>
              <p className="profile-school">{uzytkownik.szkola}</p>
            </div>

            <div className="profile-description">
              <p>{uzytkownik.opis}</p>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-icon"></div>
                <div className="stat-text"></div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"></div>
                <div className="stat-text"></div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"></div>
                <div className="stat-text"></div>
              </div>
            </div>
          </div>

          <div className="interests-section">
            <h3>Interests</h3>
            <div className="interest-tags">
              <span className="tag">Hgagddf</span>
              <span className="tag">Programming</span>
              <span className="tag">Programming</span>
              <span className="tag">Hgagddf</span>
            </div>
          </div>

          <div className="interests-section">
            <h3>Interests</h3>
            <div className="interest-tags">
              <span className="tag">Hgagddf</span>
              <span className="tag">Programming</span>
              <span className="tag">Programming</span>
              <span className="tag">Hgagddf</span>
            </div>
          </div>
        </aside>

        {/* GŁÓWNA ZAWARTOŚĆ */}
        <main className="content">
          <div className="content-header">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'Questions & Replies' ? 'active' : ''}`}
                onClick={() => setActiveTab('Questions & Replies')}
              >
                Questions & Replies
              </button>
              <button 
                className={`tab ${activeTab === 'Questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('Questions')}
              >
                Questions
              </button>
            </div>
            <div className="header-actions">
              <button className="btn-secondary">Edit profile</button>
              <button className="btn-secondary">Settings</button>
            </div>
          </div>

          <div className="questions-list">
            {pytania.map((pytanie) => (
              <div className="question-card" key={pytanie.id}>
                <div className="question-header">
                  <div className="user-avatar-small gray">{pytanie.user}</div>
                  <div className="question-meta">
                    <div className="placeholder-text short"></div>
                    <div className="placeholder-text medium"></div>
                  </div>
                  <button className="menu-btn"><MoreVertical size={16} /></button>
                </div>
                
                {pytanie.hasContent !== false && (
                  <>
                    <div className="question-content">
                      {pytanie.hasHighlight && (
                        <div className="highlighted-content">
                          <div className="placeholder-text long"></div>
                        </div>
                      )}
                      
                      {pytanie.tags && (
                        <div className="content-tags">
                          {Array.from({ length: pytanie.tags }).map((_, i) => (
                            <span key={i} className="content-tag"></span>
                          ))}
                        </div>
                      )}
                      
                      {!pytanie.hasHighlight && (
                        <div className="placeholder-text long"></div>
                      )}
                      
                      {pytanie.hasHighlight && (
                        <div className="placeholder-text extra-long"></div>
                      )}
                    </div>

                    <div className="question-footer">
                      {pytanie.reactions.length > 0 ? (
                        <div className="user-reactions">
                          {pytanie.reactions.map((reaction, i) => (
                            <div key={i} className="reaction-avatar">{reaction}</div>
                          ))}
                        </div>
                      ) : <div></div>}
                      
                      <div className="engagement">
                        {pytanie.hasHeart ? (
                          <span className="engagement-item"><Heart size={16} /></span>
                        ) : (
                          <span className="engagement-item"><ThumbsUp size={14} /> {pytanie.likes}</span>
                        )}
                        <span className="engagement-item"><Eye size={14} /> {pytanie.views || ''}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;