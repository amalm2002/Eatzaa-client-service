import { RestaurantDetailsProps } from '../../../interfaces/user/profile/order-tracking.types';
import { MapPin } from 'lucide-react';

const RestaurantDetails = ({ order, staticData }: RestaurantDetailsProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🏪 Restaurant Details</h2>
            <div className="flex items-center space-x-4">
                <img
                    src={order.items[0]?.images[0] || staticData.restaurant.image}
                    alt={order.items[0]?.restaurantName || staticData.restaurant.name}
                    className="w-20 h-20 rounded-lg object-cover shadow-md"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{order.items[0]?.restaurantName || staticData.restaurant.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin size={16} className="mr-2 text-teal-600" />
                        {staticData.restaurant.address}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;