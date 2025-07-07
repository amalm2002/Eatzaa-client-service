import React from 'react';
import { PaginationProps } from '../../interfaces/restaurant/order/pagination.types';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="mt-8 flex items-center justify-center gap-3 max-w-7xl mx-auto">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
            >
                Previous
            </button>
            <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl transition-all duration-300 text-sm font-medium ${currentPage === pageNum
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-900 hover:shadow-sm'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>
            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;