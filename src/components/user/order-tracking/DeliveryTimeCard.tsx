import { DeliveryTimeCardProps } from '../../../interfaces/user/profile/order-tracking.types';
import { Clock, AlertTriangle } from 'lucide-react';

const DeliveryTimeCard = ({ order, currentTime }: DeliveryTimeCardProps) => {
    return (
        <div
            className={`rounded-2xl p-6 text-white shadow-xl transition-all duration-300 ${order.currentStatus === 'cancelled'
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : order.currentStatus === 'delayed'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-teal-600 to-teal-700'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2">{order.estimatedDelivery}</h2>
                    <p className="text-lg text-white opacity-90">
                        {order.currentStatus === 'cancelled'
                            ? 'Order Cancelled'
                            : order.currentStatus === 'delayed'
                                ? 'Delayed - New Estimated Time'
                                : 'Estimated Delivery Time'}
                    </p>
                    <div className="mt-4 flex items-center space-x-4 text-white opacity-90">
                        <span className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            Ordered at {order.orderTime}
                        </span>
                        <span>•</span>
                        <span>{currentTime.toLocaleTimeString()}</span>
                    </div>
                    {order.currentStatus === 'cancelled' && (
                        <div className="mt-4 bg-red-600 bg-opacity-30 border border-red-300 rounded-lg p-3">
                            <div className="flex items-center">
                                <AlertTriangle size={16} className="mr-2 text-red-100" />
                                <span className="text-sm text-red-100">Your order was cancelled.</span>
                            </div>
                        </div>
                    )}
                    {order.currentStatus === 'delayed' && (
                        <div className="mt-4 bg-orange-600 bg-opacity-30 border border-orange-300 rounded-lg p-3">
                            <div className="flex items-center">
                                <AlertTriangle size={16} className="mr-2 text-orange-100" />
                                <span className="text-sm text-orange-100">We apologize for the delay. Your order is being prioritized.</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-5xl opacity-30">
                    {order.currentStatus === 'cancelled' || order.currentStatus === 'delayed' ? '⚠️' : '🚚'}
                </div>
            </div>
        </div>
    );
};

export default DeliveryTimeCard;