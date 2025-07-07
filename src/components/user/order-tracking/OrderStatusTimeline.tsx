import { OrderStatusTimelineProps } from '../../../interfaces/user/profile/order-tracking.types';
import { Clock } from 'lucide-react';

const OrderStatusTimeline = ({ order, orderStatuses }: OrderStatusTimelineProps) => {
    const getStatusIndex = (status: string) => {
        return orderStatuses.findIndex((s) => s.id === status);
    };

    const currentStatusIndex = getStatusIndex(order.currentStatus);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                Order Status
            </h2>
            <div className="text-right">
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-mono text-teal-600 font-semibold">{order.orderId.slice(-6).toUpperCase()}</div>
            </div>
            <div className="space-y-6 mt-4">
                {orderStatuses.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StatusIcon = status.icon;

                    return (
                        <div key={status.id} className="relative flex items-start space-x-4">
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'
                                    } ${isCurrent ? 'animate-pulse shadow-teal-200 shadow-lg' : ''}`}
                            >
                                <StatusIcon size={18} />
                            </div>
                            <div className="flex-1 pb-6">
                                <div className={`font-semibold text-lg ${isCompleted ? 'text-teal-600' : 'text-gray-400'}`}>
                                    {status.label}
                                </div>
                                <div className="text-gray-600 text-sm mt-1">{status.desc}</div>
                                {status.time && (
                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {status.time}
                                    </div>
                                )}
                                {isCurrent && (
                                    <div
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${status.id === 'cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : status.id === 'delayed'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-teal-100 text-teal-800'
                                            }`}
                                    >
                                        Current Status
                                    </div>
                                )}
                            </div>
                            {index < orderStatuses.length - 1 && (
                                <div
                                    className={`absolute left-5 top-10 w-0.5 h-12 transition-all duration-300 ${isCompleted ? 'bg-teal-600' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTimeline;