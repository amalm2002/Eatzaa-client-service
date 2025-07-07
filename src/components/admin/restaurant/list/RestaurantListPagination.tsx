import { RestaurantListPaginationProps } from '../../../../interfaces/admin/restaurants/restaurant.types';

const RestaurantListPagination = ({
    filteredRestaurants,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
}: RestaurantListPaginationProps) => {
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

    return (
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-orange-50 to-gray-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <select
                    className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 shadow-sm"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
                <div className="flex items-center gap-3">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantListPagination;