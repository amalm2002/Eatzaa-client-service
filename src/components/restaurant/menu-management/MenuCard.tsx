import { motion } from 'framer-motion';
import { MenuCardProps } from '../../../interfaces/restaurant/menu/menu-card.types';
import { Variant } from '../../../interfaces/restaurant/menu/menu.types';

const MenuCard: React.FC<MenuCardProps> = ({ item, handleEdit, handleToggleActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 bg-white rounded-xl shadow-lg mb-4 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
            {item.images[0] ? (
              <img src={item.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#6589f6] text-xl font-bold">{item.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">{item.name}</div>
            <div className="text-sm text-gray-500">{item.description.slice(0, 50)}...</div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${item.category === 'veg'
              ? 'bg-green-100 text-green-800'
              : item.category === 'non-veg'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
        >
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
        <div>
          <div className="text-gray-500 text-xs font-medium">Price</div>
          <div className="font-medium">₹{item.price.toFixed(2)}</div>
          {item.hasVariants && item.variants.length > 0 && (
            <table className="mt-2 w-full border-t border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">Variant</th>
                  <th className="px-2 py-1 text-left text-xs font-semibold text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {item.variants.map((variant: Variant, index: number) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-2 py-1 text-sm">{variant.name}</td>
                    <td className="px-2 py-1 text-sm">₹{variant.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <div className="text-gray-500 text-xs font-medium">Quantity</div>
          <div className="font-medium">{item.quantity}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs font-medium">Status</div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {item.isActive ? 'Active' : 'Blocked'}
          </span>
        </div>
        <div>
          <div className="text-gray-500 text-xs font-medium">Timing</div>
          <div className="font-medium">{item.timing || 'Anytime'}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleEdit(item._id)}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300"
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToggleActive(item._id, item.isActive)}
          className={`flex-1 py-2 ${item.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white rounded-lg shadow-md transition-all duration-300`}
        >
          {item.isActive ? 'Block' : 'Unblock'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MenuCard;