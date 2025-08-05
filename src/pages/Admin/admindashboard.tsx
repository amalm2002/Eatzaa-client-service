import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from './header/sidebar';
import UserList from './users/customersList';
import RestaurantListPage from './restaurant/restaurantList';
import RestaurantDetails from './restaurant/restaurantDetailsPage';
import { Header } from './header/header';
import SubscriptionPlanManagementPage from './restaurant/paymentSubscription';
import PaymentListPage from './restaurant/restaurantsPayments';
import DeliveryBoyZoneCreation from './delivery-boy/deliveryBoyZoneAddPage';
import DeliveryBoyListPage from './delivery-boy/deliveryBoyListPage';
import DeliveryBoyDetails from './delivery-boy/deliveryBoyDetailsPage';
import ZoneListPage from './delivery-boy/zoneList';
import { OrderSchedule } from '../../interfaces/admin/dashboard/order-schedule.types';
import { FoodCategory } from '../../interfaces/admin/dashboard/food-category.types';
import { FoodDeliveryDashboardProps } from '../../interfaces/admin/dashboard/food-delivery-dash.types';
import RidePaymentManagement from './delivery-boy/ridePayment';
import DeliveryPaymentManagement from './delivery-boy/deliveryPartnerPayment';
import DeliveryHelpAdmin from './delivery-boy/deliveryBoyHelpsection';
import DeliveryCincernPanel from './delivery-boy/concernListPage';

const FoodDeliveryDashboard: React.FC<FoodDeliveryDashboardProps> = ({ initialPage = 'Dashboard' }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (initialPage === 'RestaurantDetails' && id) {
      setActivePage('RestaurantDetails');
    } else if (initialPage === 'DeliveryBoyDetails') {
      setActivePage('DeliveryBoyDetails');
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
    } else if (page === 'Subscription-Plan') {
      navigate('/admin/restaurants/subscription');
    } else if (page === 'Payments') {
      navigate('/admin/payments')
    } else if (page === 'Zone-Creation') {
      navigate('/admin/deliveryBoy/zone')
    } else if (page === 'DeliveryBoy') {
      navigate('/admin/Delivery-Boy')
    } else if (page === 'Zone-List') {
      navigate('/admin/zone-list')
    } else if (page === 'RidePayment') {
      navigate('/admin/ride-payment')
    } else if (page === 'PartnerPayment') {
      navigate('/admin/partner-earnings-payment')
    } else if (page === 'Help Center') {
      navigate('/admin/partner/helpcenter')
    } else if (page === 'Concern') {
      navigate('/admin/partner/concern')
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
      <Header />
      <Sidebar activePage={activePage} setActivePage={handleSetActivePage} />
      <div className="flex-1 md:ml-64">
        {activePage === 'Customers' ? (
          <UserList />
        ) : activePage === 'Restaurants' ? (
          <RestaurantListPage />
        ) : activePage === 'Zone-Creation' ? (
          <DeliveryBoyZoneCreation />
        ) : activePage === 'Zone-List' ? (
          <ZoneListPage />
        ) : activePage === 'DeliveryBoy' ? (
          <DeliveryBoyListPage />
        ) : activePage === 'Payments' ? (
          <PaymentListPage />
        ) : activePage === 'Help Center' ? (
          <DeliveryHelpAdmin />
        ) : activePage === 'Concern' ? (
          <DeliveryCincernPanel  />
        ) : activePage === 'PartnerPayment' ? (
          <DeliveryPaymentManagement />
        ) : activePage === 'RidePayment' ? (
          <RidePaymentManagement />
        ) : activePage === 'Subscription-Plan' ? (
          <SubscriptionPlanManagementPage />
        ) : activePage === 'RestaurantDetails' && id ? (
          <RestaurantDetails activePage={activePage} setActivePage={handleSetActivePage} restaurantId={id} />
        ) : activePage === 'DeliveryBoyDetails' && id ? (
          <DeliveryBoyDetails activePage={activePage} setActivePage={handleSetActivePage} deliveryBoyId={id} />
        ) : (
          <main className="pt-20 p-6 bg-gray-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style >{`
             main::-webkit-scrollbar {
             display: none;
             }
           `}</style>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Order Overview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <h2 className="text-lg font-semibold text-black mb-4">Order Overview</h2>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {orderStats.active}
                  <span className="text-sm text-gray-600 font-normal ml-2">Active Orders</span>
                </div>
                <div className="flex flex-wrap text-sm text-gray-700 gap-4">
                  <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{orderStats.pending} Pending</div>
                  <div className="px-2 py-1 bg-red-50 text-red-700 rounded-md">{orderStats.cancelled} Cancelled</div>
                  <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md">{orderStats.successRate} Success rate</div>
                </div>
              </div>

              {/* Order Sources */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
                <h2 className="text-lg font-semibold text-black mb-4">Order Sources</h2>
                <div className="space-y-4">
                  {[
                    { name: 'App', value: orderSources.app, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
                    { name: 'Website', value: orderSources.website, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
                    { name: 'Phone', value: orderSources.phone, color: 'bg-gradient-to-r from-green-500 to-green-600' },
                  ].map((source) => (
                    <div key={source.name}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium text-gray-800">{source.name}</span>
                        <span className="font-semibold text-black">{source.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${source.color} h-3 rounded-full transition-all duration-500 shadow-sm`}
                          style={{ width: `${source.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Categories */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 xl:col-span-3">
                <h2 className="text-lg font-semibold text-black mb-6">Popular Food Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {foodCategories.map((category, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${index === 0
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600'
                              : index === 1
                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-600'
                                : 'bg-gradient-to-r from-pink-100 to-red-100 text-red-600'
                              }`}
                          >
                            {index === 0 ? '🍕' : index === 1 ? '🍔' : '🍣'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-black">{category.name}</div>
                            <div className="text-xs text-gray-600">#{index + 1} Popular</div>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${index === 0
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : index === 1
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                          }`}>Active</span>
                      </div>
                      <div className="text-2xl font-bold text-black">{category.totalOrders}k</div>
                      <div className="text-xs text-gray-600">Total Orders</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Schedule */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 xl:col-span-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-lg font-semibold text-black">Order Schedule</h2>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                      Filter
                    </button>
                    <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                      Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style >{`
                      div::-webkit-scrollbar {
                      display: none;
                     }
                  `}</style>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {['ID', 'Type', 'Status', 'Date & Time', 'Action'].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderSchedule.map((order) => (
                        <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-black font-medium">{order.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium ${order.type === 'Delivery'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
                                }`}
                            >
                              {order.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm ${order.status === 'Pending'
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                                : order.status === 'Processing'
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{order.dateTime}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 transition-all duration-300 flex items-center justify-center text-xs hover:scale-110">
                              •••
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