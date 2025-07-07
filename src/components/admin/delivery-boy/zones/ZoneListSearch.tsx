import { FiSearch } from 'react-icons/fi';
import { ZoneListSearchProps } from '../../../../interfaces/admin/delivery-boys/zone.types';

const ZoneListSearch = ({ searchTerm, setSearchTerm }: ZoneListSearchProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search zones by name..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ZoneListSearch;