import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import filtersImg from '../../images/filters.png';
import './filters.css';

const Filters = ({ onFiltersChange, currentFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: currentFilters.category || [],
    tags: currentFilters.tags || [],
    questionType: currentFilters.questionType || []
  });

  // Sync selectedFilters with currentFilters when currentFilters changes (e.g. after Apply or Clear)
  useEffect(() => {
    setSelectedFilters({
      category: currentFilters.category || [],
      tags: currentFilters.tags || [],
      questionType: currentFilters.questionType || []
    });
  }, [currentFilters]);

  const modalRef = useRef(null);

  const categories = [
    'Algorithms & Data Structures',
    'Web Development',
    'Networking',
    'IT',
    'School / Assignments',
    'Design & UX',
    'Business / Startups',
    'Hardware',
    'General / Other'
  ];

  const tags = [
    'Python',
    'Java',
    'SQL',
    'html',
    'css',
    'javascript',
    'react',
    'node.js',
    'flask',
    'arduino',
    'linux',
    'database',
    'networking',
    'school_project',
    'teamwork',
    'presentation',
    'figma',
    'ux/ui',
    'pitch_deck'
  ];

  const questionTypes = [
    'Error / Bug',
    'How-to / Tutorial',
    'Project help',
    'Code review',
    'App idea / MVP',
    'Schoolwork / Assignment',
    'Business / Career advice'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleFilterToggle = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(selectedFilters);
    }
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: [],
      tags: [],
      questionType: []
    });
    if (onFiltersChange) {
      onFiltersChange({ category: [], tags: [], questionType: [] });
    }
  };

  // Use currentFilters for button highlight: active if any filter is selected
  const anyFilterSelected = (
    (currentFilters.tags && currentFilters.tags.length > 0) ||
    (currentFilters.category && currentFilters.category.length > 0) ||
    (currentFilters.questionType && currentFilters.questionType.length > 0)
  );

  // Portal rendering for modal and overlay
  const filterPortal = isOpen ? ReactDOM.createPortal(
    <>
      <div className="filter-overlay" onClick={() => setIsOpen(false)} />
      <div className="filter-modal" ref={modalRef}>
        <div className="filter-header">
          <button className="close-button" onClick={() => setIsOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <h3>Category</h3>
            <div className="filter-options">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterToggle('category', category)}
                  className={`filter-option ${selectedFilters.category.includes(category) ? 'selected' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Tags</h3>
            <div className="filter-options">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleFilterToggle('tags', tag)}
                  className={`filter-option ${selectedFilters.tags.includes(tag) ? 'selected' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Question type</h3>
            <div className="filter-options">
              {questionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleFilterToggle('questionType', type)}
                  className={`filter-option ${selectedFilters.questionType.includes(type) ? 'selected' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-button" onClick={clearFilters}>
            Clear all
          </button>
          <button className="apply-button" onClick={handleApplyFilters}>
            Apply filters
          </button>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      <button
        className={`circle-filters-btn${anyFilterSelected ? ' active' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Filters"
      >
        <img src={filtersImg} alt="Filters" className="circle-filters-icon" />
      </button>
      {filterPortal}
    </>
  );
};

export default Filters;