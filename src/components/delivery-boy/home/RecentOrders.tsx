import { ChevronRight } from 'lucide-react';
import { RecentOrdersProps } from '../../../interfaces/delivery-boy/dashboard/recent-order.types';

const RecentOrders = ({ recentOrders }: RecentOrdersProps) => {
    return (
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
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
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
                                <td className="px-3 py-3 text-sm text-gray-500">{order.orderNumber}</td>
                                <td className="px-3 py-3 text-sm text-gray-500">{order.restaurant}</td>
                                <td className="px-3 py-3 text-sm text-gray-800">₹{order.amount}</td>
                                <td className="px-3 py-3 text-sm text-gray-500">{order.time}</td>
                                <td className="px-3 py-3">
                                    <span
                                        className={`text-xs py-1 px-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;