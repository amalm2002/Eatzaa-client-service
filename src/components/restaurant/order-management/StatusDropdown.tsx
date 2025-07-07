import React from 'react';
import { FiClock, FiPackage } from 'react-icons/fi';
import { toast } from 'sonner';
import { StatusDropdownProps } from '../../../interfaces/restaurant/order/status-dropdown.types';
import { restaurantApi } from '../../../api/endpoints/restaurantApi';
import { useDispatch } from 'react-redux';

const statusOptions = [
    { value: 'Pending', label: 'Order Received', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800', icon: FiClock },
    { value: 'Preparing', label: 'Preparing', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800', icon: FiPackage },
    { value: 'Packed', label: 'Ready for Pickup', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800', icon: FiPackage },
];

const StatusDropdown: React.FC<StatusDropdownProps> = ({
    order,
    axiosInstance,
    setOrders,
    isOpen,
    setIsOpen,
}) => {
    const dispatch = useDispatch()
    const isStatusChangeAllowed = (currentStatus: string, newStatus: string): boolean => {
        if (['Delivered', 'Cancelled'].includes(currentStatus)) {
            return false;
        }
        const allowedTransitions: any = {
            Pending: ['Preparing', 'Packed'],
            Preparing: ['Packed'],
            Packed: [],
        };
        return allowedTransitions[currentStatus]?.includes(newStatus) || false;
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!isStatusChangeAllowed(order.orderStatus, newStatus)) {
            toast.error(`Cannot change status from ${order.orderStatus} to ${newStatus}.`);
            return;
        }
        try {
            const response = await restaurantApi.updateOrderStatus(dispatch, order._id, newStatus);

            setOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o._id === order._id ? { ...o, orderStatus: response.orderStatus } : o
                )
            );
            toast.success(`Order status updated to ${newStatus}.`);
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status.');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    if (['Delivered', 'Cancelled'].includes(order.orderStatus)) {
                        toast.error('Cannot change status for Delivered or Cancelled orders.');
                        return;
                    }
                    setIsOpen(!isOpen);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${['Delivered', 'Cancelled'].includes(order.orderStatus)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md'
                    }`}
                disabled={['Delivered', 'Cancelled'].includes(order.orderStatus)}
            >
                Change Status
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden">
                    <div className="p-2">
                        {statusOptions.map((status) => {
                            const isDisabled = !isStatusChangeAllowed(order.orderStatus, status.value);
                            const StatusIcon = status.icon;
                            return (
                                <button
                                    key={status.value}
                                    onClick={() => handleStatusChange(status.value)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ${isDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : `${status.color} hover:bg-opacity-80`
                                        }`}
                                    disabled={isDisabled}
                                >
                                    <StatusIcon size={16} />
                                    {status.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;