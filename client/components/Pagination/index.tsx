import React, { useState } from "react";

interface PaginationProps {
  totalPages: number;
  onPageChange?: (page: number) => void;
  currentPage: number;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  currentPage = 1,
  siblingCount = 1,
}) => {
  const [inputPages, setInputPages] = useState("");

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) onPageChange(page);
  };

  const handleJumpToPage = () => {
    const page = Number(inputPages);
    if (!isNaN(page)) {
      handlePageChange(page);
      setInputPages("");
    }
  };

  const getPageNumber = () => {
    const page: (number | "...")[] = [];

    const left = Math.max(2, currentPage - siblingCount);
    const right = Math.min(totalPages - 1, currentPage + siblingCount);

    page.push(1);
    if (left > 2) page.push("...");
    for (let i = left; i <= right; i++) page.push(i);

    if (right < totalPages - 1) page.push("...");

    if (totalPages > 1) page.push(totalPages);

    return page;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded text-sm disabled:opacity-50"
      >
        Trước
      </button>

      <span className="sm:hidden text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      <div className="hidden sm:flex items-center gap-2">
        {getPageNumber().map((item, idx) =>
          item === "..." ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageChange(item)}
              className={`px-3 py-2 border rounded text-sm ${
                item === currentPage
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded text-sm disabled:opacity-50"
      >
        Sau
      </button>
      <div className="items-center gap-1 ml-3">
        <span className="text-sm text-gray-600">Tới trang </span>
        <input
          type="number"
          className="w-16 px-2 py-1 border rounded text-sm"
          min={1}
          max={totalPages}
          value={inputPages}
          onChange={(e) => setInputPages(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
        />
      </div>
    </div>
  );
};

export default Pagination;
