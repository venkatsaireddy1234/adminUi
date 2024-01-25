import React, { useState } from "react";

const Pagination = ({ total, page, onPageChange }) => {
  const [pageInput, setPageInput] = useState(page);
  const pageSize = 10;

  const pageCount = Math.ceil(total / pageSize);

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPageInput(newPage);
    onPageChange(newPage);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <button
          key={i}
          className={`mx-1 px-4 py-2 border rounded-full ${
            i === page
              ? "border-blue-500 text-blue-500"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className="mx-1 px-4 py-2  border rounded-full"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        {"<<"}
      </button>
      {renderPageButtons()}
      <button
        className="mx-1 px-4 py-2  border rounded-full"
        disabled={page === pageCount}
        onClick={() => handlePageChange(page + 1)}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
