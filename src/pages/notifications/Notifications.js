import React, { useState } from 'react';
import './Notifications.css';
import { UserContext } from '../main/main';

const Notifications = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const {user, setUser, getUserInitials} = React.useContext(UserContext);
  const notificationsData = {
    today: [
      { user: 'JohnDoe', action: 'answered your question:', content: 'How to fix the NullPointerException in Java?', time: '2 minutes ago', type: 'reply' },
      { user: 'Millie_K', action: 'answered your question:', content: 'How to fix the NullPointerException in Java?', time: '10 minutes ago', type: 'reply' },
      { user: 'SkrrVendy', action: 'liked your question:', time: '1h ago', type: 'like' },
      { user: 'Snapsolve', action: 'System update available.', time: '5h ago', type: 'system' }
    ],
    yesterday: [
      { user: 'JohnDoe', action: 'answered your question:', content: 'How to fix the NullPointerException in Java?', time: 'Yesterday', type: 'reply' },
      { user: 'Millie_K', action: 'answered your question:', content: 'How to fix the NullPointerException in Java?', time: 'Yesterday', type: 'reply' }
    ]
  };

 const getInitials = (name) => {
    return name.split(/(?=[A-Z])/).map(word => word[0]).join('').toUpperCase();
    };

  const getTagText = (type) => {
    switch(type) {
      case 'reply': return 'Reply';
      case 'like': return 'Like';
      case 'system': return 'System';
      default: return '';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-tabs">
          {['General', 'Social', 'System'].map(tab => (
            <span 
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <button className="mark-all-read">Mark all as read</button>
      </div>
      <div className="notifications-list">
        <h3>TODAY</h3>
        <div>
          {getUserInitials()}
        </div>
        {notificationsData.today.map((notification, index) => (
          <div className="notification-item" key={`today-${index}`}>
            <div className="notification-avatar">
              {getInitials(notification.user)}
            </div>
            <div className="notification-content-wrapper">
              <div>
                <span className="notification-user">{notification.user}</span>
                <span className="notification-action"> {notification.action}</span>
              </div>
              {notification.content && (
                <div className="notification-content">"{notification.content}"</div>
              )}
              <div className="notification-time">{notification.time}</div>
              <span className={`notification-tag ${notification.type}`}>
                {getTagText(notification.type)}
              </span>
            </div>
          </div>
        ))}
        <h3>YESTERDAY</h3>
        {notificationsData.yesterday.map((notification, index) => (
          <div className="notification-item" key={`yesterday-${index}`}>
            <div className="notification-avatar">
              {getInitials(notification.user)}
            </div>
            <div className="notification-content-wrapper">
              <div>
                <span className="notification-user">{notification.user}</span>
                <span className="notification-action"> {notification.action}</span>
              </div>
              {notification.content && (
                <div className="notification-content">"{notification.content}"</div>
              )}
              <div className="notification-time">{notification.time}</div>
              <span className={`notification-tag ${notification.type}`}>
                {getTagText(notification.type)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;