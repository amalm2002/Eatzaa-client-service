import { PaginationProps } from "../../../interfaces/user/profile/order-history.types";

const Pagination = ({ currentPage, totalPages, handlePageChange, handlePrevPage, handleNextPage, tealColor }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-teal-100 text-white hover:bg-teal-700'
        }`}
        style={{ backgroundColor: currentPage === 1 ? '' : tealColor }}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            currentPage === index + 1 ? 'bg-teal-700 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-teal-50'
          }`}
          style={{ backgroundColor: currentPage === index + 1 ? tealColor : '' }}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-teal-100 text-white hover:bg-teal-700'
        }`}
        style={{ backgroundColor: currentPage === totalPages ? '' : tealColor }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;