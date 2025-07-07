import { FiSearch, FiFilter } from 'react-icons/fi';
import { UserListSearchAndFilterProps } from '../../../interfaces/admin/user/user-filter.types';

const UserListSearchAndFilter = ({
    searchTerm,
    setSearchTerm,
    filterActive,
    setFilterActive,
}: UserListSearchAndFilterProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap justify-end gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setFilterActive(!filterActive)}
                        className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-sm transform hover:scale-105 transition-all ${filterActive
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                            }`}
                    >
                        <FiFilter className="w-4 h-4" />
                        <span>Active Only</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserListSearchAndFilter;