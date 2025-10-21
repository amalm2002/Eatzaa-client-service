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
import { FoodDeliveryDashboardProps } from '../../interfaces/admin/dashboard/food-delivery-dash.types';
import RidePaymentManagement from './delivery-boy/ridePayment';
import DeliveryPaymentManagement from './delivery-boy/deliveryPartnerPayment';
import DeliveryHelpAdmin from './delivery-boy/deliveryBoyHelpsection';
import DeliveryCincernPanel from './delivery-boy/concernListPage';
import Chart from 'chart.js/auto';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { createAxiosInstance } from '../../service/axious-services/axiosInstance';
import { DeliveryBoyChartData } from 'src/interfaces/admin/dashboard/delivery-boy-chart.types';
import { RestaurantChartData } from 'src/interfaces/admin/dashboard/restaurant-chart.types';


const FoodDeliveryDashboard: React.FC<FoodDeliveryDashboardProps> = ({ initialPage = 'Dashboard' }) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [restaurantData, setRestaurantData] = useState<RestaurantChartData[]>([]);
  const [deliveryBoyData, setDeliveryBoyData] = useState<DeliveryBoyChartData[]>([]);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [deliveryBoyLoading, setDeliveryBoyLoading] = useState(false);
  const [filter, setFilter] = useState({ startDate: '', endDate: '' });
  const [restaurantSortBy, setRestaurantSortBy] = useState('revenue');
  const [restaurantTopN, setRestaurantTopN] = useState(10);
  const [deliverySortBy, setDeliverySortBy] = useState('totalEarnings');
  const [deliveryTopN, setDeliveryTopN] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        setRestaurantLoading(true);
        const axiosInstance = createAxiosInstance('Admin', dispatch);
        const response = await axiosInstance.get('/getRestaurantChartData', {
          params: {
            startDate: filter.startDate,
            endDate: filter.endDate,
            sortBy: restaurantSortBy,
            order: 'desc',
            limit: restaurantTopN,
          },
        });

        console.log('response restaurant:', response);

        if (response.data.message !== 'success') {
          throw new Error(response.data.message || 'Failed to load restaurant chart data');
        }
        const mappedData: RestaurantChartData[] = response.data.response.map((item: any) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          orderVolume: item.orderVolume || 0,
          revenue: item.revenue || 0,
        }));
        setRestaurantData(mappedData);
      } catch (error: any) {
        toast.error('Failed to load restaurant chart data');
        console.log('Error fetching restaurant chart data:', error);
      } finally {
        setRestaurantLoading(false);
      }
    };
    if (activePage === 'Dashboard') {
      fetchRestaurantChartData();
    }
  }, [filter, activePage, restaurantSortBy, restaurantTopN, dispatch]);

  useEffect(() => {
    const fetchDeliveryBoyChartData = async () => {
      try {
        setDeliveryBoyLoading(true);
        const axiosInstance = createAxiosInstance('Admin', dispatch);
        const response = await axiosInstance.get('/getDeliveryBoyChartData', {
          params: {
            startDate: filter.startDate,
            endDate: filter.endDate,
            sortBy: deliverySortBy,
            order: 'desc',
            limit: deliveryTopN,
          },
        });
        console.log('response delivery:', response);

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
        setDeliveryBoyLoading(false);
      }
    };
    if (activePage === 'Dashboard') {
      fetchDeliveryBoyChartData();
    }
  }, [filter, activePage, deliverySortBy, deliveryTopN, dispatch]);

  useEffect(() => {
    if (restaurantData.length > 0 && activePage === 'Dashboard' && !restaurantLoading) {
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
  }, [restaurantData, activePage, restaurantLoading]);

  useEffect(() => {
    if (deliveryBoyData.length > 0 && activePage === 'Dashboard' && !deliveryBoyLoading) {
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
  }, [deliveryBoyData, activePage, deliveryBoyLoading]);

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    if (page === 'Customers') {
      navigate('/admin/customers');
    } else if (page === 'Restaurants') {
      navigate('/admin/restaurants');
    } else if (page === 'Subscription-Plan') {
      navigate('/admin/restaurants/subscriptions');
    } else if (page === 'Payments') {
      navigate('/admin/payments');
    } else if (page === 'Zone-Creation') {
      navigate('/admin/zone/create');
    } else if (page === 'DeliveryBoy') {
      navigate('/admin/delivery-boy');
    } else if (page === 'Zone-List') {
      navigate('/admin/zones');
    } else if (page === 'RidePayment') {
      navigate('/admin/ride-payments');
    } else if (page === 'PartnerPayment') {
      navigate('/admin/partner-payments');
    } else if (page === 'Help Center') {
      navigate('/admin/partner/help-center');
    } else if (page === 'Concern') {
      navigate('/admin/partner/concern');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

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
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Sort By:</label>
                        <select
                          value={restaurantSortBy}
                          onChange={(e) => setRestaurantSortBy(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="orderVolume">Order Volume</option>
                          <option value="revenue">Revenue</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Show:</label>
                        <select
                          value={restaurantTopN}
                          onChange={(e) => setRestaurantTopN(Number(e.target.value))}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={5}>Top 5</option>
                          <option value={10}>Top 10</option>
                          <option value={20}>Top 20</option>
                        </select>
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
                </div>
                <div className="p-6">
                  {restaurantLoading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading restaurant analytics data...</p>
                      </div>
                    </div>
                  ) : restaurantData.length === 0 ? (
                    <div className="flex items-center justify-center h-80">
                      <p className="text-gray-600 font-medium">No restaurant data available</p>
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
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Sort By:</label>
                        <select
                          value={deliverySortBy}
                          onChange={(e) => setDeliverySortBy(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="completedDeliveries">Completed Deliveries</option>
                          <option value="totalEarnings">Total Earnings</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Show:</label>
                        <select
                          value={deliveryTopN}
                          onChange={(e) => setDeliveryTopN(Number(e.target.value))}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={5}>Top 5</option>
                          <option value={10}>Top 10</option>
                          <option value={20}>Top 20</option>
                        </select>
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
                </div>
                <div className="p-6">
                  {deliveryBoyLoading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading delivery partner data...</p>
                      </div>
                    </div>
                  ) : deliveryBoyData.length === 0 ? (
                    <div className="flex items-center justify-center h-80">
                      <p className="text-gray-600 font-medium">No delivery partner data available</p>
                    </div>
                  ) : (
                    <div className="relative h-80">
                      <canvas id="deliveryBoyChart" className="w-full h-full"></canvas>
                    </div>
                  )}
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