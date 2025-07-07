import { FiLock, FiUnlock } from 'react-icons/fi';
import { UserListSidebarProps } from '../../../interfaces/admin/user/user-sidebar.types';

const UserListSidebar = ({
  selectedUser,
  setSelectedUser,
  handleToggleBlock,
  actionLoading,
}: UserListSidebarProps) => {
  if (!selectedUser) return null;

  return (
    <div className="fixed bottom-6 right-6 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
          {selectedUser.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{selectedUser.name}</div>
          <div className="text-xs text-gray-600">{selectedUser.email}</div>
        </div>
      </div>
      <button
        onClick={() => handleToggleBlock(selectedUser.userId, selectedUser.isBlocked ? 'unblock' : 'block')}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all ${selectedUser.isBlocked ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={actionLoading}
      >
        {selectedUser.isBlocked ? (
          <>
            <FiUnlock className="w-5 h-5" />
            Unblock User
          </>
        ) : (
          <>
            <FiLock className="w-5 h-5" />
            Block User
          </>
        )}
      </button>
      <button
        onClick={() => setSelectedUser(null)}
        className="w-full mt-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        Close
      </button>
    </div>
  );
};

export default UserListSidebar;