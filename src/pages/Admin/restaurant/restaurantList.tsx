// import React, { useEffect, useState } from 'react';
// import { Header } from '../header/header';
// import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { createAxios } from '../../../service/axiousServices/adminAxious';
// import { useDispatch } from 'react-redux';

// interface Restaurant {
//   id: number | string; 
//   name: string;
//   owner: string;
//   mobile: string;
//   location: string;
//   status: 'active' | 'inactive';
//   rating: number;
//   totalOrders: number;
//   image?: string;
// }

// const RestaurantListPage: React.FC = () => {
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]); 
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [sortField, setSortField] = useState<keyof Restaurant>('name');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(true); 

//   const dispatch = useDispatch();
//   const axiosInstance = createAxios(dispatch);

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         setLoading(true); 
//         const response = await axiosInstance.get('/getAllRestaurants');
//         console.log('Response from the restaurants list data', response);
//         if (response.data.message === 'success') {
       
//           const mappedRestaurants: Restaurant[] = response.data.response.map((item: any) => ({
//             id: item._id,
//             name: item.restaurantName,
//             owner: item.owner || 'Unknown', 
//             mobile: item.mobile || 'N/A', 
//             location: item.location.coordinates ? `${item.location.coordinates[0]}, ${item.location.coordinates[1]}` : 'N/A', 
//             status: item.status || 'active', 
//             rating: item.rating || 0,
//             totalOrders: item.totalOrders || 0, 
//             image: item.image || undefined, 
//           }));
//           console.log('iddddddddddddd',mappedRestaurants);
          
//           setRestaurants(mappedRestaurants);
//         } else {
//           alert('Failed to load restaurants');
//         }
//       } catch (error: any) {
//         alert('Internal error');
//         console.log('Error on restaurant list page side', error);
//       } finally {
//         setLoading(false); 
//       }
//     };
//     fetchRestaurants();
//   }, []);

//   const handleSort = (field: keyof Restaurant) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const filteredRestaurants = restaurants
//     .filter((restaurant) =>
//       (statusFilter === 'all' || restaurant.status === statusFilter) &&
//       (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//     .sort((a, b) => {
//       if (sortField === 'rating' || sortField === 'totalOrders') {
//         return sortDirection === 'asc'
//           ? a[sortField] - b[sortField]
//           : b[sortField] - a[sortField];
//       } else {
//         const aValue = String(a[sortField]).toLowerCase();
//         const bValue = String(b[sortField]).toLowerCase();
//         return sortDirection === 'asc'
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }
//     });

//   const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
//   const paginatedRestaurants = filteredRestaurants.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (loading) {
//     return <div>Loading restaurants...</div>; 
//   }

//   return (
//     <div className="flex-1 flex flex-col w-full">
//       <Header />
//       <main className="flex-1 p-6 mt-16">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-semibold text-gray-800">Restaurants</h1>
//             <p className="text-sm text-gray-600 mt-1">Manage your restaurant network efficiently</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by name, owner, or location..."
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="relative">
//               <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <select
//                 className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Inactive Only</option>
//               </select>
//               <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             </div>
//             <div className="flex gap-2">
//               <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 Export CSV
//               </button>
//               <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                 Print List
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="hidden md:block">
//             <table className="w-full">
//               <thead className="bg-gray-50 align-middle border-b border-gray-200">
//                 <tr>
//                   {[
//                     { field: 'name', label: 'Restaurant' },
//                     { field: 'owner', label: 'Owner' },
//                     { field: 'mobile', label: 'Contact' },
//                     { field: 'location', label: 'Location' },
//                     { field: 'status', label: 'Status' },
//                   ].map((header) => (
//                     <th
//                       key={header.field}
//                       className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-teal-600"
//                       onClick={() => handleSort(header.field as keyof Restaurant)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span>{header.label}</span>
//                         {sortField === header.field && (
//                           sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                   <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {paginatedRestaurants.map((restaurant) => (
//                   <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-12 w-12 rounded-lg overflow-hidden bg-teal-100 flex items-center justify-center">
//                           {restaurant.image ? (
//                             <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
//                           ) : (
//                             <span className="text-teal-700 text-lg font-medium">{restaurant.name.charAt(0)}</span>
//                           )}
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900">{restaurant.name}</div>
//                           <div className="text-sm text-gray-500">★ {restaurant.rating} • {restaurant.totalOrders.toLocaleString()} Orders</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-700">{restaurant.owner}</td>
//                     <td className="px-6 py-4 text-gray-700">{restaurant.mobile}</td>
//                     <td className="px-6 py-4 text-gray-700">{restaurant.location}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           restaurant.status === 'active' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-end gap-2">
//                         <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
//                          <a href="/restaurant-details"><FiEye size={20} /></a> 
//                         </button>
//                         <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <FiEdit size={20} />
//                         </button>
//                         <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                           <FiTrash2 size={20} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="md:hidden divide-y divide-gray-200">
//             {paginatedRestaurants.map((restaurant) => (
//               <div key={restaurant.id} className="p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg overflow-hidden bg-teal-100 flex items-center justify-center">
//                       {restaurant.image ? (
//                         <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
//                       ) : (
//                         <span className="text-teal-700 text-lg font-medium">{restaurant.name.charAt(0)}</span>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">{restaurant.name}</div>
//                       <div className="text-xs text-gray-500">★ {restaurant.rating}</div>
//                     </div>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       restaurant.status === 'active' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
//                   <div>
//                     <div className="text-gray-500 text-xs">Owner</div>
//                     {restaurant.owner}
//                   </div>
//                   <div>
//                     <div className="text-gray-500 text-xs">Contact</div>
//                     {restaurant.mobile}
//                   </div>
//                   <div className="col-span-2">
//                     <div className="text-gray-500 text-xs">Location</div>
//                     {restaurant.location}
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
//                     View
//                   </button>
//                   <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                     <FiEdit size={16} />
//                   </button>
//                   <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
//                     <FiTrash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="p-4 border-t border-gray-200">
//             <div className="flex items-center justify-between gap-4">
//               <select
//                 className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value={5}>5 per page</option>
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//               </select>
//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => prev - 1)}
//                   className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
//                 >
//                   Previous
//                 </button>
//                 <span className="text-sm text-gray-700">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                   className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RestaurantListPage;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../header/header';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  mobile: string;
  location: string;
  status: 'active' | 'inactive';
  rating: number;
  totalOrders: number;
  image?: string;
}

const RestaurantListPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Restaurant>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/getAllRestaurants');
        if (response.data.message === 'success') {
          const mappedRestaurants: Restaurant[] = response.data.response.map((item: any) => ({
            id: item._id,
            name: item.restaurantName,
            owner: item.owner || 'Unknown',
            mobile: item.mobile || 'N/A',
            location: item.location.coordinates ? `${item.location.coordinates[0]}, ${item.location.coordinates[1]}` : 'N/A',
            status: item.status || 'active',
            rating: item.rating || 0,
            totalOrders: item.totalOrders || 0,
            image: item.image || undefined,
          }));
          setRestaurants(mappedRestaurants);
        } else {
          alert('Failed to load restaurants');
        }
      } catch (error: any) {
        alert('Internal error');
        console.log('Error on restaurant list page side', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleView = (id:string) => {
    navigate(`/admin/restaurants/${id}`);
  };

  const handleSort = (field: keyof Restaurant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRestaurants = restaurants

    .filter((restaurant) =>
      (statusFilter === 'all' || restaurant.status === statusFilter) &&
      (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'rating' || sortField === 'totalOrders') {
        return sortDirection === 'asc'
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else {
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <Header />
      <main className="flex-1 p-6 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Restaurants</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your restaurant network efficiently</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, owner, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Export CSV
              </button>
              <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Print List
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50 align-middle border-b border-gray-200">
                <tr>
                  {[
                    { field: 'name', label: 'Restaurant' },
                    { field: 'owner', label: 'Owner' },
                    { field: 'mobile', label: 'Contact' },
                    { field: 'location', label: 'Location' },
                    { field: 'status', label: 'Status' },
                  ].map((header) => (
                    <th
                      key={header.field}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-teal-600"
                      onClick={() => handleSort(header.field as keyof Restaurant)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{header.label}</span>
                        {sortField === header.field && (
                          sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-teal-100 flex items-center justify-center">
                          {restaurant.image ? (
                            <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-teal-700 text-lg font-medium">{restaurant.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{restaurant.name}</div>
                          <div className="text-sm text-gray-500">
                            ★ {restaurant.rating} • {restaurant.totalOrders.toLocaleString()} Orders
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{restaurant.owner}</td>
                    <td className="px-6 py-4 text-gray-700">{restaurant.mobile}</td>
                    <td className="px-6 py-4 text-gray-700">{restaurant.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          restaurant.status === 'active' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(restaurant.id)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <FiEye size={20} />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FiEdit size={20} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-200">
            {paginatedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-teal-100 flex items-center justify-center">
                      {restaurant.image ? (
                        <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-teal-700 text-lg font-medium">{restaurant.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-xs text-gray-500">★ {restaurant.rating}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.status === 'active' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                  <div>
                    <div className="text-gray-500 text-xs">Owner</div>
                    {restaurant.owner}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Contact</div>
                    {restaurant.mobile}
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500 text-xs">Location</div>
                    {restaurant.location}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(restaurant.id)}
                    className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    View
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FiEdit size={16} />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RestaurantListPage;