import { useNavigate } from 'react-router-dom';
import { DishGridProps } from '../../../interfaces/user/foodList/dish-grid.types';

const DishGrid = ({ dishes, cartItems, handleAddToCart }: DishGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <div
            key={dish._id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="relative">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className={`w-full h-52 object-cover cursor-pointer ${dish.quantity === 0 ? 'opacity-50' : ''}`}
                onClick={() => navigate(`/dish/${dish._id}`)}
              />
              {dish.quantity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gray-800 text-white text-lg font-bold px-4 py-2 rounded-md opacity-80">
                    Out of Stock
                  </span>
                </div>
              )}
              <div
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg text-xs font-semibold
                border border-opacity-30 backdrop-blur-sm
                transition-all duration-300
                animate-fade-in
                text-white
                bg-gradient-to-r
                from-green-500 to-green-600
                dark:from-green-600 dark:to-green-700
                ring-1 ring-green-400/50"
                style={{ display: dish.isOnline && dish.quantity > 0 ? 'flex' : 'none' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-xs">Opened</span>
              </div>
              <div
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg text-xs font-semibold
                border border-opacity-30 backdrop-blur-sm
                transition-all duration-300
                animate-fade-in
                text-white
                bg-gradient-to-r
                from-red-500 to-red-600
                dark:from-red-600 dark:to-red-700
                ring-1 ring-red-400/50"
                style={{ display: !dish.isOnline && dish.quantity > 0 ? 'flex' : 'none' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-xs">Closed</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <div className="text-white font-bold text-lg">{dish.discount}</div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    {dish.adFlag && (
                      <span className="inline-block text-xs text-gray-500 border border-gray-300 px-1 rounded mr-2">
                        Ad
                      </span>
                    )}
                    <h3
                      className="font-semibold text-base line-clamp-1 cursor-pointer"
                      onClick={() => navigate(`/dish/${dish._id}`)}
                    >
                      {dish.name}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{dish.restaurantName}</div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <div className="flex items-center bg-yellow-300 text-white px-1 py-0.5 rounded text-xs">
                      <span>{dish.rating}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                    </div>
                    <span className="mx-1">•</span>
                    <span>{dish.timing}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{dish.category}</div>
                  <div className="text-sm font-semibold text-gray-700 mt-1">₹{dish.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => handleAddToCart(dish)}
                  disabled={
                    !dish.isOnline ||
                    dish.quantity === 0 ||
                    cartItems.some((item) => item.menuId === dish._id)
                  }
                  className={`mt-2 px-4 py-2 rounded-md text-sm transition-colors ${!dish.isOnline
                      ? 'bg-red-400 text-white cursor-not-allowed'
                      : dish.quantity === 0
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : cartItems.some((item) => item.menuId === dish._id)
                          ? 'bg-gray-500 text-white cursor-not-allowed'
                          : 'bg-[rgb(60,110,113)] text-white hover:bg-[rgb(52,98,101)]'
                    }`}
                >
                  {!dish.isOnline
                    ? 'Unavailable'
                    : dish.quantity === 0
                      ? 'Out of Stock'
                      : cartItems.some((item) => item.menuId === dish._id)
                        ? 'In Cart'
                        : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishGrid;