import { Star,Clock,DollarSign } from 'lucide-react'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'


interface RestaurantCardProps {
    id?: string;
    name: string;
    image: string;
    rating: number;
    cuisine: string;
    deliveryTime: string;
    minimumOrder: string;
  }
  
  const RestaurantCard = ({
    id = "1", // Default ID if not provided
    name,
    image,
    rating,
    cuisine,
    deliveryTime,
    minimumOrder,
  }: RestaurantCardProps) => {
    return (
      <Link to={`/restaurant/${id}`} className="block">
        <div className="group rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="relative h-52 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary-dark flex items-center gap-1 px-2 py-1">
                <Star className="h-3 w-3 fill-accent stroke-accent" />
                {rating}
              </Badge>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-display font-medium text-lg text-primary-dark group-hover:text-accent transition-colors duration-300 mb-2">{name}</h3>
            
            <p className="text-sm text-gray-600 mb-4 font-medium">{cuisine}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-accent" />
                <span>{deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-accent" />
                <span>{minimumOrder}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  
  export default RestaurantCard;
  