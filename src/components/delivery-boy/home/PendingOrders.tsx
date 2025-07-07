import { Package, MapPin } from 'lucide-react';
import { PendingOrdersProps } from '../../../interfaces/delivery-boy/dashboard/pending-orders.types';

const PendingOrders = ({ partnerData, recentOrders }: PendingOrdersProps) => {
    return (
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
                                <p className="font-medium text-gray-800">Order #{recentOrders[0].orderNumber}</p>
                                <p className="text-xs text-gray-500">Restaurant: {recentOrders[0].restaurant}</p>
                            </div>
                        </div>
                        <span className="bg-orange-100 text-orange-600 text-xs py-1 px-2 rounded-full">Pick up</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            2.5 km away
                        </span>
                        <span>₹{recentOrders[0].amount} earnings</span>
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
    );
};

export default PendingOrders;