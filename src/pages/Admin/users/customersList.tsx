// import React, { useState, useEffect } from 'react';
// import { FiSearch, FiMoreVertical, FiLock, FiUnlock, FiUser, FiFilter } from 'react-icons/fi';
// import { createAxios } from '../../../service/axiousServices/adminAxious';
// import { useDispatch } from 'react-redux';



// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   userId: string;
//   isBlocked: boolean;
//   lastActive: string;
// }

// const UserList: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const dispatch = useDispatch();
//   const axiosInstance = createAxios(dispatch);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axiosInstance.get('/getAllUsers');

//         const formattedUsers = response.data.users.map((user: any, index: number) => ({
//           userId: user.id,
//           id: index + 1,
//           name: user.name,
//           email: user.email,
//           phone: user.phone || 'N/A',
//           isBlocked: !user.isActive,
//           lastActive: user.lastActive || 'N/A',
//         }));

//         // console.log('formattedUsers', formattedUsers);

//         setUsers(formattedUsers);
//       } catch (err: any) {
//         console.error('Error fetching users:', err.response?.data || err.message);
//         setError('Failed to load users. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   console.log('this is show on the user State Data :', users);


//   const toggleBlockStatus = async (userId: string) => {
//     console.log(userId);
//     try {
//       const response = await axiosInstance.patch(`/block-user/${userId}`)

//       if (response.data.success) {
//         setUsers(prevUsers => prevUsers.map(user =>
//           user.userId === userId ? { ...user, isBlocked: !user.isBlocked } : user
//         ));
//       }

//       setFilterActive(response.data.success)

//     } catch (error) {
//       console.error('Error blocking/unblocking user:', (error as Error).message);
//     }
//   };


//   const filteredUsers = users.filter(user =>
//     (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone.includes(searchTerm)) &&
//     (!filterActive || !user.isBlocked)
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-teal-500 text-white p-6 shadow-md">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold">User Management</h1>
//           <p className="text-teal-100 mt-1">View and manage your platform users</p>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
//         {/* Search and Filters */}
//         <div className="bg-white rounded-xl shadow p-4 sm:p-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="relative w-full md:w-96">
//               <input
//                 type="text"
//                 placeholder="Search users by name, email or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
//               />
//               <FiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//             <div className="flex flex-wrap justify-end gap-3 w-full md:w-auto">
//               <button
//                 onClick={() => setFilterActive(!filterActive)}
//                 className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors ${filterActive ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-gray-100 border border-gray-200'}`}
//               >
//                 <FiFilter className="w-4 h-4" />
//                 <span>Active Only</span>
//               </button>

//             </div>
//           </div>
//         </div>

//         {/* User Table */}
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Active</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading users...</td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center text-red-500">{error}</td>
//                   </tr>
//                 ) : filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 flex items-center justify-center font-bold">
//                             {user.name.charAt(0)}
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-sm font-medium text-gray-800">{user.name}</div>
//                             <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
//                         <div className="text-sm text-gray-700">{user.email}</div>
//                         <div className="text-sm text-gray-500">{user.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">{user.lastActive}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
//                           {user.isBlocked ? 'Blocked' : 'Active'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             onClick={() => toggleBlockStatus(user.userId)}
//                             className={`p-2 rounded-full ${user.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'} transition-colors`}
//                             title={user.isBlocked ? 'Unblock' : 'Block'}
//                           >
//                             {user.isBlocked ? <FiUnlock className="w-5 h-5" /> : <FiLock className="w-5 h-5" />}
//                           </button>
//                           <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
//                             <FiMoreVertical className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
//                       <div className="flex flex-col items-center">
//                         <FiUser className="w-10 h-10 text-gray-300 mb-2" />
//                         <p>No users found. Try adjusting your search or filters.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {filteredUsers.length > 0 && (
//             <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50">
//               <p className="text-sm text-gray-600 mb-3 sm:mb-0">
//                 Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
//               </p>
//               <div className="flex items-center space-x-1">
//                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">Previous</button>
//                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">1</button>
//                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">2</button>
//                 <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">Next</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserList;

import React, { useState, useEffect } from 'react';
import { FiSearch, FiLock, FiUnlock, FiUser, FiFilter } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { Header } from '../header/header';

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

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
    fetchUsers();
  }, []);

  const toggleBlockStatus = async (userId: string) => {
    try {
      const response = await axiosInstance.patch(`/block-user/${userId}`);
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
        setFilterActive(response.data.success);
        setSelectedUser(null); // Close sidebar after action
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', (error as Error).message);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(selectedUser?.id === user.id ? null : user); // Toggle sidebar
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
                            toggleBlockStatus(user.userId);
                          }}
                          className={`p-2 rounded-full shadow-sm transform hover:scale-110 transition-all ${
                            user.isBlocked
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
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
                onClick={() => toggleBlockStatus(selectedUser.userId)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all ${
                  selectedUser.isBlocked
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
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