import { FiEye, FiLock, FiUnlock, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { DeliveryBoyListTableProps, DeliveryBoy } from '../../../../interfaces/admin/delivery-boys/delivery-boy.types';

const DeliveryBoyListTable = ({ paginatedDeliveryBoys, handleView, handleBlockUnblock, sortField, sortDirection, handleSort }: DeliveryBoyListTableProps) => {
  return (
    <div className="hidden md:block">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
          <tr>
            {[
              { field: 'name', label: 'Delivery Boy' },
              { field: 'email', label: 'Email' },
              { field: 'mobile', label: 'Contact' },
              { field: 'location', label: 'Location' },
              { field: 'status', label: 'Status' },
            ].map((header) => (
              <th
                key={header.field}
                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                onClick={() => handleSort(header.field as keyof DeliveryBoy)}
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
          {paginatedDeliveryBoys.map((boy) => (
            <tr
              key={boy.id}
              className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
            >
              <td className="px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
                    {boy.image ? (
                      <img src={boy.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-orange-700 text-xl font-bold">{boy.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{boy.name}</div>
                    <div className="text-sm text-gray-600">
                      {boy.totalDeliveries.toLocaleString()} Deliveries
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-4 text-gray-700 font-medium">{boy.email}</td>
              <td className="px-8 py-4 text-gray-700">{boy.mobile}</td>
              <td className="px-8 py-4 text-gray-700">{boy.location}</td>
              <td className="px-8 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${boy.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {boy.status.charAt(0).toUpperCase() + boy.status.slice(1)}
                </span>
              </td>
              <td className="px-8 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleView(boy.id)}
                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                  >
                    <FiEye size={20} />
                  </button>
                  <button
                    onClick={() => handleBlockUnblock(boy.id, boy.isActive)}
                    className={`p-2 ${boy.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} rounded-full shadow-sm transform hover:scale-110 transition-all`}
                  >
                    {boy.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryBoyListTable;