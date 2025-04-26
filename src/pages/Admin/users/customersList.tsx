import React, { useState, useEffect } from 'react';
import { FiSearch, FiLock, FiUnlock, FiUser, FiFilter, FiX } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { Header } from '../header/header';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  userId: string;
  isBlocked: boolean;
  lastActive: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ userId: string; action: 'block' | 'unblock' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/getAllUsers');
      const formattedUsers = response.data.users.map((user: any, index: number) => ({
        userId: user.id,
        id: index + 1,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        isBlocked: !user.isActive,
        lastActive: user.lastActive || 'N/A',
      }));
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err.response?.data || err.message);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = (userId: string, action: 'block' | 'unblock') => {
    setPendingAction({ userId, action });
    setShowConfirmPopup(true);
  };

  const confirmToggleBlock = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    const previousUsers = [...users];
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === pendingAction.userId ? { ...user, isBlocked: pendingAction.action === 'block' } : user
      )
    );

    try {
      const response = await axiosInstance.patch(`/block-user/${pendingAction.userId}`);
      if (response.data.success) {
        toast.success(`User ${pendingAction.action === 'block' ? 'blocked' : 'unblocked'} successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        });
      
        await fetchUsers();
      } else {
        throw new Error('API response indicated failure');
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', (error as Error).message);
     
      setUsers(previousUsers);
      toast.error(`Failed to ${pendingAction.action} user. Please try again.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setActionLoading(false);
      setShowConfirmPopup(false);
      setPendingAction(null);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)) &&
      (!filterActive || !user.isBlocked)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-20 sm:pt-24 max-w-[90rem] mx-auto p-4 sm:p-6 space-y-6">
        {/* Search and Filters */}
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
                className={`px-4 py-2 flex items-center gap-2 rounded-lg shadow-sm transform hover:scale-105 transition-all ${
                  filterActive
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

        {/* User Table */}
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
                        className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-sm ${
                          user.isBlocked
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
                          className={`p-2 rounded-full shadow-sm transform hover:scale-110 transition-all ${
                            user.isBlocked
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

          {/* SweetAlert-like Confirmation Popup */}
          {showConfirmPopup && pendingAction && (
            <div
              className="fixed inset-0 bg-white/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="confirmPopupTitle"
              aria-modal="true"
            >
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-popup">
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                  aria-label="Close popup"
                  disabled={actionLoading}
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-4 rounded-full mb-4 animate-bounce ${
                      pendingAction.action === 'block' ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  >
                    {pendingAction.action === 'block' ? (
                      <FiLock className="w-8 h-8 text-red-600" />
                    ) : (
                      <FiUnlock className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <h2 id="confirmPopupTitle" className="text-2xl font-bold text-gray-800 mb-3">
                    {pendingAction.action === 'block' ? 'Block User?' : 'Unblock User?'}
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm">
                    {pendingAction.action === 'block'
                      ? 'This user will be blocked and lose access to the platform.'
                      : 'This user will be unblocked and regain access to the platform.'}
                  </p>
                  <div className="flex justify-center gap-4 w-full">
                    <button
                      onClick={() => setShowConfirmPopup(false)}
                      className={`px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all transform hover:scale-105 font-medium ${
                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmToggleBlock}
                      className={`px-6 py-2 rounded-full text-white transition-all transform hover:scale-105 font-medium shadow-md ${
                        pendingAction.action === 'block'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
                      ) : pendingAction.action === 'block' ? (
                        'Block'
                      ) : (
                        'Unblock'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          {selectedUser && (
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
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all ${
                  selectedUser.isBlocked
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
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
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;