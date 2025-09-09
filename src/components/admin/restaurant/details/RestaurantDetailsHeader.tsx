import { Header } from "../../../../pages/A/header/header";
import { Check, X, Star, Clock } from 'lucide-react';
import { RestaurantDetailsHeaderProps } from "../../../../interfaces/admin/restaurants/restaurant-details.types";

const RestaurantDetailsHeader = ({ restaurant }: RestaurantDetailsHeaderProps) => {
  const getStatusBadge = () => {
    if (restaurant.isVerified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
          <Check className="w-4 h-4 mr-1" /> Verified
        </span>
      );
    } else if (restaurant.isRejected) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 shadow-sm">
          <X className="w-4 h-4 mr-1" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600 shadow-sm">
        <Clock className="w-4 h-4 mr-1" /> Pending
      </span>
    );
  };

  return (
    <>
      <Header />
      <div className="w-full h-64 md:h-80 lg:h-96 relative shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20"></div>
        </div>
        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 w-full max-w-7xl mx-auto">
            <div className="h-20 w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 bg-white rounded-xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-105 transition">
              <img
                src={restaurant.logo}
                alt={restaurant.restaurantName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
                    {restaurant.restaurantName}
                  </h1>
                  <p className="text-white/90 text-sm md:text-base font-medium">
                    {restaurant.cuisine?.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <div className="flex items-center gap-1 bg-white/90 text-gray-800 px-2 py-1 rounded-md shadow-md">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetailsHeader;