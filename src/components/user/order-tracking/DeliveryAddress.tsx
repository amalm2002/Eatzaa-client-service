import { DeliveryAddressProps } from '../../../interfaces/user/profile/order-tracking.types';
import { MapPin } from 'lucide-react';

const DeliveryAddress = ({ order }: DeliveryAddressProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Delivery Address</h2>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-teal-600 mt-1 flex-shrink-0" size={20} />
                <div className="text-gray-700 text-sm">{order.deliveryAddress}</div>
            </div>
        </div>
    );
};

export default DeliveryAddress;