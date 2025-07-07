import { PaginationControlsProps } from "../../../interfaces/user/foodList/pagination-controls.types";

const PaginationControls = ({ currentPage, totalPages, paginate }: PaginationControlsProps) => {
  return (
    totalPages > 1 && (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200"
        >
          Previous
        </button>
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-[rgb(60,110,113)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    )
  );
};

export default PaginationControls;