import * as React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./answer_q.css";

import {
  FiArrowLeft, FiBookmark, FiChevronDown, FiEye, FiHeart, FiMail,
  FiMessageSquare, FiMoon, FiMoreVertical, FiSend, FiThumbsUp, FiZap
} from "react-icons/fi";

// Firebase
import { db } from '../../firebase'; // Upewnij się, że ten plik istnieje
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";


function QuestionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const [question, setQuestion] = useState(location.state?.question || null);

  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [bookmarks, setBookmarks] = useState(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  });

  const [youtubeVideoId, setYoutubeVideoId] = useState(null);

  const getUserDisplayName = () => {
    return currentUser?.userName || currentUser?.name || 'Guest';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName === 'Guest' ? 'GU' : displayName.substring(0, 2).toUpperCase();
  };

  const extractYouTubeVideoId = (text) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  // 🔽 Pobieranie pytania i odpowiedzi z Firebase
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        // Pobierz pytanie jeśli nie ma w stanie
        if (!question) {
          const docRef = doc(db, "questions", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setQuestion({ id: docSnap.id, ...docSnap.data() });
          }
        }
        // Pobierz odpowiedzi
        const q = query(collection(db, "answers"), where("questionId", "==", id));
        const querySnapshot = await getDocs(q);
        const loadedAnswers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnswers(loadedAnswers);
      } catch (err) {
        console.error("Błąd przy pobieraniu danych:", err);
      }
    };
    fetchQuestionAndAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSendAnswer = async () => {
    if (newAnswer.trim()) {
      const videoId = extractYouTubeVideoId(newAnswer.trim());
      setYoutubeVideoId(videoId || null);
      
      const newAnswerObj = {
        UID: currentUser.uid,
        author: getUserDisplayName(),
        authorTitle: "Student",
        timeAgo: "just now",
        title: question?.title || question?.highlight || '',
        content: newAnswer.trim(),
        likes: 0,
        isExpert: false,
        helpful: false,
        questionId: id,
      };

      try {
        const docRef = await addDoc(collection(db, "answers"), newAnswerObj);
        setAnswers(prev => [{ id: docRef.id, ...newAnswerObj }, ...prev]);
        setNewAnswer("");
      } catch (err) {
        console.error("Błąd przy dodawaniu odpowiedzi:", err);
      }
    }
  };

  const handleLikeAnswer = async (answerId) => {
    const answerToUpdate = answers.find(a => a.id === answerId);
    if (!answerToUpdate) return;

    const isLiked = answerToUpdate.likedBy?.includes(currentUser?.id);
    const updatedLikes = isLiked ? answerToUpdate.likes - 1 : answerToUpdate.likes + 1;
    const updatedLikedBy = isLiked
      ? answerToUpdate.likedBy.filter(uid => uid !== currentUser?.id)
      : [...(answerToUpdate.likedBy || []), currentUser?.id];

    try {
      const docRef = doc(db, "answers", answerId);
      await updateDoc(docRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy
      });

      setAnswers(prev =>
        prev.map(a =>
          a.id === answerId ? { ...a, likes: updatedLikes, likedBy: updatedLikedBy } : a
        )
      );
    } catch (err) {
      console.error("Błąd przy aktualizacji lajków:", err);
    }
  };

  const handleBookmarkAnswer = (answer) => {
    const isBookmarked = bookmarks.some(
      bookmark => bookmark.id === answer.id && bookmark.userId === currentUser?.id
    );

    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(b => !(b.id === answer.id && b.userId === currentUser?.id))
      : [...bookmarks, {
          id: answer.id,
          userId: currentUser?.id,
          content: answer.content,
          author: answer.author,
          timeAgo: answer.timeAgo,
          questionId: answer.questionId,
          questionTitle: answer.questionTitle
        }];

    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const isAnswerLiked = (answer) => {
    return answer.likedBy?.includes(currentUser?.id);
  };

  const isAnswerBookmarked = (answer) => {
    return bookmarks.some(
      bookmark => bookmark.id === answer.id && bookmark.userId === currentUser?.id
    );
  };

  return (
    <div className="answall">
      <div className="app">
        <header className="header-main">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <div className="logo-icon"><FiZap /></div>
                <span className="logo-text">Snap<span className="logo-accent">solve</span></span>
              </div>
            </div>
            <div className="header-center">
              <button className="back-button" onClick={() => navigate('/main')}>
                <FiArrowLeft />
                <span>Back to Home</span>
              </button>
            </div>
            <div className="header-actions">
              <div className="divider"></div>
              <button className="icon-btn"><FiMoon /></button>
              <button className="icon-btn"><FiMail /></button>
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
          <main className="question-detail-main">
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
                <h1 className="question-title">{question?.title || question?.highlight || 'Brak tytułu'}</h1>
                <div className="question-tags">
                  {question?.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <p className="question-text">{question?.fullContent}</p>
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
                      {answer.helpful && (
                        <div className="helpful-badge">
                          <FiThumbsUp />
                          <span>Helpful</span>
                        </div>
                      )}
                    </div>
                    <div className="answer-content"><p>{answer.content}</p></div>
                    <div className="answer-actions">
                      <button 
                        className={`answer-action-btn ${isAnswerLiked(answer) ? 'liked' : ''}`}
                        onClick={() => handleLikeAnswer(answer.id)}
                      >
                        <FiThumbsUp className={isAnswerLiked(answer) ? 'liked-icon' : ''} />
                        <span>{answer.likes}</span>
                      </button>

                      <button className="answer-action-btn">
                        <FiMessageSquare />
                        <span>Reply</span>
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
                <div className="user-avatar"><span>{getUserInitials()}</span></div>
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
                  {/* Osadzenie filmiku YouTube jeśli znaleziono link */}
                  {youtubeVideoId && (
                    <div className="youtube-video-preview" style={{marginTop: '1rem'}}>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
