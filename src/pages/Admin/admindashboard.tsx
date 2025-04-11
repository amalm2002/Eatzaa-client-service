// import React, { useState } from 'react';
// import { Sidebar } from './header/sidebar';
// import UserList from './users/customersList';
// import RestaurantListPage from './restaurant/restaurantList';

// type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

// interface OrderSchedule {
//   id: string;
//   type: 'Delivery' | 'Pickup';
//   status: OrderStatus;
//   dateTime: string;
// }

// interface FoodCategory {
//   name: string;
//   totalOrders: number;
//   percentageGrowth: number;
// }

// const FoodDeliveryDashboard: React.FC = () => {
//   const [activePage, setActivePage] = useState('Dashboard');

//   const orderStats = {
//     active: 83,
//     pending: 47,
//     cancelled: 12,
//     successRate: '78%',
//   };

//   const orderSources = {
//     app: 70,
//     website: 24,
//     phone: 6,
//   };

//   const foodCategories: FoodCategory[] = [
//     { name: 'Pizza', totalOrders: 245, percentageGrowth: 8.3 },
//     { name: 'Burgers', totalOrders: 558, percentageGrowth: 12.7 },
//     { name: 'Sushi', totalOrders: 412, percentageGrowth: -2.1 },
//   ];

//   const orderSchedule: OrderSchedule[] = [
//     { id: 'O1', type: 'Delivery', status: 'Pending', dateTime: '01.12.23' },
//     { id: 'O2', type: 'Pickup', status: 'Processing', dateTime: '01.12.23' },
//     { id: 'O3', type: 'Delivery', status: 'Delivered', dateTime: '01.12.23' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//     <Sidebar activePage={activePage} setActivePage={setActivePage} />
//     <div className="flex-1 md:ml-64">
//       {activePage === 'Customers' ? (
//         <UserList />
//       ) : activePage === 'Restaurants' ? (
//         <RestaurantListPage /> 
//       ) : (
//         <main className="pt-20 p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {/* Order Overview */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Overview</h2>
//               <div className="text-3xl font-bold text-teal-600 mb-2">
//                 {orderStats.active}
//                 <span className="text-sm text-gray-500 font-normal ml-2">Active Orders</span>
//               </div>
//               <div className="flex flex-wrap text-sm text-gray-600 gap-4">
//                 <div>{orderStats.pending} Pending</div>
//                 <div>{orderStats.cancelled} Cancelled</div>
//                 <div>{orderStats.successRate} Success rate</div>
//               </div>
//             </div>

//             {/* Order Sources */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Sources</h2>
//               <div className="space-y-4">
//                 {[
//                   { name: 'App', value: orderSources.app, color: 'teal-500' },
//                   { name: 'Website', value: orderSources.website, color: 'blue-500' },
//                   { name: 'Phone', value: orderSources.phone, color: 'purple-500' },
//                 ].map((source) => (
//                   <div key={source.name}>
//                     <div className="flex justify-between mb-1 text-sm text-gray-600">
//                       <span>{source.name}</span>
//                       <span>{source.value}%</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-2.5">
//                       <div className={`bg-${source.color} h-2.5 rounded-full transition-all duration-300`} style={{ width: `${source.value}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Food Categories */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow xl:col-span-3">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6">Popular Food Categories</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {foodCategories.map((category, index) => (
//                   <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center">
//                         <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                           index === 0 ? 'bg-yellow-50 text-yellow-600' :
//                           index === 1 ? 'bg-blue-50 text-blue-600' :
//                           'bg-red-50 text-red-600'
//                         }`}>
//                           {index === 0 ? '🍕' : index === 1 ? '🍔' : '🍣'}
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-gray-800">{category.name}</div>
//                           <div className="text-xs text-gray-500">#{index + 1}</div>
//                         </div>
//                       </div>
//                       <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Active</span>
//                     </div>
//                     <div className="text-2xl font-bold text-gray-800">{category.totalOrders}k</div>
//                     <div className="text-xs text-gray-500">Orders</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Order Schedule */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow xl:col-span-3">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Order Schedule</h2>
//                 <div className="flex space-x-3">
//                   <button className="px-4 py-2 text-sm rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">Filter</button>
//                   <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Export</button>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {['ID', 'Type', 'Status', 'Date & Time', 'Action'].map((header) => (
//                         <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {orderSchedule.map((order) => (
//                       <tr key={order.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${order.type === 'Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
//                             {order.type}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs rounded-full ${
//                             order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                             order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.dateTime}</td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <button className="text-gray-400 hover:text-teal-500 transition-colors">
//                             {/* Add action icon here */}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </main>
//       )}
//     </div>
//   </div>
//   );
// };

// export default FoodDeliveryDashboard;



import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from './header/sidebar';
import UserList from './users/customersList';
import RestaurantListPage from './restaurant/restaurantList';
import RestaurantDetails from './restaurant/restaurantDetailsPage';
import { Header } from './header/header';

type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

interface OrderSchedule {
  id: string;
  type: 'Delivery' | 'Pickup';
  status: OrderStatus;
  dateTime: string;
}

interface FoodCategory {
  name: string;
  totalOrders: number;
  percentageGrowth: number;
}

interface FoodDeliveryDashboardProps {
  initialPage?: string;
}

const FoodDeliveryDashboard: React.FC<FoodDeliveryDashboardProps> = ({ initialPage = 'Dashboard' }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (initialPage === 'RestaurantDetails' && id) {
      setActivePage('RestaurantDetails');
    } else {
      setActivePage(initialPage);
    }
  }, [initialPage, id]);

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    if (page === 'Customers') {
      navigate('/admin/customers');
    } else if (page === 'Restaurants') {
      navigate('/admin/restaurants');
    } else {
      navigate('/admin-dashboard');
    }
  };

  const orderStats = {
    active: 83,
    pending: 47,
    cancelled: 12,
    successRate: '78%',
  };

  const orderSources = {
    app: 70,
    website: 24,
    phone: 6,
  };

  const foodCategories: FoodCategory[] = [
    { name: 'Pizza', totalOrders: 245, percentageGrowth: 8.3 },
    { name: 'Burgers', totalOrders: 558, percentageGrowth: 12.7 },
    { name: 'Sushi', totalOrders: 412, percentageGrowth: -2.1 },
  ];

  const orderSchedule: OrderSchedule[] = [
    { id: 'O1', type: 'Delivery', status: 'Pending', dateTime: '01.12.23' },
    { id: 'O2', type: 'Pickup', status: 'Processing', dateTime: '01.12.23' },
    { id: 'O3', type: 'Delivery', status: 'Delivered', dateTime: '01.12.23' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header/>
      <Sidebar activePage={activePage} setActivePage={handleSetActivePage} />
      <div className="flex-1 md:ml-64">
        {activePage === 'Customers' ? (
          <UserList />
        ) : activePage === 'Restaurants' ? (
          <RestaurantListPage />
        ) : activePage === 'RestaurantDetails' && id ? (
          <RestaurantDetails activePage={activePage} setActivePage={handleSetActivePage} restaurantId={id} />
        ) : (
          <main className="pt-20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Order Overview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Overview</h2>
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {orderStats.active}
                  <span className="text-sm text-gray-500 font-normal ml-2">Active Orders</span>
                </div>
                <div className="flex flex-wrap text-sm text-gray-600 gap-4">
                  <div>{orderStats.pending} Pending</div>
                  <div>{orderStats.cancelled} Cancelled</div>
                  <div>{orderStats.successRate} Success rate</div>
                </div>
              </div>

              {/* Order Sources */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Sources</h2>
                <div className="space-y-4">
                  {[
                    { name: 'App', value: orderSources.app, color: 'orange-500' },
                    { name: 'Website', value: orderSources.website, color: 'blue-500' },
                    { name: 'Phone', value: orderSources.phone, color: 'purple-500' },
                  ].map((source) => (
                    <div key={source.name}>
                      <div className="flex justify-between mb-1 text-sm text-gray-600">
                        <span>{source.name}</span>
                        <span>{source.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`bg-${source.color} h-2.5 rounded-full transition-all duration-300`}
                          style={{ width: `${source.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Categories */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow xl:col-span-3">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Popular Food Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {foodCategories.map((category, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              index === 0
                                ? 'bg-yellow-50 text-yellow-600'
                                : index === 1
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {index === 0 ? '🍕' : index === 1 ? '🍔' : '🍣'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">{category.name}</div>
                            <div className="text-xs text-gray-500">#{index + 1}</div>
                          </div>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{category.totalOrders}k</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Schedule */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow xl:col-span-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-lg font-semibold text-gray-800">Order Schedule</h2>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-sm rounded-lg bg-orange-400 text-white hover:bg-orange-500 transition-colors">
                      Filter
                    </button>
                    <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['ID', 'Type', 'Status', 'Date & Time', 'Action'].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderSchedule.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                order.type === 'Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {order.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : order.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.dateTime}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="text-gray-400 hover:text-orange-400 transition-colors">
                              {/* Add action icon here */}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default FoodDeliveryDashboard;