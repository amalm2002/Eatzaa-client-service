import { FiChevronDown, FiChevronUp, FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { MenuTableProps } from '../../../interfaces/restaurant/menu/menu-table.types';
import { Variant } from '../../../interfaces/restaurant/menu/menu.types';

const MenuTable: React.FC<MenuTableProps> = ({
    paginatedItems,
    sortField,
    sortDirection,
    handleSort,
    handleEdit,
    handleToggleActive,
}) => {
    return (
        <div className="hidden md:block">
            <table className="w-full">
                <thead className="bg-[#6589f6] text-white">
                    <tr>
                        {[
                            { field: 'name' as const, label: 'Item' },
                            { field: 'category' as const, label: 'Category' },
                            { field: 'price' as const, label: 'Price' },
                            { field: 'quantity' as const, label: 'Quantity' },
                            { field: 'timing' as const, label: 'Timing' },
                            { field: 'isActive' as const, label: 'Status' },
                        ].map((header) => (
                            <th
                                key={header.field}
                                className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-[#5570d1] transition-colors duration-300"
                                onClick={() => handleSort(header.field)}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{header.label}</span>
                                    {sortField === header.field &&
                                        (sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
                                </div>
                            </th>
                        ))}
                        <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {paginatedItems.map((item, index) => (
                        <motion.tr
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="hover:bg-gray-50 transition-all duration-200"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                                        {item.images[0] ? (
                                            <img src={item.images[0]} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-[#6589f6] text-lg font-bold">{item.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">{item.description.slice(0, 50)}...</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${item.category === 'veg'
                                        ? 'bg-green-100 text-green-800'
                                        : item.category === 'non-veg'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                                <div>
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
                            </td>
                            <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                            <td className="px-6 py-4 text-gray-700">{item.timing || 'Anytime'}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {item.isActive ? 'Active' : 'Blocked'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(item._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full shadow-sm transition-all duration-200"
                                        title="Edit"
                                    >
                                        <FiEdit size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleToggleActive(item._id, item.isActive)}
                                        className={`p-2 ${item.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                                            } rounded-full shadow-sm transition-all duration-200`}
                                        title={item.isActive ? 'Block' : 'Unblock'}
                                    >
                                        {item.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
                                    </motion.button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuTable;