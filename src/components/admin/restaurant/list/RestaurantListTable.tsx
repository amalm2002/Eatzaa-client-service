import { FiEye, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { RestaurantListTableProps, Restaurant } from '../../../../interfaces/admin/restaurants/restaurant.types';

const RestaurantListTable = ({
  restaurants,
  sortField,
  sortDirection,
  handleSort,
  handleView,
}: RestaurantListTableProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
            <tr>
              {[
                { field: 'name', label: 'Restaurant' },
                { field: 'owner', label: 'Owner' },
                { field: 'mobile', label: 'Contact' },
                { field: 'location', label: 'Location' },
                { field: 'status', label: 'Status' },
              ].map((header) => (
                <th
                  key={header.field}
                  className="px-8 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                  onClick={() => handleSort(header.field as keyof Restaurant)}
                >
                  <div className="flex items-center gap-2">
                    <span>{header.label}</span>
                    {sortField === header.field && (
                      sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restaurants.map((restaurant) => (
              <tr
                key={restaurant.id}
                className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
              >
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
                      {restaurant.image ? (
                        <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-orange-700 text-xl font-bold">{restaurant.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{restaurant.name}</div>
                      <div className="text-sm text-gray-600">
                        ★ {restaurant.rating} • {restaurant.totalOrders.toLocaleString()} Orders
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4 text-gray-700 font-medium">{restaurant.owner}</td>
                <td className="px-8 py-4 text-gray-700">{restaurant.mobile}</td>
                <td className="px-8 py-4 text-gray-700">{restaurant.location}</td>
                <td className="px-8 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleView(restaurant.id)}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                    >
                      <FiEye size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-full shadow-sm transform hover:scale-110 transition-all">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-100">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-orange-700 text-lg font-bold">{restaurant.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{restaurant.name}</div>
                  <div className="text-xs text-gray-600">★ {restaurant.rating}</div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
              <div>
                <div className="text-gray-500 text-xs font-medium">Owner</div>
                <div className="font-medium">{restaurant.owner}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium">Contact</div>
                <div className="font-medium">{restaurant.mobile}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-xs font-medium">Location</div>
                <div className="font-medium">{restaurant.location}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleView(restaurant.id)}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
              >
                View
              </button>
              <button className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantListTable;