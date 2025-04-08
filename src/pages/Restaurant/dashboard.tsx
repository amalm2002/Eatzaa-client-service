// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from "recharts";
// import {
//   LayoutGrid,
//   BarChart2,
//   ShoppingCart,
//   MessageSquare,
//   Settings,
//   Bell,
//   User,
//   LogOut,
//   Power,
//   TrendingUp,
//   Menu,
//   X
// } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { restaurantLogout } from '../../service/redux/slices/restaurantSlice';
// import createAxios from '../../service/axiousServices/restaurantAxious';
// import Swal from 'sweetalert2';

// // Sample data for charts
// const revenueData = [
//   { name: "Mon", value: 2400 },
//   { name: "Tue", value: 1398 },
//   { name: "Wed", value: 9800 },
//   { name: "Thu", value: 3908 },
//   { name: "Fri", value: 4800 },
//   { name: "Sat", value: 3800 },
//   { name: "Sun", value: 4300 },
// ];

// const ordersByCategory = [
//   { name: "Main Course", value: 540 },
//   { name: "Appetizers", value: 320 },
//   { name: "Desserts", value: 210 },
//   { name: "Beverages", value: 180 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const DaintyFoodDashboard = () => {
//   const [activeMenu, setActiveMenu] = useState('Dashboard');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isOnline, setIsOnline] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   const menuItems = [
//     { icon: <LayoutGrid size={20} />, label: 'Dashboard' },
//     { icon: <BarChart2 size={20} />, label: 'Analytics' },
//     { icon: <ShoppingCart size={20} />, label: 'Order' },
//     { icon: <User size={20} />, label: 'Customer' },
//     { icon: <MessageSquare size={20} />, label: 'Message' },
//     { icon: <Settings size={20} />, label: 'Settings' },
//   ];

//   const statsCards = [
//     { label: 'Available Dish', value: 150, icon: '🍽️', growth: '+2.5%', color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' },
//     { label: 'Total Order', value: 11000, icon: '📦', growth: '+7.8%', color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' },
//     { label: 'Total Sales', value: 27000, icon: '💰', growth: '+15.2%', color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600' },
//     { label: 'Total Profit', value: 35000, icon: '📈', growth: '+4.3%', color: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600' }
//   ];

//   const recentOrders = [
//     { name: 'Chicken Salad', date: '06 Aug 2024', price: 12.50, status: 'Completed' },
//     { name: 'Caesar Noodles', date: '06 Aug 2024', price: 13.75, status: 'Completed' },
//     { name: 'Stir Noodles', date: '06 Aug 2024', price: 14.20, status: 'Pending' }
//   ];

//   const axiousInstance = createAxios();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const restaurant_id = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);

//   useEffect(() => {
//     const token = localStorage.getItem('restaurantToken');
//     if (token) {
//       Swal.fire({
//         title: 'Welcome Back!',
//         text: 'Please turn on your online status to start receiving orders.',
//         icon: 'info',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#3085d6',
//       });
//       setIsOnline(false); 
//     }
//   }, []);

//   const handleLogout = () => {
//     if (isOnline) {
//       Swal.fire({
//         title: 'Turn Off Online Status',
//         text: 'Please turn off your online status before logging out.',
//         icon: 'warning',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#f39c12',
//       });
//     } else {
//       Swal.fire({
//         title: 'Logging Out',
//         text: 'You have been logged out successfully.',
//         icon: 'success',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#28a745',
//       }).then(() => {
//         dispatch(restaurantLogout());
//         localStorage.removeItem('restaurantToken');
//         localStorage.removeItem('restaurantRefreshToken');
//         navigate('/restaurant-login');
//       });
//     }
//   };

//   const handleToggleOnline = async () => {
//     const token = localStorage.getItem('restaurantToken');
//     try {
//       const response = await axiousInstance.patch('/update-online-status', {
//         restaurant_id,
//         isOnline: !isOnline
//       });

//       console.log('getting the response', response);

//       if (response.data.message === 'Online status updated successfully') {
//         setIsOnline(!isOnline);
//         Swal.fire({
//           title: `Status Updated`,
//           text: `Your restaurant is now ${!isOnline ? 'Online' : 'Offline'}.`,
//           icon: 'success',
//           confirmButtonText: 'OK',
//           confirmButtonColor: '#28a745',
//         });
//       } else {
//         Swal.fire({
//           title: 'Error',
//           text: 'Failed to update online status: ' + (response.data.error || response.data.message),
//           icon: 'error',
//           confirmButtonText: 'OK',
//           confirmButtonColor: '#d33',
//         });
//       }
//     } catch (error) {
//       console.error('Error updating online status:', (error as Error).message);
//       Swal.fire({
//         title: 'Error',
//         text: 'An error occurred while updating online status.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#d33',
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-200/30">
//       {/* Sidebar */}
//       <div className={`
//         ${isMobileMenuOpen ? 'block' : 'hidden'} 
//         md:block 
//         fixed 
//         top-0 
//         left-0 
//         w-64 
//         h-screen 
//         bg-gradient-to-b from-white to-gray-50 
//         border-r 
//         border-gray-200 
//         p-6 
//         z-50 
//         transform 
//         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0 
//         transition-transform 
//         duration-300 
//         ease-in-out
//         shadow-xl
//       `}>
//         <div className="flex items-center mb-10">
//           <img src="/api/placeholder/50/50" alt="Dainty Food Logo" className="w-12 h-12 mr-3 rounded-full shadow-sm" />
//           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//             Dainty Food
//           </h1>
//         </div>

//         <nav>
//           {menuItems.map((item, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 setActiveMenu(item.label);
//                 setIsMobileMenuOpen(false);
//               }}
//               className={`
//                 flex items-center w-full p-3 mb-2 rounded-lg transition-all duration-300
//                 ${activeMenu === item.label ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}
//               `}
//             >
//               <span className="mr-3">{item.icon}</span>
//               {item.label}
//             </button>
//           ))}
//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full p-3 mt-4 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-300"
//           >
//             <LogOut size={20} className="mr-3" />
//             Logout
//           </button>
//         </nav>
//       </div>

//       {/* Main Content Container */}
//       <div className="ml-0 md:ml-64">
//         {/* Hero Section with Glassmorphism */}
//         <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/90 via-blue-400/80 to-purple-500/90 py-16">
//           <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
//           <div className="absolute h-40 w-[200%] bg-white/10 bottom-0 left-0 backdrop-blur-sm"></div>

//           <div className="container px-4 max-w-6xl mx-auto relative">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-white space-y-4"
//             >
//               <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
//                 Dainty Food <span className="bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">Dashboard</span>
//               </h1>
//               <p className="text-white/80 text-lg max-w-2xl">
//                 Welcome back, Chef! Here's your real-time restaurant performance overview.
//               </p>

//               <div className="flex flex-wrap gap-3 pt-2">
//                 <Link to="/add-menu" className="flex items-center gap-2 shadow-lg bg-white text-blue-600 hover:bg-white/90 transition-all duration-300 rounded-lg px-4 py-2 font-medium">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M11 12H3M11 18H3M21 6H3M17 21l-2-2m2 2l2-2M17 15V3"/>
//                   </svg>
//                   Add Menu Item
//                 </Link>
//                 <Link to="/documents" className="flex items-center gap-2 shadow-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/10 transition-all duration-300 rounded-lg px-4 py-2 font-medium text-white">
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
//                     <polyline points="14 2 14 8 20 8"/>
//                     <path d="M12 12v6"/>
//                     <path d="M9 15h6"/>
//                   </svg>
//                   Upload Documents
//                 </Link>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         <div className="container px-4 py-10 max-w-6xl mx-auto -mt-10">
//           {/* Mobile Header */}
//           <div className="md:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl mb-6">
//             <div className="flex items-center">
//               <img src="/api/placeholder/50/50" alt="Dainty Food Logo" className="w-10 h-10 mr-3 rounded-full shadow-sm" />
//               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
//                 Dainty Food
//               </h1>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-blue-500">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>

//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
//             <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4 md:mb-0">
//               My Dashboard
//             </h2>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
//                 <span className="text-sm font-medium text-gray-600">
//                   {isOnline ? 'Online' : 'Offline'}
//                 </span>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={isOnline}
//                     onChange={handleToggleOnline}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300"></div>
//                   <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-6 shadow-sm flex items-center justify-center">
//                     <Power size={12} className={`text-gray-500 ${isOnline ? 'text-blue-500' : ''}`} />
//                   </div>
//                 </label>
//               </div>
//               <button className="text-gray-600 hover:text-blue-500 transition-colors relative">
//                 <Bell size={20} />
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
//               </button>
//               <div className="flex items-center">
//                 <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full mr-2 border-2 border-blue-500 shadow-sm" />
//                 <div className="hidden md:block">
//                   <p className="font-semibold text-gray-800">Mr. Jo</p>
//                   <p className="text-sm text-gray-500">mrjo@gmail.com</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//             {statsCards.map((card, index) => (
//               <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
//                 <div className={`overflow-hidden shadow-xl backdrop-blur-sm ${card.color} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-2xl`}>
//                   <div className="p-6">
//                     <div className="flex justify-between items-center mb-4">
//                       <span className="text-2xl">{card.icon}</span>
//                       <span className="text-sm font-semibold bg-white/50 px-2 py-1 rounded-full">{card.growth}</span>
//                     </div>
//                     <h3 className="text-gray-600 text-sm mb-2">{card.label}</h3>
//                     <p className="text-xl font-bold">{card.value}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
//               <div className="overflow-hidden shadow-xl backdrop-blur-sm bg-white/80 h-full transition-all duration-300 hover:shadow-2xl rounded-2xl">
//                 <div className="pb-2 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-100/50 px-6 py-4">
//                   <h3 className="text-xl font-bold flex items-center gap-2">
//                     <TrendingUp size={20} />
//                     Total Revenue
//                   </h3>
//                 </div>
//                 <div className="pt-6 px-6">
//                   <div className="h-80">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
//                         <XAxis dataKey="name" axisLine={false} tickLine={false} />
//                         <YAxis axisLine={false} tickLine={false} />
//                         <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} cursor={{ fill: "hsla(var(--muted) / 0.2)" }} formatter={(value) => [`$${value}`, "Revenue"]} />
//                         <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} barSize={42} />
//                         <defs>
//                           <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
//                             <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
//                           </linearGradient>
//                         </defs>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
//               <div className="overflow-hidden shadow-xl backdrop-blur-sm bg-white/80 h-full transition-all duration-300 hover:shadow-2xl rounded-2xl">
//                 <div className="pb-2 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-100/50 px-6 py-4">
//                   <h3 className="text-xl font-bold flex items-center gap-2">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <circle cx="11" cy="11" r="8" />
//                       <path d="m21 21-4.3-4.3" />
//                       <path d="M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0" />
//                     </svg>
//                     Order Categories
//                   </h3>
//                 </div>
//                 <div className="pt-6 px-6">
//                   <div className="h-[300px] flex items-center justify-center">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie data={ordersByCategory} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
//                           {ordersByCategory.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" wrapperStyle={{ bottom: 0 }} />
//                         <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} formatter={(value) => [`${value} orders`, ""]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Restaurant Details */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-10">
//             <div className="overflow-hidden shadow-xl backdrop-blur-sm bg-white/80 transition-all duration-300 hover:shadow-2xl rounded-2xl">
//               <div className="pb-2 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-100/50 px-6 py-4">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M15 11h.01" />
//                     <path d="M11 15h.01" />
//                     <path d="M16 16h.01" />
//                     <path d="M2 16l20 6-6-20A20 20 0 0 0 2 16z" />
//                     <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
//                   </svg>
//                   Restaurant Profile
//                 </h3>
//               </div>
//               <div>
//                 <div className="w-full flex justify-start border-b bg-transparent">
//                   <button onClick={() => setActiveTab('overview')} className={`rounded-none py-4 px-6 text-sm font-medium text-gray-600 transition-all duration-300 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
//                     Overview
//                   </button>
//                   <button onClick={() => setActiveTab('hours')} className={`rounded-none py-4 px-6 text-sm font-medium text-gray-600 transition-all duration-300 ${activeTab === 'hours' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
//                     Business Hours
//                   </button>
//                   <button onClick={() => setActiveTab('locations')} className={`rounded-none py-4 px-6 text-sm font-medium text-gray-600 transition-all duration-300 ${activeTab === 'locations' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
//                     Locations
//                   </button>
//                 </div>

//                 {activeTab === 'overview' && (
//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <div>
//                         <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//                             <circle cx="12" cy="7" r="4" />
//                           </svg>
//                           General Information
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/50 border border-blue-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Restaurant Name</div>
//                             <div className="mt-1 font-medium">Dainty Food</div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-purple-100/50 border border-purple-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Cuisine Type</div>
//                             <div className="mt-1 font-medium">Contemporary Fusion</div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-green-100/50 border border-green-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Phone Number</div>
//                             <div className="mt-1 font-medium">+91 98765 43210</div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-amber-100/50 border border-amber-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Email Address</div>
//                             <div className="mt-1 font-medium">contact@daintyfood.com</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                             <circle cx="9" cy="7" r="4" />
//                             <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                           </svg>
//                           Account Details
//                         </h3>
//                         <div className="space-y-4">
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 border border-indigo-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Registration Date</div>
//                             <div className="mt-1 font-medium">June 15, 2023</div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-emerald-100/50 border border-emerald-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Subscription Plan</div>
//                             <div className="mt-1 flex items-center">
//                               <span className="mr-2 font-medium">Premium</span>
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
//                             </div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/50 to-sky-100/50 border border-sky-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Menu Items</div>
//                             <div className="mt-1 font-medium">48 items</div>
//                           </div>
//                           <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50/50 to-teal-100/50 border border-teal-100/50 shadow-sm transition-all duration-300 hover:shadow-md">
//                             <div className="text-sm font-medium text-gray-500">Verification Status</div>
//                             <div className="mt-1 flex items-center">
//                               <span className="mr-2 font-medium">Verified</span>
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
//                                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                                 <polyline points="22 4 12 14.01 9 11.01" />
//                               </svg>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === 'hours' && (
//                   <div className="p-6">
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
//                           <div key={day} className={`flex justify-between p-4 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${day === "Sunday" ? "bg-gradient-to-br from-red-50/50 to-red-100/50 border-red-100/50" : "bg-gradient-to-br from-slate-50/50 to-slate-100/50 border-slate-100/50"}`}>
//                             <span className="font-medium flex items-center gap-2">
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="10" />
//                                 <polyline points="12 6 12 12 16 14" />
//                               </svg>
//                               {day}
//                             </span>
//                             <span className={day === "Sunday" ? "text-red-500 font-medium" : "font-medium"}>
//                               {day === "Sunday" ? "Closed" : "10:00 AM - 10:00 PM"}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === 'locations' && (
//                   <div className="p-6">
//                     <div className="space-y-6">
//                       <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-100/50 border border-blue-100/50 shadow-md transition-all duration-300 hover:shadow-lg">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-medium flex items-center gap-2 text-lg">
//                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//                                 <circle cx="12" cy="10" r="3" />
//                               </svg>
//                               Flagship Location
//                             </h4>
//                             <p className="text-gray-500 mt-2">123 Gourmet Street, Culinary District</p>
//                             <p className="text-gray-500">Mumbai, Maharashtra 400001</p>
//                           </div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Main</span>
//                         </div>
//                       </div>
//                       <div className="flex justify-center">
//                         <button className="flex items-center gap-2 rounded-full px-6 py-2 border border-gray-200 hover:bg-blue-500/5 transition-all duration-300 text-gray-800">
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="12" cy="12" r="10" />
//                             <line x1="12" y1="8" x2="12" y2="16" />
//                             <line x1="8" y1="12" x2="16" y2="12" />
//                           </svg>
//                           Add New Location
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>

//           {/* Recent Orders */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
//             <div className="overflow-hidden shadow-xl backdrop-blur-sm bg-white/80 transition-all duration-300 hover:shadow-2xl rounded-2xl">
//               <div className="pb-2 bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-100/50 px-6 py-4">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//                     <line x1="3" y1="6" x2="21" y2="6" />
//                     <path d="M16 10a4 4 0 0 1-8 0" />
//                   </svg>
//                   Recent Orders
//                 </h3>
//               </div>
//               <div className="pt-6 px-6">
//                 {recentOrders.map((order, index) => (
//                   <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-200 hover:bg-gray-100 transition-all duration-300 rounded-lg px-2">
//                     <div>
//                       <p className="font-semibold text-sm md:text-base text-gray-800">{order.name}</p>
//                       <p className="text-gray-600 text-xs md:text-sm">{order.date}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-sm md:text-base text-blue-500">${order.price.toFixed(2)}</p>
//                       <p className={`text-xs md:text-sm ${order.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
//                         {order.status}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default DaintyFoodDashboard;


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  LayoutGrid,
  BarChart2,
  ShoppingCart,
  MessageSquare,
  Settings,
  Bell,
  User,
  LogOut,
  Power,
  TrendingUp,
  Menu,
  X,
  Clock,
  MapPin,
  FileText,
  Utensils,
  Users,
  CreditCard,
  ChefHat
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { restaurantLogout } from '../../service/redux/slices/restaurantSlice';
import createAxios from '../../service/axiousServices/restaurantAxious';
import Swal from 'sweetalert2';

// Chart data
const revenueData = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

const ordersByCategory = [
  { name: "Main Course", value: 540 },
  { name: "Appetizers", value: 320 },
  { name: "Desserts", value: 210 },
  { name: "Beverages", value: 180 },
];

const COLORS = ["#6589f6", "#93b1ff", "#c2d3ff", "#dbe7ff"];

const DaintyFoodDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard' },
    { icon: <BarChart2 size={20} />, label: 'Analytics' },
    { icon: <ShoppingCart size={20} />, label: 'Orders' },
    { icon: <Utensils size={20} />, label: 'Menu Items' },
    { icon: <Users size={20} />, label: 'Customers' },
    { icon: <MessageSquare size={20} />, label: 'Messages' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  const statsCards = [
    { label: 'Available Dishes', value: 150, icon: <ChefHat size={24} className="text-[#6589f6]" />, growth: '+2.5%' },
    { label: 'Total Orders', value: 11000, icon: <ShoppingCart size={24} className="text-[#6589f6]" />, growth: '+7.8%' },
    { label: 'Total Sales', value: 27000, icon: <CreditCard size={24} className="text-[#6589f6]" />, growth: '+15.2%' },
    { label: 'Total Profit', value: 35000, icon: <TrendingUp size={24} className="text-[#6589f6]" />, growth: '+4.3%' }
  ];

  const recentOrders = [
    { name: 'Chicken Salad', date: '06 Aug 2024', price: 12.50, status: 'Completed' },
    { name: 'Caesar Noodles', date: '06 Aug 2024', price: 13.75, status: 'Completed' },
    { name: 'Stir Noodles', date: '06 Aug 2024', price: 14.20, status: 'Pending' },
    { name: 'Salmon Fillet', date: '05 Aug 2024', price: 18.90, status: 'Completed' },
    { name: 'Mushroom Risotto', date: '05 Aug 2024', price: 15.75, status: 'Pending' }
  ];

  const axiousInstance = createAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurant_id = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);

  useEffect(() => {
    const token = localStorage.getItem('restaurantToken');
    if (token) {
      Swal.fire({
        title: 'Welcome Back!',
        text: 'Please turn on your online status to start receiving orders.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6589f6',
      });
      setIsOnline(false);
    }
  }, []);

  const handleLogout = () => {
    if (isOnline) {
      Swal.fire({
        title: 'Turn Off Online Status',
        text: 'Please turn off your online status before logging out.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f39c12',
      });
    } else {
      Swal.fire({
        title: 'Logging Out',
        text: 'You have been logged out successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6589f6',
      }).then(() => {
        dispatch(restaurantLogout());
        localStorage.removeItem('restaurantToken');
        localStorage.removeItem('restaurantRefreshToken');
        navigate('/restaurant-login');
      });
    }
  };

  const handleToggleOnline = async () => {
    const token = localStorage.getItem('restaurantToken');
    try {
      const response = await axiousInstance.patch('/update-online-status', {
        restaurant_id,
        isOnline: !isOnline
      });

      if (response.data.message === 'Online status updated successfully') {
        setIsOnline(!isOnline);
        Swal.fire({
          title: `Status Updated`,
          text: `Your restaurant is now ${!isOnline ? 'Online' : 'Offline'}.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6589f6',
        });
      }
    } catch (error:any) {
      console.error('Error updating online status:', error.message);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating online status.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white shadow-lg
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 z-50
      `}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6589f6] rounded-full flex items-center justify-center">
              <Utensils className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Dainty Food</h1>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveMenu(item.label);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 mb-1 rounded-lg text-sm
                ${activeMenu === item.label 
                  ? 'bg-[#6589f6] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'}
                transition-colors duration-200`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 mt-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 md:block hidden">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={handleToggleOnline}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors duration-200
                    ${isOnline ? 'bg-[#6589f6]' : 'bg-gray-200'}`}></div>
                  <div className={`absolute w-4 h-4 bg-white rounded-full transition-all duration-200
                    ${isOnline ? 'left-5' : 'left-1'} top-0.5 shadow-sm`}></div>
                </label>
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6589f6] rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-800">Mr. Jo</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Chef!</h2>
                <p className="text-gray-600 mt-1">Here's your restaurant's performance overview</p>
              </div>
              <Link
                to="/add-menu"
                className="bg-[#6589f6] text-white px-4 py-2 rounded-lg hover:bg-[#5578e5] transition-colors duration-200 flex items-center gap-2"
              >
                <span>+</span> Add Menu Item
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-2xl font-semibold text-gray-800 mt-1">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-[#6589f6]/10 rounded-full">
                    {card.icon}
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">{card.growth}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Revenue</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`$${value}`, "Revenue"]}
                    />
                    <Bar dataKey="value" fill="#6589f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Categories</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {ordersByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Restaurant Profile */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Restaurant Profile</h3>
            <div className="flex border-b border-gray-100 mb-6">
              {['overview', 'hours', 'locations'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium
                    ${activeTab === tab 
                      ? 'border-b-2 border-[#6589f6] text-[#6589f6]' 
                      : 'text-gray-600 hover:text-[#6589f6]'}
                    transition-colors duration-200`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-600">General Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Restaurant Name</p>
                    <p className="font-medium text-gray-800">Dainty Food</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Cuisine Type</p>
                    <p className="font-medium text-gray-800">Contemporary Fusion</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-600">Account Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Registration Date</p>
                    <p className="font-medium text-gray-800">June 15, 2023</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Subscription Plan</p>
                    <p className="font-medium text-gray-800">Premium <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">Active</span></p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <Clock size={16} />
                      {day}
                    </span>
                    <span className={day === "Sunday" ? "text-red-500" : "text-gray-700"}>
                      {day === "Sunday" ? "Closed" : "10:00 AM - 10:00 PM"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800 flex items-center gap-2">
                        <MapPin size={16} /> Flagship Location
                      </p>
                      <p className="text-sm text-gray-600 mt-1">123 Gourmet Street, Mumbai</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Main</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div>
                    <p className="font-medium text-gray-800">{order.name}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">${order.price.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-[#6589f6] hover:text-[#5578e5] text-sm font-medium">
                View All Orders →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DaintyFoodDashboard;