import { Star, Clock, DollarSign, MapPin, Truck, Award, Percent } from 'lucide-react'
import { Badge } from '../../ui/Badge'
import { useState } from 'react'
import { RestaurantCardProps } from '../../../interfaces/user/home/restaurant-card.types'

const RestaurantCard = ({
  id = "1",
  name,
  restaurant,
  image,
  rating,
  cuisine,
  deliveryTime,
  minimumOrder,
  opened,
  distance = "2.5 km",
  promotion,
  featured = false,
  freeDelivery = false,
  tags = [],
  onClick,
}: RestaurantCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
     onClick={onClick}
      // className="block"
      className="group rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative h-full">
        {featured && (
          <div className="absolute top-0 left-0 w-full z-10 bg-gradient-to-r from-amber-500 to-amber-400 py-1 px-3 text-center">
            <span className="text-xs font-medium text-white flex items-center justify-center gap-1">
              <Award className="h-3 w-3" /> Featured Restaurant
            </span>
          </div>
        )}

        <div className={`relative ${featured ? 'h-48' : 'h-52'} overflow-hidden`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent" />

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary-dark flex items-center gap-1 px-2 py-1 font-medium">
              <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
              {rating}
            </Badge>

            {promotion && (
              <Badge variant="secondary" className="bg-red-500/90 text-white backdrop-blur-sm flex items-center gap-1 px-2 py-1 font-medium">
                <Percent className="h-3 w-3" />
                {promotion}
              </Badge>
            )}
          </div>

          {freeDelivery && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-1 px-2 py-1 text-xs">
                <Truck className="h-3 w-3" />
                Free Delivery
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-display font-semibold text-xl text-primary-dark group-hover:text-accent transition-colors duration-300 mb-1">
              {name}
            </h3>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">{restaurant}</p>
              <Badge
                className={`text-xs font-semibold px-2 py-1 rounded 
        ${opened ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {opened ? 'Opened' : 'Closed'}
              </Badge>
            </div>
          </div>


          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-100">
              {cuisine}
            </Badge>
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-100">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div className={`flex items-center gap-2 p-2 rounded-md ${isHovered ? 'bg-gray-50' : ''} transition-colors duration-300`}>
              <div className="bg-amber-100 p-1.5 rounded-full">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Delivery</p>
                <p className="font-medium text-gray-700">{deliveryTime}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-md ${isHovered ? 'bg-gray-50' : ''} transition-colors duration-300`}>
              <div className="bg-blue-100 p-1.5 rounded-full">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Min Order</p>
                <p className="font-medium text-gray-700">{minimumOrder}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-md ${isHovered ? 'bg-gray-50' : ''} transition-colors duration-300`}>
              <div className="bg-green-100 p-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-medium text-gray-700">{distance}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-2 rounded-md ${isHovered ? 'bg-gray-50' : ''} transition-colors duration-300`}>
              <div className="bg-purple-100 p-1.5 rounded-full">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <p className="font-medium text-gray-700">{rating}/5</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between items-center text-sm text-gray-500">
            <span className="text-xs">
              {featured ? '⚡ Popular choice in your area' : 'Order now'}
            </span>
            <Badge className="bg-accent hover:bg-accent/90 text-white">
              View Menu
            </Badge>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;