import { useState, useMemo } from 'react';

/**
 * Custom hook for managing pagination.
 *
 * @param {Array} data - The complete list of items to paginate.
 * @param {number} initialPage - The initial page number (default is 1).
 * @param {number} pageSize - Number of items per page (default is 5).
 * @returns {Object} Pagination state and handlers.
 */
const usePagination:any = (data:any, initialPage = 1, pageSize = 6) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data?.length / pageSize) || 1;
  }, [data, pageSize]);

  // Ensure currentPage is within valid bounds when data changes
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data?.slice(startIndex, startIndex + pageSize) || [];
  }, [data, currentPage, pageSize]);

  // Handlers to navigate between pages
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (pageNumber:any) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    currentData,
    handlePreviousPage,
    handleNextPage,
    goToPage,
    setCurrentPage
  };
};

export default usePagination;
