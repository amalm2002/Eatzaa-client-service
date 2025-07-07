import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FilterBarProps } from '../../../interfaces/restaurant/menu/filter-bar.types';

const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or description..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700 bg-gray-50 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent bg-gray-50 text-gray-700 appearance-none transition-all duration-300"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="veg">🥬 Veg</option>
            <option value="non-veg">🍗 Non-Veg</option>
            <option value="drinks">🥤 Drinks</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-3 bg-gradient-to-r from-[#6589f6] to-[#5578e5] text-white font-medium rounded-lg shadow-md transition-all duration-300"
        >
          Export Menu
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FilterBar;