import * as React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./answer_q.css";

import {
  FiArrowLeft, FiBookmark, FiChevronDown, FiEye, FiHeart, FiMail,
  FiMessageSquare, FiMoon, FiMoreVertical, FiSend, FiThumbsUp, FiZap
} from "react-icons/fi";

function QuestionDetail() {
  // Hook do nawigacji po stronach
  const navigate = useNavigate();

  // Hook do pobrania danych z aktualnej lokalizacji (np. state przekazywany w nawigacji)
  const location = useLocation();

  // Hook do pobrania parametru z URL (tu id pytania)
  const { id } = useParams();

  // Pobieramy aktualnego użytkownika z localStorage i parsujemy na obiekt JS
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Stan pytania — najpierw próbujemy wziąć z location.state (np. przekazane z poprzedniej strony),
  // jeśli nie ma, to tworzymy domyślne (na podstawie parametru id z URL)
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

  // Stan odpowiedzi pod pytaniem — początkowo pobieramy je z localStorage (jeśli są zapisane)
  const [answers, setAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem(`answers_${id}`);
    return storedAnswers ? JSON.parse(storedAnswers) : [];
  });

  // Stan nowych wpisywanych odpowiedzi (textarea)
  const [newAnswer, setNewAnswer] = useState("");

  // Stan zakładek (bookmarków) — także przechowywany w localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  });

  // Funkcja zwracająca wyświetlaną nazwę użytkownika (z localStorage lub "Guest")
  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };

  // Funkcja tworząca inicjały użytkownika (pierwsze dwie litery nazwy)
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest') return 'GU';
    return displayName.substring(0, 2).toUpperCase();
  };

  // Funkcja wywoływana po kliknięciu "Wyślij" odpowiedź
  const handleSendAnswer = () => {
    // Sprawdzamy, czy odpowiedź nie jest pusta (po obcięciu spacji)
    if (newAnswer.trim()) {
      // Tworzymy nowy obiekt odpowiedzi
      const newAnswerObj = {
        id: Date.now(),  // unikalne ID na podstawie czasu
        author: getUserDisplayName(),  // autor to aktualny użytkownik
        authorTitle: "Student",        // rola autora, tu na sztywno "Student"
        timeAgo: "just now",           // oznaczenie czasu (nowa odpowiedź)
        content: newAnswer.trim(),     // tekst odpowiedzi (bez spacji z końca)
        likes: 0,                      // liczba lajków na start
        isExpert: false,               // czy ekspert? na start false
        helpful: false,                // czy pomocna? na start false
        likedBy: [],                   // tablica ID użytkowników, którzy polubili odpowiedź
        questionId: id,                // id pytania, do którego należy odpowiedź
        questionTitle: question.highlight // tytuł pytania (przydatne do bookmarków)
      };

      // Dodajemy nową odpowiedź na początek listy
      const updatedAnswers = [newAnswerObj, ...answers];

      // Aktualizujemy stan i zapisujemy do localStorage
      setAnswers(updatedAnswers);
      localStorage.setItem(`answers_${id}`, JSON.stringify(updatedAnswers));

      // Czyścimy pole tekstowe
      setNewAnswer("");
    }
  };

  // Funkcja do kliknięcia "lubię to" na odpowiedzi
  const handleLikeAnswer = (answerId) => {
    const updatedAnswers = answers.map(answer => {
      if (answer.id === answerId) {
        // Sprawdzamy, czy użytkownik już polubił tę odpowiedź
        const isLiked = answer.likedBy?.includes(currentUser?.id);
        return {
          ...answer,
          // Jeśli już lubił - zmniejszamy liczbę polubień, inaczej zwiększamy
          likes: isLiked ? answer.likes - 1 : answer.likes + 1,
          // Aktualizujemy tablicę userów, którzy polubili
          likedBy: isLiked
            ? answer.likedBy.filter(id => id !== currentUser?.id) // usuwamy użytkownika
            : [...(answer.likedBy || []), currentUser?.id]          // dodajemy użytkownika
        };
      }
      return answer; // niezmienione odpowiedzi zwracamy tak jak były
    });

    // Aktualizujemy stan i localStorage
    setAnswers(updatedAnswers);
    localStorage.setItem(`answers_${id}`, JSON.stringify(updatedAnswers));
  };

  // Funkcja dodająca lub usuwająca odpowiedź z zakładek (bookmarków)
  const handleBookmarkAnswer = (answer) => {
    // Sprawdzamy, czy odpowiedź jest już w bookmarkach dla aktualnego użytkownika
    const isBookmarked = bookmarks.some(
      bookmark => bookmark.id === answer.id && bookmark.userId === currentUser?.id
    );

    let updatedBookmarks;

    if (isBookmarked) {
      // Jeśli już jest, to ją usuwamy z bookmarków
      updatedBookmarks = bookmarks.filter(
        bookmark => !(bookmark.id === answer.id && bookmark.userId === currentUser?.id)
      );
    } else {
      // Jeśli nie ma, to dodajemy nową zakładkę
      updatedBookmarks = [
        ...bookmarks,
        {
          id: answer.id,
          userId: currentUser?.id,
          content: answer.content,
          author: answer.author,
          timeAgo: answer.timeAgo,
          questionId: answer.questionId || id,
          questionTitle: answer.questionTitle || question.highlight
        }
      ];
    }

    // Aktualizujemy stan i localStorage
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Funkcja sprawdzająca, czy użytkownik polubił daną odpowiedź
  const isAnswerLiked = (answer) => {
    return answer.likedBy?.includes(currentUser?.id);
  };

  // Funkcja sprawdzająca, czy dana odpowiedź jest w zakładkach aktualnego użytkownika
  const isAnswerBookmarked = (answer) => {
    return bookmarks.some(
      bookmark => bookmark.id === answer.id && bookmark.userId === currentUser?.id
    );
  };

  // Renderowanie całej strony pytania i odpowiedzi
  return (
    <div className="answall">
      <div className="app">
        {/* Nagłówek z nawigacją i danymi użytkownika */}
        <header className="header-main">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-accent">solve</span></span>
              </div>
            </div>
            <div className="header-center">
              {/* Przycisk powrotu do strony głównej */}
              <button className="back-button" onClick={() => navigate('/main')}>
                <FiArrowLeft />
                <span>Back to Home</span>
              </button>
            </div>
            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-btn"><FiMoon /></button>
              <button className="icon-btn"><FiMail /></button>
              {/* Menu użytkownika */}
              <div className="user-menu" onClick={() => navigate('/profile')}>
                <div className="avatar"><span>{getUserInitials()}</span></div>
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-role">Student</span>
                </div>
                <FiChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>
        </header>

        <div className="question-detail-container">
          {/* Główna sekcja z pytaniem i odpowiedziami */}
          <main className="question-detail-main">
            {/* Karta pytania */}
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
                  <button className="icon-btn"><FiBookmark /></button>
                  <button className="icon-btn"><FiMoreVertical /></button>
                </div>
              </div>
              <div className="question-content-detail">
                <h1 className="question-title">{question.highlight}</h1>
                <div className="question-tags">
                  {/* Wyświetlamy tagi */}
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

            {/* Sekcja odpowiedzi */}
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

              {/* Lista odpowiedzi */}
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
                        <div className="avatar"><span>{answer.author.substring(0, 2)}</span></div>
                        <div className="author-info">
                          <div className="author-name">
                            {answer.author}
                            {answer.isExpert && <span className="expert-icon">✓</span>}
                          </div>
                          <div className="author-title">{answer.authorTitle}</div>
                          <div className="answer-time">{answer.timeAgo}</div>
                        </div>
                      </div>
                      {/* Odznaka "pomocna odpowiedź" */}
                      {answer.helpful && (
                        <div className="helpful-badge">
                          <FiThumbsUp />
                          <span>Helpful</span>
                        </div>
                      )}
                    </div>
                    <div className="answer-content"><p>{answer.content}</p></div>
                    <div className="answer-actions">
                      {/* Przycisk "lubię to" */}
                      <button 
                        className={`answer-action-btn ${isAnswerLiked(answer) ? 'liked' : ''}`}
                        onClick={() => handleLikeAnswer(answer.id)}
                      >
                        <FiThumbsUp className={isAnswerLiked(answer) ? 'liked-icon' : ''} />
                        <span>{answer.likes}</span>
                      </button>

                      {/* Przycisk odpowiedzi (bez funkcji) */}
                      <button className="answer-action-btn">
                        <FiMessageSquare />
                        <span>Reply</span>
                      </button>

                      {/* Przycisk zakładki */}
                      <button 
                        className={`answer-action-btn ${isAnswerBookmarked(answer) ? 'bookmarked' : ''}`}
                        onClick={() => handleBookmarkAnswer(answer)}
                      >
                        <FiBookmark className={isAnswerBookmarked(answer) ? 'bookmarked-icon' : ''} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sekcja dodawania nowej odpowiedzi */}
            <div className="add-answer-section">
              <h3>Your Answer</h3>
              <div className="answer-input-container">
                {/* Awatar użytkownika */}
                <div className="user-avatar"><span>{getUserInitials()}</span></div>
                <div className="answer-input-wrapper">
                  {/* Pole tekstowe do wpisywania odpowiedzi */}
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
                    {/* Przycisk wysłania odpowiedzi, wyłączony jeśli puste pole */}
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

          {/* Prawy sidebar z dodatkowymi informacjami */}
          <aside className="right-sidebar">
            {/* Powiązane pytania */}
            <div className="sidebar-card">
              <h3>Related Questions</h3>
              <div className="related-list">
                <div className="related-item">
                  <div className="related-title">MySQL performance tuning best practices</div>
                  <div className="related-stats"><span>12 answers</span><span>•</span><span>324 views</span></div>
                </div>
                <div className="related-item">
                  <div className="related-title">Database indexing strategies</div>
                  <div className="related-stats"><span>8 answers</span><span>•</span><span>156 views</span></div>
                </div>
                <div className="related-item">
                  <div className="related-title">How to optimize JOIN queries</div>
                  <div className="related-stats"><span>7 answers</span><span>•</span><span>189 views</span></div>
                </div>
              </div>
            </div>

            {/* Statystyki pytania */}
            <div className="sidebar-card">
              <h3>Question Stats</h3>
              <div className="stats-list">
                <div className="stat-item"><span className="stat-label">Asked</span><span className="stat-value">{question.timeAgo}</span></div>
                <div className="stat-item"><span className="stat-label">Views</span><span className="stat-value">{question.views}</span></div>
                <div className="stat-item"><span className="stat-label">Likes</span><span className="stat-value">{question.likes}</span></div>
                <div className="stat-item"><span className="stat-label">Answers</span><span className="stat-value">{answers.length}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
