import React, { useState, useRef, useEffect } from 'react';
import './sort_by.css';

const SortBy = ({ options = [], onSortChange, currentSort = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentSort || null);
  const dropdownRef = useRef(null);

  const defaultOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'newest', label: 'Newest first' },
    { value: 'upvoted', label: 'Most upvoted' },
    { value: 'answered', label: 'Most answered' },
    { value: 'viewed', label: 'Most Viewed' },
    { value: 'solved', label: 'Solved First' }
  ];

  const sortOptions = options.length > 0 ? options : defaultOptions;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Keep selected in sync with currentSort from parent
    setSelected(currentSort);
  }, [currentSort]);

  const handleOptionClick = (option) => {
    if (selected && selected.value === option.value) {
      setSelected(null);
      if (onSortChange) onSortChange(null);
    } else {
      setSelected(option);
      if (onSortChange) onSortChange(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="sort-by-container" ref={dropdownRef}>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      <button className="sort-by-button" onClick={() => setIsOpen(!isOpen)}>
        {selected ? `Sort by: ${selected.label}` : 'Sort by'}
        <svg className="sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>
      {isOpen && (
        <div className="sort-by-dropdown">
          {sortOptions.map((option, index) => (
            <button
              key={option.value || index}
              onClick={() => handleOptionClick(option)}
              className="sort-by-option"
            >
              <div className={`dot ${selected?.value === option.value ? 'active' : ''}`}></div>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortBy;