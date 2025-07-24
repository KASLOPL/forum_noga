
import React from 'react';
import { FiBookmark, FiMoreVertical, FiChevronUp, FiChevronDown, FiHeart, FiEye } from 'react-icons/fi';
import './question_field.css';

const QuestionField = ({
  question,
  expandedQuestion,
  onCardClick,
  onBookmarkClick,
  isBookmarked,
  onToggleExpand,
  onLikeClick,
  liked
}) => {
  return (
    <div key={question.id} className="question-card" onClick={() => onCardClick(question)} style={{ cursor: 'pointer' }}>
      <div className="card-header" onClick={e => { e.stopPropagation(); }}>
        <div className="author">
          <div className="avatar">
            <span>{question.author?.substring(0, 2).toUpperCase() || '??'}</span>
          </div>
          <div className="author-info">
            <div className="author-name">{question.author || 'Unknown Author'}</div>
            <div className="author-time">{question.timeAgo}</div>
          </div>
        </div>
        <div className="card-actions">
          <button className={`icon-btn ${isBookmarked ? 'bookmarked' : ''}`} onClick={e => onBookmarkClick(question, e)}>
            <FiBookmark style={{ fill: isBookmarked ? '#4CAF50' : 'none' }} />
          </button>
          <button className="icon-btn" onClick={e => { e.stopPropagation(); }}><FiMoreVertical /></button>
        </div>
      </div>

      <div className="question-title">
        <h3>{question.title || question.highlight}</h3>
      </div>
      <div className="question-tags">
        {question.tags && question.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="question-content">
        {(() => {
          const content = question.content || '';
          const hasNoSpaces = !content.includes(' ');
          const limit = hasNoSpaces ? 90 : 300;
          const isLong = content.length > limit;
          if (expandedQuestion === question.id) { 
            return <p>{question.fullContent}</p>;
          } else if (isLong) {
            return (
              <p>
                {content.slice(0, limit)}...
                <button
                  className="see-more-btn"
                  onClick={e => { e.stopPropagation(); onCardClick(question); }}
                >
                  See more
                </button>
              </p>
            );
          } else {
            return <p>{content}</p>;
          }
        })()}
        {question.fullContent && question.fullContent !== question.content && (
          <button className="expand-btn" onClick={e => onToggleExpand(question.id, e)}>
            {expandedQuestion === question.id ? (
              <><span>Show less</span><FiChevronUp /></>
            ) : (
              <><span>Read more</span><FiChevronDown /></>
            )}
          </button>
        )}
      </div>

      <div className="card-footer" onClick={e => { e.stopPropagation(); }}>
        <div className="responders">
          {Array.from({ length: question.responders || 0 }, (_, i) => (
            <div key={i} className="avatar avatar-small">
              <span>{String.fromCharCode(65 + i)}</span>
            </div>
          ))}
        </div>

        <div className="stats">
          <div className="stat like-btn" onClick={e => onLikeClick(question.id, e)}>
            <FiHeart
              className="heart-icon"
              style={{
                fill: liked ? '#ff4757' : 'none',
                color: liked ? '#ff4757' : '#666'
              }}
            />
            <span>{question.likes || 0}</span>
          </div>
          <div className="stat"><FiEye /><span>{question.views || 0}</span></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionField;
