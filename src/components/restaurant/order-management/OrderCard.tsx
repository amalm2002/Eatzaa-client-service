import React, { useState } from 'react';
import { FiPhone, FiMapPin, FiClock, FiPackage } from 'react-icons/fi';
import StatusDropdown from './StatusDropdown';
import { OrderCardProps } from '../../../interfaces/restaurant/order/order-card.types';

const statusOptions = [
    { value: 'Pending', label: 'Order Received', color: 'bg-orange-100 text-orange-800', icon: FiClock },
    { value: 'Preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: FiPackage },
    { value: 'Packed', label: 'Ready for Pickup', color: 'bg-purple-100 text-purple-800', icon: FiPackage },
    { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: FiPackage },

];

const OrderCard: React.FC<OrderCardProps> = ({ order, axiosInstance, setOrders }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getTimeAgo = (dateString: string): string => {
        const now = new Date();
        const orderTime = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    const getStatusConfig = (status: string) => {
        return statusOptions.find((option) => option.value === status) || statusOptions[0];
    };

    const statusConfig = getStatusConfig(order.orderStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="gradient-border card-hover">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                        <span className="text-sm text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 rounded-full">
                            {getTimeAgo(order.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                        <span className="text-sm text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 rounded-full">
                            {order.payment.method}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                        <div className="space-y-3">
                            {order.items.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <img
                                            src={item.images[0] || '/api/placeholder/100/100'}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h5>
                                            <p className="text-xs text-gray-600">
                                                {item.quantity} x ₹{item.price.toFixed(2)}
                                                <span
                                                    className={`inline-block w-2 h-2 rounded-full ml-2 ${item.category.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        ₹{(item.quantity * item.price).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.color} transition-all duration-300`}
                                >
                                    <StatusIcon size={16} />
                                    {statusConfig.label}
                                </div>
                                <StatusDropdown
                                    order={order}
                                    axiosInstance={axiosInstance}
                                    setOrders={setOrders}
                                    isOpen={isDropdownOpen}
                                    setIsOpen={setIsDropdownOpen}
                                />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer</h4>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <FiPhone size={16} className="text-indigo-600" />
                                    <span>{order.phoneNumber}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiMapPin size={16} className="text-indigo-600 mt-1" />
                                    <div>
                                        <div>{order.address[0]?.street}</div>
                                        <div>{order.address[0]?.city}, {order.address[0]?.state}</div>
                                        <div>{order.address[0]?.pinCode}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment</h4>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-sm">
                                <div>
                                    <div className="font-medium text-gray-900">{order.payment.method}</div>
                                    {/* <div className="text-gray-600">{order.payment.status}</div> */}
                                </div>
                                {/* <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment.status === 'Success'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {order.payment.status}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;