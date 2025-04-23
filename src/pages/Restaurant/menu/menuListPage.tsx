// import React, { useState, useEffect } from 'react';
// import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../navbar/sidebar';
// import Header from '../navbar/header';
// import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
// import createAxios from '../../../service/axiousServices/restaurantAxious';
// import Swal from 'sweetalert2';

// interface Variant {
//     name: string;
//     price: number;
// }

// interface MenuItem {
//     _id: string;
//     name: string;
//     description: string;
//     category: string;
//     price: number;
//     quantity: number;
//     images: string[];
//     hasVariants: boolean;
//     variants: Variant[];
//     timing: string;
//     restaurantId: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
// }

// const MenuList: React.FC = () => {
//     const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [activeMenu, setActiveMenu] = useState('Menu Items');
//     const { isOnline, handleToggleOnline } = useRestaurantStatus();
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [categoryFilter, setCategoryFilter] = useState<string>('all');
//     const [sortField, setSortField] = useState<string>('name');
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//     const [itemsPerPage, setItemsPerPage] = useState<number>(5);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [loading, setLoading] = useState<boolean>(true);

//     const axiosInstance = createAxios();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const response = await axiosInstance.get('/all-menus');
//                 console.log('response from all menus', response);
//                 setMenuItems(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching menu items:', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: 'Failed to fetch menu items.',
//                     confirmButtonColor: '#6589f6',
//                 });
//                 setLoading(false);
//             }
//         };
//         fetchMenuItems();
//     }, []);

//     const handleSort = (field: string) => {
//         if (field === sortField) {
//             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortField(field);
//             setSortDirection('asc');
//         }
//     };

//     const handleEdit = (id: string) => {
//         navigate(`/restaurant-edit-menu/${id}`);
//     };

//     const handleDelete = async (id: string) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'This action cannot be undone.',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#6589f6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Delete',
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                   const res=  await axiosInstance.patch(`/menu/${id}`);
//                     console.log('soft delete res :',res);
                    
//                     // setMenuItems(menuItems.filter((item) => item._id !== id));
//                     Swal.fire({
//                         icon: 'success',
//                         title: 'Deleted',
//                         text: 'Menu item deleted successfully.',
//                         confirmButtonColor: '#6589f6',
//                     });
//                 } catch (error) {
//                     console.error('Error deleting menu item:', error);
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error',
//                         text: 'Failed to delete menu item.',
//                         confirmButtonColor: '#6589f6',
//                     });
//                 }
//             }
//         });
//     };

//     const filteredItems = menuItems
//         .filter(
//             (item) =>
//                 (categoryFilter === 'all' || item.category === categoryFilter) &&
//                 (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
//         )
//         .sort((a:any, b:any) => {
//             if (sortField === 'price' || sortField === 'quantity') {
//                 return sortDirection === 'asc'
//                     ? a[sortField] - b[sortField]
//                     : b[sortField] - a[sortField];
//             } else {
//                 const aValue = String(a[sortField]).toLowerCase();
//                 const bValue = String(b[sortField]).toLowerCase();
//                 return sortDirection === 'asc'
//                     ? aValue.localeCompare(bValue)
//                     : bValue.localeCompare(aValue);
//             }
//         });

//     const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//     const paginatedItems = filteredItems.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gray-100">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6589f6] mx-auto"></div>
//                     <p className="mt-4 text-gray-700 font-medium">Loading menu...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="flex-1 flex flex-col w-full">
//                 <Header
//                     isOnline={isOnline}
//                     handleToggleOnline={handleToggleOnline}
//                     setIsMobileMenuOpen={setIsMobileMenuOpen}
//                 />
//                 <Sidebar
//                     activeMenu={activeMenu}
//                     setActiveMenu={setActiveMenu}
//                     isMobileMenuOpen={isMobileMenuOpen}
//                     setIsMobileMenuOpen={setIsMobileMenuOpen}
//                     isOnline={isOnline}
//                 />

//                 <main className="flex-1 p-6 mt-4 max-w-[90rem] mx-auto">
//                     {/* Filters Section */}
//                     <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="relative">
//                                 <FiSearch
//                                     className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={20}
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Search by name or description..."
//                                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                             <div className="relative">
//                                 <FiFilter
//                                     className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={20}
//                                 />
//                                 <select
//                                     className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent appearance-none text-gray-700"
//                                     value={categoryFilter}
//                                     onChange={(e) => setCategoryFilter(e.target.value)}
//                                 >
//                                     <option value="all">All Categories</option>
//                                     <option value="veg">Veg</option>
//                                     <option value="non-veg">Non-Veg</option>
//                                     <option value="drinks">Drinks</option>
//                                 </select>
//                                 <FiChevronDown
//                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={20}
//                                 />
//                             </div>
//                             <div className="flex gap-3">
//                                 <button className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all">
//                                     Export Menu
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Menu Items Table */}
//                     <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
//                         {/* Desktop View */}
//                         <div className="hidden md:block">
//                             <table className="w-full">
//                                 <thead className="bg-[#6589f6] text-white">
//                                     <tr>
//                                         {[
//                                             { field: 'name', label: 'Item' },
//                                             { field: 'category', label: 'Category' },
//                                             { field: 'price', label: 'Price' },
//                                             { field: 'quantity', label: 'Quantity' },
//                                             { field: 'timing', label: 'Timing' },
//                                         ].map((header) => (
//                                             <th
//                                                 key={header.field}
//                                                 className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#5570d1] transition-colors"
//                                                 onClick={() => handleSort(header.field)}
//                                             >
//                                                 <div className="flex items-center gap-2">
//                                                     <span>{header.label}</span>
//                                                     {sortField === header.field &&
//                                                         (sortDirection === 'asc' ? (
//                                                             <FiChevronUp size={16} />
//                                                         ) : (
//                                                             <FiChevronDown size={16} />
//                                                         ))}
//                                                 </div>
//                                             </th>
//                                         ))}
//                                         <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {paginatedItems.map((item) => (
//                                         <tr
//                                             key={item._id}
//                                             className="hover:bg-gray-50 transition-all duration-200"
//                                         >
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
//                                                         {item.images[0] ? (
//                                                             <img
//                                                                 src={item.images[0]}
//                                                                 alt=""
//                                                                 className="h-full w-full object-cover"
//                                                             />
//                                                         ) : (
//                                                             <span className="text-[#6589f6] text-lg font-bold">
//                                                                 {item.name.charAt(0)}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     <div>
//                                                         <div className="font-semibold text-gray-900">{item.name}</div>
//                                                         {/* <div className="text-sm text-gray-600 line-clamp-1">
//                                                             {item.description}
//                                                         </div> */}
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span
//                                                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                                                         item.category === 'veg'
//                                                             ? 'bg-green-100 text-green-800'
//                                                             : item.category === 'non-veg'
//                                                             ? 'bg-red-100 text-red-800'
//                                                             : 'bg-blue-100 text-blue-800'
//                                                     }`}
//                                                 >
//                                                     {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-700">
//                                                 <div>
//                                                     <div className="font-medium">
//                                                         Original: ${item.price.toFixed(2)}
//                                                     </div>
//                                                     {item.hasVariants && item.variants.length > 0 && (
//                                                         <table className="mt-2 w-full border-t border-gray-200">
//                                                             <thead>
//                                                                 <tr className="bg-gray-100">
//                                                                     <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
//                                                                         Variant
//                                                                     </th>
//                                                                     <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
//                                                                         Price
//                                                                     </th>
//                                                                 </tr>
//                                                             </thead>
//                                                             <tbody>
//                                                                 {item.variants.map((variant: Variant, index: number) => (
//                                                                     <tr key={index} className="border-t border-gray-100">
//                                                                         <td className="px-2 py-1 text-sm">
//                                                                             {variant.name}
//                                                                         </td>
//                                                                         <td className="px-2 py-1 text-sm">
//                                                                             ${variant.price.toFixed(2)}
//                                                                         </td>
//                                                                     </tr>
//                                                                 ))}
//                                                             </tbody>
//                                                         </table>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
//                                             <td className="px-6 py-4 text-gray-700">
//                                                 {item.timing || 'Anytime'}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex justify-end gap-3">
//                                                     <button
//                                                         onClick={() => handleEdit(item._id)}
//                                                         className="p-2 text-blue-600 hover:bg-blue-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
//                                                         title="Edit"
//                                                     >
//                                                         <FiEdit size={20} />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(item._id)}
//                                                         className="p-2 text-red-600 hover:bg-red-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
//                                                         title="Delete"
//                                                     >
//                                                         <FiTrash2 size={20} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Mobile View */}
//                         <div className="md:hidden divide-y divide-gray-200">
//                             {paginatedItems.map((item) => (
//                                 <div
//                                     key={item._id}
//                                     className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] transition-all"
//                                 >
//                                     <div className="flex items-center justify-between mb-4">
//                                         <div className="flex items-center gap-4">
//                                             <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
//                                                 {item.images[0] ? (
//                                                     <img
//                                                         src={item.images[0]}
//                                                         alt=""
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <span className="text-[#6589f6] text-lg font-bold">
//                                                         {item.name.charAt(0)}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <div className="font-semibold text-gray-900 text-lg">
//                                                     {item.name}
//                                                 </div>
//                                                 {/* <div className="text-xs text-gray-600 line-clamp-1">
//                                                     {item.description}
//                                                 </div> */}
//                                             </div>
//                                         </div>
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                                 item.category === 'veg'
//                                                     ? 'bg-green-100 text-green-800'
//                                                     : item.category === 'non-veg'
//                                                     ? 'bg-red-100 text-red-800'
//                                                     : 'bg-blue-100 text-blue-800'
//                                             }`}
//                                         >
//                                             {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
//                                         </span>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
//                                         <div>
//                                             <div className="text-gray-500 text-xs font-medium">Price</div>
//                                             <div className="font-medium">
//                                                 Original: ${item.price.toFixed(2)}
//                                             </div>
//                                             {item.hasVariants && item.variants.length > 0 && (
//                                                 <table className="mt-2 w-full border-t border-gray-200">
//                                                     <thead>
//                                                         <tr className="bg-gray-100">
//                                                             <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
//                                                                 Variant
//                                                             </th>
//                                                             <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
//                                                                 Price
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {item.variants.map((variant: Variant, index: number) => (
//                                                             <tr
//                                                                 key={index}
//                                                                 className="border-t border-gray-100"
//                                                             >
//                                                                 <td className="px-2 py-1 text-sm">
//                                                                     {variant.name}
//                                                                 </td>
//                                                                 <td className="px-2 py-1 text-sm">
//                                                                     ${variant.price.toFixed(2)}
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             )}
//                                         </div>
//                                         <div>
//                                             <div className="text-gray-500 text-xs font-medium">Quantity</div>
//                                             <div className="font-medium">{item.quantity}</div>
//                                         </div>
//                                         <div className="col-span-2">
//                                             <div className="text-gray-500 text-xs font-medium">Timing</div>
//                                             <div className="font-medium">{item.timing || 'Anytime'}</div>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={() => handleEdit(item._id)}
//                                             className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(item._id)}
//                                             className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Pagination */}
//                         <div className="p-4 border-t border-gray-200 bg-gray-50">
//                             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                                 <select
//                                     className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700 shadow-sm"
//                                     value={itemsPerPage}
//                                     onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                                 >
//                                     <option value={5}>5 per page</option>
//                                     <option value={10}>10 per page</option>
//                                     <option value={20}>20 per page</option>
//                                 </select>
//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         disabled={currentPage === 1}
//                                         onClick={() => setCurrentPage((prev) => prev - 1)}
//                                         className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
//                                     >
//                                         Previous
//                                     </button>
//                                     <span className="text-sm text-gray-700 font-medium">
//                                         Page {currentPage} of {totalPages}
//                                     </span>
//                                     <button
//                                         disabled={currentPage === totalPages}
//                                         onClick={() => setCurrentPage((prev) => prev + 1)}
//                                         className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default MenuList;


import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiEdit, FiUnlock, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../navbar/sidebar';
import Header from '../navbar/header';
import useRestaurantStatus from '../../../hooks/useRestaurantStatus';
import createAxios from '../../../service/axiousServices/restaurantAxious';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';

interface Variant {
  name: string;
  price: number;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  images: string[];
  hasVariants: boolean;
  variants: Variant[];
  timing: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean; 
}

const MySwal = withReactContent(Swal);

const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Menu Items');
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch=useDispatch()
  const navigate = useNavigate();
  const axiosInstance = createAxios(dispatch);
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axiosInstance.get(`/all-menus/${restaurantId}`);
        console.log('response from all menus', response);
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Failed to fetch menu items.',
          confirmButtonColor: '#6589f6',
          background: '#fefefe',
          buttonsStyling: true,
          customClass: {
            confirmButton: 'swal-confirm-button',
            title: 'swal-title',
            htmlContainer: 'swal-text',
          },
        });
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/restaurant-edit-menu/${id}`);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const action = isActive ? 'block' : 'unblock';
    MySwal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this menu item?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6589f6',
      cancelButtonColor: '#d33',
      confirmButtonText: isActive ? 'Block' : 'Unblock',
      background: '#fefefe',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
        title: 'swal-title',
        htmlContainer: 'swal-text',
      },
    }).then(async (result:any) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.patch(`/menu/${id}`);
          console.log(`${action} response:`, response);
          setMenuItems((prevItems) =>
            prevItems.map((item) =>
              item._id === id ? { ...item, isActive: !isActive } : item
            )
          );
          MySwal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Menu item ${action}ed successfully.`,
            confirmButtonColor: '#6589f6',
            background: '#fefefe',
            customClass: {
              confirmButton: 'swal-confirm-button',
              title: 'swal-title',
              htmlContainer: 'swal-text',
            },
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error(`Error ${action}ing menu item:`, error);
          MySwal.fire({
            icon: 'error',
            title: 'Oops!',
            text: `Failed to ${action} menu item.`,
            confirmButtonColor: '#6589f6',
            background: '#fefefe',
            customClass: {
              confirmButton: 'swal-confirm-button',
              title: 'swal-title',
              htmlContainer: 'swal-text',
            },
          });
        }
      }
    });
  };

  const filteredItems = menuItems
    .filter(
      (item) =>
        (categoryFilter === 'all' || item.category === categoryFilter) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a: any, b: any) => {
      if (sortField === 'price' || sortField === 'quantity') {
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

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6589f6] mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <style>
        {`
          .swal-confirm-button {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .swal-confirm-button:hover {
            filter: brightness(90%);
          }
          .swal-cancel-button {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .swal-cancel-button:hover {
            filter: brightness(90%);
          }
          .swal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a202c;
          }
          .swal-text {
            font-size: 1rem;
            color: #4a5568;
          }
        `}
      </style>
      <div className="flex-1 flex flex-col w-full">
        <Header
          isOnline={isOnline}
          handleToggleOnline={handleToggleOnline}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isOnline={isOnline}
        />

        <main className="flex-1 p-6 mt-4 max-w-[90rem] mx-auto">
          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <FiFilter
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent appearance-none text-gray-700"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="drinks">Drinks</option>
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all">
                  Export Menu
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-[#6589f6] text-white">
                  <tr>
                    {[
                      { field: 'name', label: 'Item' },
                      { field: 'category', label: 'Category' },
                      { field: 'price', label: 'Price' },
                      { field: 'quantity', label: 'Quantity' },
                      { field: 'timing', label: 'Timing' },
                      { field: 'isActive', label: 'Active' }, // Added Active column
                    ].map((header) => (
                      <th
                        key={header.field}
                        className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#5570d1] transition-colors"
                        onClick={() => handleSort(header.field)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{header.label}</span>
                          {sortField === header.field &&
                            (sortDirection === 'asc' ? (
                              <FiChevronUp size={16} />
                            ) : (
                              <FiChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedItems.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                            {item.images[0] ? (
                              <img
                                src={item.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[#6589f6] text-lg font-bold">
                                {item.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.category === 'veg'
                              ? 'bg-green-100 text-green-800'
                              : item.category === 'non-veg'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div>
                          <div className="font-medium">
                            Original: ${item.price.toFixed(2)}
                          </div>
                          {item.hasVariants && item.variants.length > 0 && (
                            <table className="mt-2 w-full border-t border-gray-200">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                                    Variant
                                  </th>
                                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.variants.map((variant: Variant, index: number) => (
                                  <tr key={index} className="border-t border-gray-100">
                                    <td className="px-2 py-1 text-sm">{variant.name}</td>
                                    <td className="px-2 py-1 text-sm">
                                      ${variant.price.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {item.timing || 'Anytime'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                            title="Edit"
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleToggleActive(item._id, item.isActive)}
                            className={`p-2 ${
                              item.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                            } rounded-full shadow-sm transform hover:scale-110 transition-all`}
                            title={item.isActive ? 'Block' : 'Unblock'}
                          >
                            {item.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedItems.map((item) => (
                <div
                  key={item._id}
                  className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                        {item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[#6589f6] text-lg font-bold">
                            {item.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.category === 'veg'
                          ? 'bg-green-100 text-green-800'
                          : item.category === 'non-veg'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                    <div>
                      <div className="text-gray-500 text-xs font-medium">Price</div>
                      <div className="font-medium">
                        Original: ${item.price.toFixed(2)}
                      </div>
                      {item.hasVariants && item.variants.length > 0 && (
                        <table className="mt-2 w-full border-t border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                                Variant
                              </th>
                              <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.variants.map((variant: Variant, index: number) => (
                              <tr key={index} className="border-t border-gray-100">
                                <td className="px-2 py-1 text-sm">{variant.name}</td>
                                <td className="px-2 py-1 text-sm">
                                  ${variant.price.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-medium">Quantity</div>
                      <div className="font-medium">{item.quantity}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-medium">Status</div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-medium">Timing</div>
                      <div className="font-medium">{item.timing || 'Anytime'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(item._id, item.isActive)}
                      className={`flex-1 py-2 ${
                        item.isActive
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white rounded-lg shadow-md transform hover:scale-105 transition-all`}
                    >
                      {item.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <select
                  className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6589f6] focus:border-transparent text-gray-700 shadow-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuList;