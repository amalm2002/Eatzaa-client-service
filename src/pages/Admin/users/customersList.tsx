import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useSocket } from '../../../context/SocketContext';
import UserListHeader from '../../../components/admin/user/UserListHeader';
import UserListSearchAndFilter from '../../../components/admin/user/UserListSearchAndFilter';
import UserListTable from '../../../components/admin/user/UserListTable';
import UserListConfirmPopup from '../../../components/admin/user/UserListConfirmPopup';
import UserListSidebar from '../../../components/admin/user/UserListSidebar';
import UserListPagination from '../../../components/admin/user/UserListPagination';
import { User } from '../../../interfaces/admin/user/user.types';
import { adminApi } from '../../../api/endpoints/adminApi';

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
  const { socket, isConnected } = useSocket();

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.fetchUsers(dispatch);
      const formattedUsers = data.users.map((user: any, index: number) => ({
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
        user.userId === pendingAction.userId
          ? { ...user, isBlocked: pendingAction.action === 'block' }
          : user
      )
    );

    try {
      const response = await adminApi.toggleBlockUser(dispatch, pendingAction.userId);
      toast.success(`User ${pendingAction.action === 'block' ? 'blocked' : 'unblocked'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      if (!response.success && isConnected && socket) {
        socket.emit('block-user', { userId: response.userId });
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
      <UserListHeader />
      <main className="flex-1 pt-20 sm:pt-24 max-w-[90rem] mx-auto p-4 sm:p-6 space-y-6">
        <UserListSearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
        />
        <UserListTable
          users={users}
          loading={loading}
          error={error}
          filterActive={filterActive}
          searchTerm={searchTerm}
          handleRowClick={handleRowClick}
          handleToggleBlock={handleToggleBlock}
          actionLoading={actionLoading}
        />
        {filteredUsers.length > 0 && <UserListPagination users={users} filteredUsers={filteredUsers} />}
        <UserListConfirmPopup
          showConfirmPopup={showConfirmPopup}
          pendingAction={pendingAction}
          actionLoading={actionLoading}
          setShowConfirmPopup={setShowConfirmPopup}
          confirmToggleBlock={confirmToggleBlock}
        />
        <UserListSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleToggleBlock={handleToggleBlock}
          actionLoading={actionLoading}
        />
      </main>
    </div>
  );
};

export default UserList;