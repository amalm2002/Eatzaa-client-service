import {  useState } from 'react';
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
} from "recharts";
import Sidebar from './navbar/sidebar';
import Header from './navbar/header';
import { Clock, ChefHat, ShoppingCart, CreditCard, TrendingUp, MapPin } from 'lucide-react';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';

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
  const [activeTab, setActiveTab] = useState('overview');
  const {isOnline,handleToggleOnline}=useRestaurantStatus()

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

  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-gray-600 mt-1">Here's your restaurant's performance overview</p>
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