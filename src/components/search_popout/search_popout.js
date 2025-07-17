import React from "react";
import { X, Clock } from "lucide-react";
import "./search_popout.css";

export default function SearchPopout({ isOpen, onClose }) {
  const [searchTags, setSearchTags] = React.useState([
    { id: "1", label: "Design & UX" },
    { id: "2", label: "Figma" },
    { id: "3", label: "App idea / MVP" },
    { id: "4", label: "Project help" },
  ]);

  const [recentItems] = React.useState([
    { id: "1", text: "Why is my Python script running so slow?" },
    { id: "2", text: "How to fix memory leak in React components?" },
    { id: "3", text: "CSS flexbox center align items" },
    { id: "4", text: "Best practices for SQL database design?" },
    { id: "5", text: "JavaScript async await error handling" },
    { id: "6", text: "Best practices for SQL database design?" },
    { id: "7", text: "JavaScript async await error handling" },
  ]);

  const removeTag = (tagId) => {
    setSearchTags(searchTags.filter((tag) => tag.id !== tagId));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="search-overlay" onClick={onClose} />
      <div className="search-popup">
        <div className="search-header">
          <h3>Searching For</h3>
        </div>
        <div className="search-tags">
          {searchTags.map((tag) => (
            <div key={tag.id} className="search-tag">
              <span>{tag.label}</span>
              <button onClick={() => removeTag(tag.id)} className="tag-remove">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="recent-section">
          <h4>Recent</h4>
          <div className="recent-list">
            {recentItems.map((item) => (
              <div key={item.id} className="recent-item">
                <Clock className="recent-icon" />
                <span className="recent-text">{item.text}</span>
                <button className="recent-remove">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
