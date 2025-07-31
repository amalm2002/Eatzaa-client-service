import { FiSearch, FiFilter, FiDownload, FiChevronDown, FiCalendar } from 'react-icons/fi';

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: 'all' | 'pending' | 'paid' | 'overdue';
  setStatusFilter: (value: 'all' | 'pending' | 'paid' | 'overdue') => void;
  dateFilter: 'all' | '7days' | '30days' | '90days';
  setDateFilter: (value: 'all' | '7days' | '30days' | '90days') => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <select
            className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none text-gray-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid' | 'overdue')}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
        </div>
        <div className="relative">
          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          <select
            className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none text-gray-900"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'all' | '7days' | '30days' | '90days')}
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
        </div>
      </div>
      <div className="mt-4 flex gap-3 justify-end">
        <button className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2">
          <FiDownload size={18} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default FiltersSection;