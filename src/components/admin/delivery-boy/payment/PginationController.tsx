interface PaginationControlsProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    setItemsPerPage: (value: number) => void;
    setCurrentPage: (value: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    itemsPerPage,
    totalItems,
    setItemsPerPage,
    setCurrentPage,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">of {totalItems} delivery boys</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentPage === pageNum
                                            ? 'bg-gray-800 text-white'
                                            : 'border border-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaginationControls;