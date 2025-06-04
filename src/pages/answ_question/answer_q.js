import * as React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./answer_q.css"; // style dla tej strony

// Ikony z react-icons
import {
  FiArrowLeft,
  FiBookmark,
  FiChevronDown,
  FiEye,
  FiHeart,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiMoreVertical,
  FiSend,
  FiThumbsUp,
  FiUser,
  FiZap,
} from "react-icons/fi";

function QuestionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Pobieramy pytanie z state lub tworzymy przykładowe
  const [question] = useState(location.state?.question || {
    id: parseInt(id),
    author: "Anna K.",
    timeAgo: "2 hours ago",
    highlight: "Jak zoptymalizować zapytania SQL w dużej bazie danych?",
    tags: ["SQL", "Database", "Performance"],
    fullContent: "Pracuję nad aplikacją, która musi przetwarzać duże ilości danych z bazy MySQL. Mam tabelę z 5 milionami rekordów i zapytania trwają bardzo długo. Próbowałem już indeksów, ale to nie pomogło wystarczająco. Czy ktoś może podpowiedzieć najlepsze praktyki optymalizacji zapytań SQL dla tak dużych zbiorów danych?",
    likes: 23,
    views: 1284,
    responders: 3
  });

  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState(() => {
  const storedAnswers = localStorage.getItem(`answers_${id}`);
  if (storedAnswers) return JSON.parse(storedAnswers);
  return []; // domyślnie pusto lub możesz dodać przykładowe odpowiedzi
});

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

  const handleSendAnswer = () => {
    if (newAnswer.trim()) {
      // tutaj byłoby dodawanie odpowiedzi do bazy
      console.log("Nowa odpowiedź:", newAnswer);
      setNewAnswer("");
    }
  };

  return (
    <div className="caloscMain">
      <div className="app">
        
        {/* HEADER - statyczny */}
        <header className="header header-fixed">
          <div className="header-container">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-text-highlight">solve</span></span>
              </div>
            </div>

            <div className="header-center">
              <button className="back-button" onClick={() => navigate('/main')}>
                <FiArrowLeft />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="header-actions">
              <button className="icon-button"><FiMoon /></button>
              <button className="icon-button"><FiMail /></button>
              <div className="user-profile" onClick={() => navigate('/profile')}>
              <div className="avatar">
                  <span>{getUserInitials()}</span>
                </div>
                <div className="user-info">
                <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-role">Student</span>
                </div>
                <FiChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT - przewijalna cała strona */}
        <div className="question-detail-container">
          <main className="question-detail-main">
            
            {/* PYTANIE GŁÓWNE */}
            <div className="main-question-card">
              <div className="question-card-header">
                <div className="question-author">
                  <div className="avatar avatar-large">
                    <span>{question.author.substring(0, 2)}</span>
                  </div>
                  <div className="author-info">
                    <div className="author-name">{question.author}</div>
                    <div className="author-time">{question.timeAgo}</div>
                  </div>
                </div>
                <div className="question-actions">
                  <button className="icon-button"><FiBookmark /></button>
                  <button className="icon-button"><FiMoreVertical /></button>
                </div>
              </div>

              <div className="question-content-detail">
                <h1 className="question-title">{question.highlight}</h1>
                <div className="question-tags">
                  {question.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <p className="question-text">{question.fullContent}</p>
              </div>

              <div className="question-stats-detail">
                <div className="stat-group">
                  <button className="stat-button">
                    <FiHeart className="heart-icon" />
                    <span>{question.likes}</span>
                  </button>
                  <div className="stat">
                    <FiEye />
                    <span>{question.views}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ODPOWIEDZI */}
            <div className="answers-section">
              <div className="answers-header">
                <h2>{answers.length} Answers</h2>
                <div className="sort-answers">
                  <span>Sort by: </span>
                  <select>
                    <option>Most Helpful</option>
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="answers-list">
                {answers.map((answer) => (
                  <div key={answer.id} className={`answer-card ${answer.isExpert ? 'expert-answer' : ''}`}>
                    {answer.isExpert && (
                      <div className="expert-badge">
                        <span>Expert Answer</span>
                      </div>
                    )}
                    
                    <div className="answer-header">
                      <div className="answer-author">
                        <div className="avatar">
                          <span>{answer.author.substring(0, 2)}</span>
                        </div>
                        <div className="author-info">
                          <div className="author-name">
                            {answer.author}
                            {answer.isExpert && <span className="expert-icon">✓</span>}
                          </div>
                          <div className="author-title">{answer.authorTitle}</div>
                          <div className="answer-time">{answer.timeAgo}</div>
                        </div>
                      </div>
                      {answer.helpful && (
                        <div className="helpful-badge">
                          <FiThumbsUp />
                          <span>Helpful</span>
                        </div>
                      )}
                    </div>

                    <div className="answer-content">
                      <p>{answer.content}</p>
                    </div>

                    <div className="answer-actions">
                      <button className="answer-action-btn">
                        <FiThumbsUp />
                        <span>{answer.likes}</span>
                      </button>
                      <button className="answer-action-btn">
                        <FiMessageSquare />
                        <span>Reply</span>
                      </button>
                      <button className="answer-action-btn">
                        <FiBookmark />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DODAJ ODPOWIEDŹ */}
            <div className="add-answer-section">
              <h3>Your Answer</h3>
              <div className="answer-input-container">
              <div className="user-avatar">
                  <span>{getUserInitials()}</span>
                </div>
                <div className="answer-input-wrapper">
                  <textarea
                    className="answer-input"
                    placeholder="Share your knowledge and help solve this question..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={4}
                  />
                  <div className="answer-input-actions">
                    <div className="input-tools">
                      <span className="input-hint">Be specific and helpful</span>
                    </div>
                    <button 
                      className="send-answer-btn"
                      onClick={handleSendAnswer}
                      disabled={!newAnswer.trim()}
                    >
                      <FiSend />
                      <span>Post Answer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="right-sidebar">
            <div className="related-questions">
              <h3>Related Questions</h3>
              <div className="related-list">
                <div className="related-item">
                  <div className="related-title">MySQL performance tuning best practices</div>
                  <div className="related-stats">
                    <span>12 answers</span>
                    <span>•</span>
                    <span>324 views</span>
                  </div>
                </div>
                <div className="related-item">
                  <div className="related-title">Database indexing strategies</div>
                  <div className="related-stats">
                    <span>8 answers</span>
                    <span>•</span>
                    <span>156 views</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="question-stats-sidebar">
              <h3>Question Stats</h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Asked</span>
                  <span className="stat-value">{question.timeAgo}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Viewed</span>
                  <span className="stat-value">{question.views} times</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active</span>
                  <span className="stat-value">20 minutes ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;