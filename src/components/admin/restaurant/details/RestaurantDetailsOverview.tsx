import { Info, Clock, Utensils, AlertCircle } from 'lucide-react';
import { RestaurantDetailsOverviewProps } from '../../../../interfaces/admin/restaurants/restaurant-details.types';

const RestaurantDetailsOverview = ({ restaurant }: RestaurantDetailsOverviewProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-orange-600" />
          About Restaurant
        </h2>
        <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            { icon: Clock, title: 'Hours', value: restaurant.openingHours },
            { icon: Utensils, title: 'Cuisine', value: restaurant.cuisine?.join(', ') },
            { icon: Clock, title: 'Avg. Delivery Time', value: restaurant.avgDeliveryTime },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <item.icon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {restaurant.isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Rejection Reason</h3>
              <p className="text-sm text-red-700 mt-1">{restaurant.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsOverview;