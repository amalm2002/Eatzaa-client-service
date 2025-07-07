import { FiEye, FiDownload, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { PaymentListTableProps, Payment } from '../../../../interfaces/admin/restaurants/restaurant-payments.types';

const PaymentListTable = ({
  paginatedPayments,
  sortField,
  sortDirection,
  handleSort,
  handleView,
  formatDate,
  getStatusColor,
}: PaymentListTableProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
            <tr>
              {[
                { field: 'restaurantName', label: 'Restaurant' },
                { field: 'amount', label: 'Amount' },
                { field: 'status', label: 'Status' },
                { field: 'subscriptionName', label: 'Plan' },
                { field: 'createdAt', label: 'Payment Date' },
                { field: 'expireAt', label: 'Expiry Date' },
              ].map((header) => (
                <th
                  key={header.field}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                  onClick={() => handleSort(header.field as keyof Payment)}
                >
                  <div className="flex items-center gap-2">
                    <span>{header.label}</span>
                    {sortField === header.field && (
                      sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{payment.restaurantName}</div>
                    <div className="text-xs text-gray-600 mt-1">Order: {payment.razorpayOrderId.slice(0, 10)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{payment.currency} {payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(payment.status)}`}
                    >
                      {payment.status === 'created' ? 'Pending' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{payment.subscriptionName}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(payment.createdAt)}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className={payment.isActive ? 'text-gray-700' : 'text-red-600 font-medium'}>
                      {formatDate(payment.expireAt)}
                      {!payment.isActive && <span className="block text-xs mt-1">(Expired)</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleView(payment.id)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                      >
                        <FiEye size={20} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full shadow-sm transform hover:scale-110 transition-all">
                        <FiDownload size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No payment records found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile View */}
      <div className="md:hidden">
        {paginatedPayments.length > 0 ? (
          paginatedPayments.map((payment) => (
            <div
              key={payment.id}
              className="p-5 border-b border-gray-100 hover:bg-orange-50/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold text-gray-900">{payment.restaurantName}</div>
                  <div className="text-xs text-gray-600 mt-1">{payment.subscriptionName}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(payment.status)}`}
                >
                  {payment.status === 'created' ? 'Pending' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <div className="text-gray-500 text-xs font-medium">Amount</div>
                  <div className="font-semibold text-gray-900">{payment.currency} {payment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Payment Date</div>
                  <div className="text-gray-700">{formatDate(payment.createdAt)}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Order ID</div>
                  <div className="text-gray-700 text-xs">{payment.razorpayOrderId.slice(0, 15)}...</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-medium">Expiry Date</div>
                  <div className={payment.isActive ? 'text-gray-700' : 'text-red-600 font-medium'}>
                    {formatDate(payment.expireAt)}
                    {!payment.isActive && <span className="text-xs">(Expired)</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleView(payment.id)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FiEye size={16} />
                  <span>Details</span>
                </button>
                <button className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transform hover:scale-105 transition-all">
                  <FiDownload size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No payment records found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentListTable;