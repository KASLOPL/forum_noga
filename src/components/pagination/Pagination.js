import React from 'react';
import { usePaginatedPostsContext } from '../../hooks/paginated_posts_context';
import './Pagination.css';

const Pagination = () => {
  const {
    currentPage,
    totalPages,
    loading,
    goToPage,
    goToNextPage,
    goToPrevPage
  } = usePaginatedPostsContext();

  if (totalPages <= 1) return null;

  // Pokaż max 7 numerów stron dla lepszego UX
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Jeśli mało stron, pokaż wszystkie
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logika dla dużej liczby stron
      if (currentPage <= 4) {
        // Na początku
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Na końcu
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // W środku
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (pageNum) => {
    if (loading || pageNum === currentPage) return;
    goToPage(pageNum);
  };

  const handlePrevClick = () => {
    if (loading || currentPage === 1) return;
    goToPrevPage();
  };

  const handleNextClick = () => {
    if (loading || currentPage === totalPages) return;
    goToNextPage();
  };

  return (
    <nav className="pagination-bar" role="navigation" aria-label="Pagination">
      <button
        className={`pagination-btn ${loading ? 'loading' : ''}`}
        onClick={handlePrevClick}
        disabled={currentPage === 1 || loading}
        aria-label="Previous page"
        type="button"
      >
        &lt;
      </button>
      
      {getPageNumbers().map((num, idx) =>
        num === '...' ? (
          <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={num}
            className={`pagination-btn ${currentPage === num ? 'active' : ''} ${loading ? 'loading' : ''}`}
            onClick={() => handlePageClick(num)}
            disabled={loading}
            aria-current={currentPage === num ? 'page' : undefined}
            aria-label={`Go to page ${num}`}
            type="button"
          >
            {num}
          </button>
        )
      )}
      
      <button
        className={`pagination-btn ${loading ? 'loading' : ''}`}
        onClick={handleNextClick}
        disabled={currentPage === totalPages || loading}
        aria-label="Next page"
        type="button"
      >
        &gt;
      </button>
      
    
    </nav>
  );
};

export default Pagination;