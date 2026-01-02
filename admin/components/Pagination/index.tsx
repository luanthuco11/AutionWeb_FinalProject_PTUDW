import React from "react";

interface PaginationProps {
  totalPages: number;
  onPageChange?: (page: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  currentPage = 1,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) onPageChange(page);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={` cursor-pointer px-3 py-1 rounded border ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`cursor-pointer px-3 py-1 rounded border ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`cursor-pointer px-3 py-1 rounded border ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
