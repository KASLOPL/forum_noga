import React from 'react';
import { usePaginatedPostsContext } from '../../hooks/paginated_posts_context';
import './Pagination.css';

const Pagination = () => {
  const {
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPrevPage
  } = usePaginatedPostsContext();

  if (totalPages <= 1) return null;

  // Pokaż max 5 numerów stron, z elipsą jeśli dużo
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className="pagination-bar">
      <button
        className="pagination-btn"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>
      {getPageNumbers().map((num, idx) =>
        num === '...'
          ? <span key={idx} className="pagination-ellipsis">...</span>
          : <button
              key={num}
              className={`pagination-btn${currentPage === num ? ' active' : ''}`}
              onClick={() => goToPage(num)}
              aria-current={currentPage === num ? 'page' : undefined}
            >
              {num}
            </button>
      )}
      <button
        className="pagination-btn"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination; 