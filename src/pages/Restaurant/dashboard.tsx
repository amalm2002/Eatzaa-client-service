import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Legend,
} from 'recharts';
import Sidebar from './navbar/sidebar';
import Header from './navbar/header';
import { Clock, ChefHat, ShoppingCart, CreditCard, TrendingUp, MapPin } from 'lucide-react';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { restaurantApi } from '../../api/endpoints/restaurantApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Order } from '../../interfaces/restaurant/order/order.types';

const COLORS = ['#6589f6', '#93b1ff', '#c2d3ff', '#dbe7ff', '#4f46e5', '#06b6d4'];

const DaintyFoodDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const dispatch = useDispatch();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        const params: any = { period: timePeriod };
        if (timePeriod === 'custom' && customStartDate && customEndDate) {
          params.startDate = customStartDate.toISOString();
          params.endDate = customEndDate.toISOString();
        }
        const response = await restaurantApi.fetchDashboardStats(dispatch, restaurantId, params);
        console.log('response:', response);

        if (response.success) {
          setOrderData(response.data.revenueData);
          setTopItems(response.data.topItems);
          setRecentOrders(response.data.recentOrders);
          setStats({
            totalOrders: response.data.totalOrders,
            totalSales: response.data.totalSales,
            totalProfit: response.data.totalProfit,
          });
        } else {
          throw new Error(response.error || 'Failed to fetch dashboard stats');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to fetch dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [restaurantId, dispatch, timePeriod, customStartDate, customEndDate]);

  const statsCards = [
    {
      label: 'Available Dishes',
      value: 150,
      icon: <ChefHat size={24} className="text-[#6589f6]" />,
      growth: '+2.5%',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart size={24} className="text-[#6589f6]" />,
      growth: '+7.8%',
    },
    {
      label: 'Total Sales',
      value: stats.totalSales,
      icon: <CreditCard size={24} className="text-[#6589f6]" />,
      growth: '+15.2%',
    },
    {
      label: 'Total Profit',
      value: stats.totalProfit.toFixed(2),
      icon: <TrendingUp size={24} className="text-[#6589f6]" />,
      growth: '+4.3%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <style>
        {`
          .chart-container {
            transition: all 0.3s ease;
          }
          .chart-container:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }
          .date-picker {
            transition: all 0.3s ease;
          }
          .date-picker:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            border-color: #4f46e5;
          }
          .loading-spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .time-period-selector {
            transition: all 0.2s ease;
          }
          .time-period-selector:hover {
            background-color: #e0f2fe;
          }
        `}
      </style>
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />
      <div className="md:ml-64">
        <Header
          isOnline={isOnline}
          handleToggleOnline={handleToggleOnline}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Chef!</h2>
                <p className="text-gray-500 text-sm mt-1">Explore your restaurant's performance insights</p>
              </div>
              <Link
                to="/restaurant-add-menu"
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
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </p>
                  </div>
                  <div className="p-2 bg-[#6589f6]/10 rounded-full">{card.icon}</div>
                </div>
                <p className="text-xs text-green-600 mt-2">{card.growth}</p>
              </div>
            ))}
          </div>

          {/* Time Period Selector */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Time Period</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="time-period-selector px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6589f6] text-gray-700 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
              {timePeriod === 'custom' && (
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date: Date | null) => setCustomStartDate(date)}
                      className="date-picker px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-gray-700 text-sm"
                      placeholderText="Select start date"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date: Date | null) => setCustomEndDate(date)}
                      className="date-picker px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-gray-700 text-sm"
                      placeholderText="Select end date"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setCustomStartDate(null);
                      setCustomEndDate(null);
                      setTimePeriod('weekly');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm mt-6"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2 border border-gray-100 chart-container">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {timePeriod === 'weekly'
                  ? 'Weekly Revenue'
                  : timePeriod === 'monthly'
                    ? 'Monthly Revenue'
                    : timePeriod === 'yearly'
                      ? 'Yearly Revenue'
                      : 'Revenue by Period'}
              </h3>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full loading-spinner"></div>
                  </div>
                  <p className="text-gray-500 text-sm">Loading revenue data...</p>
                </div>
              ) : orderData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <p className="text-gray-500 text-sm">No revenue data available for this period.</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Bar dataKey="value" fill="#6589f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 chart-container">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full loading-spinner"></div>
                  </div>
                  <p className="text-gray-500 text-sm">Loading top items data...</p>
                </div>
              ) : topItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <p className="text-gray-500 text-sm">No items sold in this period.</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topItems}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {topItems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value) => [`${value} units`, 'Quantity']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Profile */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Restaurant Profile</h3>
            <div className="flex border-b border-gray-100 mb-6">
              {['overview', 'hours', 'locations'].map((tab) => (
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
                    <p className="font-medium text-gray-800">
                      Premium <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">Active</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <Clock size={16} />
                      {day}
                    </span>
                    <span className={day === 'Sunday' ? 'text-red-500' : 'text-gray-700'}>
                      {day === 'Sunday' ? 'Closed' : '10:00 AM - 10:00 PM'}
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
          </div> */}

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No recent orders available.</div>
              ) : (
                recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{order.items[0]?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${order.totalAmount.toFixed(2)}</p>
                      <span
                      // className={`text-xs px-2 py-1 rounded-full
                      // ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Link to="/order-list-page" className="text-[#6589f6] hover:text-[#5578e5] text-sm font-medium">
                View All Orders →
              </Link>
            </div>
          </div>
        </main>
      </div>

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