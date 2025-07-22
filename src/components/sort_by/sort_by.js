import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './sort_by.css';

const SortBy = ({ options = [], onSortChange, currentSort = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentSort || null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
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

  // Funkcja do obliczania pozycji dropdown
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 192;
    
    setDropdownPosition({
      top: buttonRect.bottom + 8,
      left: buttonRect.right - dropdownWidth,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      calculateDropdownPosition();
      
      const handleScroll = () => calculateDropdownPosition();
      const handleResize = () => calculateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  useEffect(() => {
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

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  // Komponent dropdown renderowany przez portal
  const DropdownPortal = () => {
    if (!isOpen) return null;

    return createPortal(
      <>
        <div 
          className="overlay" 
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 9998 }}
        />
        <div 
          ref={dropdownRef}
          className="sort-by-dropdown"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 9999,
            width: '192px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px 0',
            animation: 'fadeIn 0.22s ease-out'
          }}
        >
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
      </>,
      document.body
    );
  };

  return (
    <div className="sort-by-container">
      <button 
        ref={buttonRef}
        className="sort-by-button" 
        onClick={handleButtonClick}
      >
        {selected ? `Sort by: ${selected.label}` : 'Sort by'}
        <svg className="sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>
      <DropdownPortal />
    </div>
  );
};

export default SortBy;