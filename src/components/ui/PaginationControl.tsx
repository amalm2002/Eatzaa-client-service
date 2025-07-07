import { motion } from 'framer-motion';
import { PaginationControlsProps } from '../../interfaces/restaurant/menu/pagination-controls.types';

const PaginationControls: React.FC<PaginationControlsProps> = ({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 border-t border-gray-200 bg-gray-50"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <select
          className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700 bg-gray-50 shadow-sm transition-all duration-300"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transition-all duration-300"
          >
            Previous
          </motion.button>
          <span className="text-sm text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transition-all duration-300"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaginationControls;