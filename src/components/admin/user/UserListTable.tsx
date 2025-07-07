import { FiUser, FiUnlock, FiLock } from 'react-icons/fi';
import { UserListTableProps } from '../../../interfaces/admin/user/user-table.types';

const UserListTable = ({
    users,
    loading,
    error,
    filterActive,
    searchTerm,
    handleRowClick,
    handleToggleBlock,
    actionLoading,
}: UserListTableProps) => {
    const filteredUsers = users.filter(
        (user) =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm)) &&
            (!filterActive || !user.isBlocked)
    );

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-orange-50 to-gray-50">
                    <tr>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">User</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                            Contact
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                            Last Active
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                                <div className="flex justify-center items-center flex-col">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                                    Loading users...
                                </div>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5} className="px-8 py-10 text-center text-red-500">{error}</td>
                        </tr>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => handleRowClick(user)}
                                className="cursor-pointer hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
                            >
                                <td className="px-8 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center font-bold text-white text-xl shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-600 md:hidden">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-gray-700 font-medium">{user.email}</div>
                                    <div className="text-sm text-gray-600">{user.phone}</div>
                                </td>
                                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                                    {user.lastActive}
                                </td>
                                <td className="px-8 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-sm ${user.isBlocked
                                                ? 'bg-red-100 text-red-800 border border-red-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}
                                    >
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-8 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleBlock(user.userId, user.isBlocked ? 'unblock' : 'block');
                                            }}
                                            className={`p-2 rounded-full shadow-sm transform hover:scale-110 transition-all ${user.isBlocked
                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title={user.isBlocked ? 'Unblock' : 'Block'}
                                            disabled={actionLoading}
                                        >
                                            {user.isBlocked ? <FiUnlock className="w-5 h-5" /> : <FiLock className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                    <FiUser className="w-12 h-12 text-gray-300 mb-3 animate-bounce" />
                                    <p className="text-lg">No users found. Try adjusting your search or filters.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserListTable;