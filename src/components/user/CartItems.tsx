import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItemType } from '../../pages/User/userCart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleIncrease = () => {

    const newQty = localQty + 1;

    setLocalQty(newQty);
    onUpdateQuantity(item.id, newQty);

  };

  const handleDecrease = () => {
    const newQty = localQty - 1;
    if (newQty >= 0) {
      setLocalQty(newQty);
      onUpdateQuantity(item.id, newQty);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Image Section */}
          <div className="relative flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            />
            <span
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${item.isVeg
                  ? 'bg-green-500'
                  : 'bg-red-500'
                }`}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {item.restaurant}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">
              {item.description}
            </p>

            {/* Bottom Row - Price and Quantity */}
            <div className="flex justify-between items-center">
              {/* Price Section */}
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  ₹{item.price}
                </span>
                {localQty > 1 && (
                  <span className="text-sm text-gray-600">
                    Total: ₹{item.price * localQty}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={handleDecrease}
                  disabled={localQty <= 1}
                  className={`p-2 rounded-l-lg transition-colors ${localQty <= 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                <span className="px-3 py-2 text-sm font-semibold text-gray-900 min-w-[2.5rem] text-center">
                  {localQty}
                </span>

                <button
                  onClick={handleIncrease}
                  disabled={localQty >= item.maxAvailableQty}
                  className={`p-2 rounded-r-lg transition-colors ${localQty >= item.maxAvailableQty
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CartItem;
