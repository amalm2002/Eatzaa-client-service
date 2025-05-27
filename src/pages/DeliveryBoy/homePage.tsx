import { useState, useEffect } from 'react';
import {
    Clock, DollarSign, Package, Calendar, ChevronRight,
    MapPin, LogOut, Bell, User, Menu, Check, X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyLogout } from '../../service/redux/slices/deliveryBoySlice';

export default function DeliveryPartnerDashboard() {
    const [isOnline, setIsOnline] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const partnerData = {
        name: "John Doe",
        rating: 4.8,
        earnings: {
            today: 450,
            week: 3250
        },
        loginHours: "5:30",
        ordersCompleted: 8,
        pendingOrders: 1
    };

    const recentOrders = [
        { id: "ORD-6745", restaurant: "Burger King", amount: 120, time: "14:35", status: "Delivered" },
        { id: "ORD-6741", restaurant: "Pizza Hut", amount: 350, time: "13:20", status: "Delivered" },
        { id: "ORD-6738", restaurant: "KFC", amount: 220, time: "12:15", status: "Delivered" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const handleToggleOnline = () => {
        setIsOnline(!isOnline);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        dispatch(deliveryBoyLogout());
        localStorage.removeItem('deliveryBoyToken');
        localStorage.removeItem('deliveryBoyRefreshToken');
        navigate('/deliveryBoy-login');
    };

    return (
        <div className="flex h-screen bg-orange-50 text-gray-800 font-sans">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-orange-100`}>
                <div className="p-4 flex items-center justify-between border-b border-orange-100">
                    <div className="flex items-center">
                        {sidebarOpen ? (
                            <h1 className="text-xl font-bold text-orange-600">Eatzaa</h1>
                        ) : (
                            <span className="text-xl font-bold text-orange-600">EZ</span>
                        )}
                    </div>
                    <button onClick={toggleSidebar} className="text-orange-600 hover:text-orange-700">
                        <Menu size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-orange-100">
                    <div className="flex items-center">
                        <div className="bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center text-lg font-medium">
                            {partnerData.name.charAt(0)}
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="font-medium text-gray-800 truncate">{partnerData.name}</p>
                                <div className="flex items-center text-sm text-orange-600">
                                    <span className="text-orange-600">★</span>
                                    <span className="ml-1">{partnerData.rating}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul>
                        {[
                            { icon: <Package size={20} />, label: "Dashboard", active: true },
                            { icon: <DollarSign size={20} />, label: "Earnings" },
                            { icon: <Clock size={20} />, label: "My Activity" },
                            { icon: <MapPin size={20} />, label: "Order History" },
                        ].map((item, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    className={`flex items-center py-3 px-4 ${item.active ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-orange-100">
                    <button onClick={handleLogout} className={`flex items-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg py-2 ${sidebarOpen ? 'px-3' : 'justify-center px-0'}`}>
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-2">Log Out</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                            <span className="text-sm text-gray-500 ml-4">
                                <Calendar size={16} className="inline mr-1" />
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <div className="relative mr-4">
                                <Bell size={20} className="text-gray-500 hover:text-orange-600 cursor-pointer" />
                                <span className="absolute top-0 right-0 bg-orange-500 rounded-full w-2 h-2"></span>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                    {partnerData.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-orange-50">
                    {/* Status Card with Online/Offline Toggle */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium mb-1 text-gray-800">Delivery Partner Status</h3>
                                <p className={`font-medium ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                                    You are currently {isOnline ? 'Online' : 'Offline'}
                                </p>
                                {isOnline && (
                                    <p className="text-sm text-gray-500 mt-1">You've been online for {partnerData.loginHours} hours today</p>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <button
                                    onClick={handleToggleOnline}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-100 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${isOnline ? 'translate-x-9' : 'translate-x-1'}`}
                                    />
                                </button>
                                <span className="text-sm text-gray-500 mt-2">{isOnline ? 'Go Offline' : 'Go Online'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium">Today's Earnings</h3>
                                <DollarSign size={20} className="text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold">₹{partnerData.earnings.today}</p>
                        </div>

                        <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium">Orders Completed</h3>
                                <Package size={20} className="text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold">{partnerData.ordersCompleted}</p>
                        </div>

                        <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium">Online Hours</h3>
                                <Clock size={20} className="text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold">{partnerData.loginHours}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Orders */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Pending Orders</h3>
                                {partnerData.pendingOrders > 0 && (
                                    <span className="bg-orange-100 text-orange-600 text-xs py-1 px-2 rounded-full">{partnerData.pendingOrders}</span>
                                )}
                            </div>

                            {partnerData.pendingOrders > 0 ? (
                                <div className="border border-orange-100 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            <div className="bg-orange-50 p-2 rounded-full">
                                                <Package size={18} className="text-orange-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium text-gray-800">Order #38291</p>
                                                <p className="text-xs text-gray-500">Restaurant: Burger King</p>
                                            </div>
                                        </div>
                                        <span className="bg-orange-100 text-orange-600 text-xs py-1 px-2 rounded-full">Pick up</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                                        <span className="flex items-center">
                                            <MapPin size={14} className="mr-1" />
                                            2.5 km away
                                        </span>
                                        <span>₹120 earnings</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-100">
                                            Decline
                                        </button>
                                        <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-100">
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="bg-orange-50 p-4 rounded-full mb-3">
                                        <Package size={32} className="text-orange-600" />
                                    </div>
                                    <p className="text-gray-500 mb-1">No pending orders</p>
                                    <p className="text-xs text-gray-400">New orders will appear here</p>
                                </div>
                            )}
                        </div>

                        {/* Weekly Earnings */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Weekly Summary</h3>
                                <a href="#" className="text-orange-600 text-sm flex items-center hover:text-orange-700">
                                    View All <ChevronRight size={16} />
                                </a>
                            </div>

                            <div className="flex items-center mb-4 p-3 bg-orange-100 text-gray-800 rounded-lg">
                                <div>
                                    <p className="text-3xl font-bold">₹{partnerData.earnings.week}</p>
                                    <p className="text-sm">This Week's Earnings</p>
                                </div>
                            </div>

                            {/* Simple weekly data visualization */}
                            <div className="grid grid-cols-7 gap-2 mt-4">
                                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                                    const height = 20 + Math.floor(Math.random() * 60);
                                    const isToday = i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0);

                                    return (
                                        <div key={day} className="flex flex-col items-center">
                                            <div
                                                className={`w-full rounded-t-md ${isToday ? 'bg-orange-500' : 'bg-orange-100'}`}
                                                style={{ height: `${height}px` }}
                                            ></div>
                                            <span className="text-xs mt-1 text-gray-500">{day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
                            <a href="#" className="text-orange-600 text-sm flex items-center hover:text-orange-700">
                                View All <ChevronRight size={16} />
                            </a>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-orange-100">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-orange-50">
                                            <td className="px-3 py-3 text-sm font-medium text-gray-800">{order.id}</td>
                                            <td className="px-3 py-3 text-sm text-gray-500">{order.restaurant}</td>
                                            <td className="px-3 py-3 text-sm text-gray-800">₹{order.amount}</td>
                                            <td className="px-3 py-3 text-sm text-gray-500">{order.time}</td>
                                            <td className="px-3 py-3">
                                                <span className="bg-green-100 text-green-600 text-xs py-1 px-2 rounded-full">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}