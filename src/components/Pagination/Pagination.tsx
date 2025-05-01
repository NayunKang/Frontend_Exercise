import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null; 
  }

  return (
    <div className="pagination-container" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="pagination-button"
      >
        ◀ Prev
      </button>
      <span className="pagination-info">
        Page {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
        className="pagination-button"
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination; 