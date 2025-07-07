import { UserListPaginationProps } from "../../../interfaces/admin/user/user-pagination.types";

const UserListPagination = ({ users, filteredUsers }: UserListPaginationProps) => {
  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-orange-50 to-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-700 font-medium">
          Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold">{users.length}</span> users
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md transform hover:scale-105 transition-all">
            Previous
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md transform hover:scale-105 transition-all">
            1
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md transform hover:scale-105 transition-all">
            2
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md transform hover:scale-105 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserListPagination;