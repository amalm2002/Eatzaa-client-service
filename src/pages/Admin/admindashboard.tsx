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
import Chart from 'chart.js/auto';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { createAxiosInstance } from '../../service/axious-services/axiosInstance';


interface RestaurantChartData {
  name: string;
  orderVolume: number;
  revenue: number;
}

interface DeliveryBoyChartData {
  id: string;
  name: string;
  completedDeliveries: number;
  totalEarnings: number;
}

const FoodDeliveryDashboard: React.FC<FoodDeliveryDashboardProps> = ({ initialPage = 'Dashboard' }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [restaurantData, setRestaurantData] = useState<RestaurantChartData[]>([]);
  const [deliveryBoyData, setDeliveryBoyData] = useState<DeliveryBoyChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch()
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

  useEffect(() => {
    const fetchRestaurantChartData = async () => {
      try {
        setLoading(true);
        // const axiosInstance = createAxios(dispatch);
        const axiosInstance = createAxiosInstance('Admin',dispatch);
        const response = await axiosInstance.get('/getRestaurantChartData', {
          params: { startDate: filter.startDate, endDate: filter.endDate },
        });

        console.log('response restaurant :', response);

        if (response.data.message !== 'success') {
          throw new Error(response.data.message || 'Failed to load restaurant chart data');
        }
        const mappedData: RestaurantChartData[] = response.data.response.map((item: any) => ({
          name: item.restaurantName,
          orderVolume: item.orderVolume || 0,
          revenue: item.revenue || 0,
        }));
        setRestaurantData(mappedData);
      } catch (error: any) {
        toast.error('Failed to load restaurant chart data');
        console.log('Error fetching restaurant chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (activePage === 'Dashboard') {
      fetchRestaurantChartData();
    }
  }, [filter, activePage]);

  useEffect(() => {
    const fetchDeliveryBoyChartData = async () => {
      try {
        setLoading(true);
        // const axiosInstance = createAxios(dispatch);
        const axiosInstance = createAxiosInstance('Admin',dispatch);
        const response = await axiosInstance.get('/getDeliveryBoyChartData', {
          params: { startDate: filter.startDate, endDate: filter.endDate },
        });
        console.log('response delivery :', response);

        if (response.data.message !== 'success') {
          throw new Error(response.data.message || 'Failed to load delivery boy chart data');
        }
        const mappedData: DeliveryBoyChartData[] = response.data.response.map((item: any) => ({
          id: item._id,
          name: item.name,
          completedDeliveries: item.completedDeliveries || 0,
          totalEarnings: item.totalEarnings || 0,
        }));
        setDeliveryBoyData(mappedData);
      } catch (error: any) {
        toast.error('Failed to load delivery boy chart data');
        console.log('Error fetching delivery boy chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (activePage === 'Dashboard') {
      fetchDeliveryBoyChartData();
    }
  }, [filter, activePage]);

  useEffect(() => {
    if (restaurantData.length > 0 && activePage === 'Dashboard') {
      const ctx = document.getElementById('restaurantChart') as HTMLCanvasElement;
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: restaurantData.map((item) => item.name),
          datasets: [
            {
              label: 'Order Volume',
              data: restaurantData.map((item) => item.orderVolume),
              backgroundColor: 'rgba(79, 172, 254, 0.8)',
              borderColor: 'rgba(79, 172, 254, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: 'Revenue (INR)',
              data: restaurantData.map((item) => item.revenue),
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              borderColor: 'rgba(34, 197, 94, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                  family: 'Inter, sans-serif',
                  weight: 'bold',
                },
                color: '#374151',
                padding: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: '#F9FAFB',
              bodyColor: '#F9FAFB',
              borderColor: 'rgba(75, 85, 99, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              titleFont: {
                size: 13,
                weight: 'bold',
              },
              bodyFont: {
                size: 12,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11,
                  family: 'Inter, sans-serif',
                },
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(156, 163, 175, 0.2)',
                // drawBorder: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11,
                  family: 'Inter, sans-serif',
                },
                padding: 8,
              },
            },
          },
          elements: {
            bar: {
              borderRadius: 6,
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      });
    }
  }, [restaurantData, activePage]);

  useEffect(() => {
    if (deliveryBoyData.length > 0 && activePage === 'Dashboard') {
      const ctx = document.getElementById('deliveryBoyChart') as HTMLCanvasElement;
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: deliveryBoyData.map((item) => item.name),
          datasets: [
            {
              label: 'Completed Deliveries',
              data: deliveryBoyData.map((item) => item.completedDeliveries),
              backgroundColor: 'rgba(236, 72, 153, 0.8)',
              borderColor: 'rgba(236, 72, 153, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: 'Total Earnings (INR)',
              data: deliveryBoyData.map((item) => item.totalEarnings),
              backgroundColor: 'rgba(168, 85, 247, 0.8)',
              borderColor: 'rgba(168, 85, 247, 1)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                  family: 'Inter, sans-serif',
                  weight: 'bold',
                },
                color: '#374151',
                padding: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              titleColor: '#F9FAFB',
              bodyColor: '#F9FAFB',
              borderColor: 'rgba(75, 85, 99, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              titleFont: {
                size: 13,
                weight: 'bold',
              },
              bodyFont: {
                size: 12,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11,
                  family: 'Inter, sans-serif',
                },
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(156, 163, 175, 0.2)',
                // drawBorder: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11,
                  family: 'Inter, sans-serif',
                },
                padding: 8,
              },
            },
          },
          elements: {
            bar: {
              borderRadius: 6,
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        },
      });
    }
  }, [deliveryBoyData, activePage]);

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    if (page === 'Customers') {
      navigate('/admin/customers');
    } else if (page === 'Restaurants') {
      navigate('/admin/restaurants');
    } else if (page === 'Subscription-Plan') {
      navigate('/admin/restaurants/subscription');
    } else if (page === 'Payments') {
      navigate('/admin/payments');
    } else if (page === 'Zone-Creation') {
      navigate('/admin/deliveryBoy/zone');
    } else if (page === 'DeliveryBoy') {
      navigate('/admin/Delivery-Boy');
    } else if (page === 'Zone-List') {
      navigate('/admin/zone-list');
    } else if (page === 'RidePayment') {
      navigate('/admin/ride-payment');
    } else if (page === 'PartnerPayment') {
      navigate('/admin/partner-earnings-payment');
    } else if (page === 'Help Center') {
      navigate('/admin/partner/helpcenter');
    } else if (page === 'Concern') {
      navigate('/admin/partner/concern');
    } else {
      navigate('/admin-dashboard');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
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
          <DeliveryCincernPanel />
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
            <style>{`
              main::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Filter Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 xl:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Analytics Filter</h2>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Real-time data
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={filter.startDate}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={filter.endDate}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Restaurant Performance Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 xl:col-span-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Restaurant Performance Analytics</h2>
                        <p className="text-sm text-gray-600">Order volume & revenue comparison</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Orders</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading analytics data...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-80">
                      <canvas id="restaurantChart" className="w-full h-full"></canvas>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Boy Performance Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 xl:col-span-3 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Delivery Partner Performance</h2>
                        <p className="text-sm text-gray-600">Deliveries & earnings analysis</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Deliveries</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Earnings</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading performance data...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-80">
                      <canvas id="deliveryBoyChart" className="w-full h-full"></canvas>
                    </div>
                  )}
                </div>
              </div>

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
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${index === 0
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                              : index === 1
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                : 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                            }`}
                        >
                          Active
                        </span>
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
                  <style>{`
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
                        <tr
                          key={order.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        >
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