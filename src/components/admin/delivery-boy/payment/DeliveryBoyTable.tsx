import { FiPhone, FiTruck, FiEye, FiDollarSign, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { DeliveryBoy, getStatusColor, formatDate, isPayButtonEnabled,isAlreadyPaid } from '../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types';

interface DeliveryBoysTableProps {
    deliveryBoys: DeliveryBoy[];
    sortField: keyof DeliveryBoy;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof DeliveryBoy) => void;
    loading: boolean;
    processingPayment: string | null;
    paginatedDeliveryBoys: DeliveryBoy[];
    setSelectedDeliveryBoy: (deliveryBoy: DeliveryBoy | null) => void;
    handlePayDeliveryBoy: (deliveryBoyId: string, totalCash: number) => void;
}

const DeliveryBoysTable: React.FC<DeliveryBoysTableProps> = ({
    deliveryBoys,
    sortField,
    sortDirection,
    handleSort,
    loading,
    processingPayment,
    paginatedDeliveryBoys,
    setSelectedDeliveryBoy,
    handlePayDeliveryBoy,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            {[
                                { field: 'name', label: 'Delivery Boy' },
                                { field: 'weeklyEarnings', label: 'Weekly Earnings' },
                                { field: 'inHandCash', label: 'In-Hand Cash' },
                                { field: 'totalCash', label: 'Total Cash' },
                                { field: 'amountToPayDeliveryBoy', label: 'Owed to Admin' },
                                { field: 'ordersCompleted', label: 'Orders' },
                                { field: 'nextPaymentDate', label: 'Next Payment' },
                                { field: 'status', label: 'Status' },
                            ].map((header) => (
                                <th
                                    key={header.field}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
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
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-gray-600">
                                    Loading...
                                </td>
                            </tr>
                        ) : paginatedDeliveryBoys.length > 0 ? (
                            paginatedDeliveryBoys.map((deliveryBoy) => (
                                <tr
                                    key={deliveryBoy.id}
                                    className="hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                                                {deliveryBoy.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{deliveryBoy.name}</div>
                                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                                    <FiPhone size={12} />
                                                    {deliveryBoy.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">₹{deliveryBoy.weeklyEarnings.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-700">₹{deliveryBoy.inHandCash.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">₹{deliveryBoy.totalCash.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-700">₹{deliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FiTruck className="text-gray-600" size={16} />
                                            <span className="font-semibold text-gray-900">{deliveryBoy.ordersCompleted}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-700">{formatDate(deliveryBoy.nextPaymentDate)}</div>
                                        <div className="text-xs text-gray-600">Monthly payout</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(deliveryBoy.status)}`}
                                        >
                                            {deliveryBoy.status.charAt(0).toUpperCase() + deliveryBoy.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                                                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full shadow-sm transform hover:scale-110 transition-all"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handlePayDeliveryBoy(deliveryBoy.id, deliveryBoy.totalCash)}
                                                disabled={deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id || !isPayButtonEnabled(deliveryBoy.nextPaymentDate)}
                                                className={`px-3 py-1 rounded-lg shadow-sm transform transition-all flex items-center gap-1 text-sm
                                               ${(deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id || !isPayButtonEnabled(deliveryBoy.nextPaymentDate))
                                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                        : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                                                    }`}
                                            >
                                                {/* <FiDollarSign size={14} /> */}
                                                <span>{processingPayment === deliveryBoy.id ? 'Processing...' : 'Pay'}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-gray-600">
                                    No delivery boys found matching your filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-600">Loading...</div>
                ) : paginatedDeliveryBoys.length > 0 ? (
                    paginatedDeliveryBoys.map((deliveryBoy) => (
                        <div
                            key={deliveryBoy.id}
                            className="p-5 border-b border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                                        {deliveryBoy.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{deliveryBoy.name}</div>
                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                            <FiPhone size={12} />
                                            {deliveryBoy.phone}
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(deliveryBoy.status)}`}
                                >
                                    {deliveryBoy.status.charAt(0).toUpperCase() + deliveryBoy.status.slice(1)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div>
                                    <div className="text-gray-600 text-xs font-medium">Weekly Earnings</div>
                                    <div className="font-semibold text-gray-900">₹{deliveryBoy.weeklyEarnings.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-xs font-medium">In-Hand Cash</div>
                                    <div className="font-semibold text-gray-700">₹{deliveryBoy.inHandCash.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-xs font-medium">Total Cash</div>
                                    <div className="font-semibold text-gray-900">₹{deliveryBoy.totalCash.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-xs font-medium">Owed to Admin</div>
                                    <div className="font-semibold text-gray-700">₹{deliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-xs font-medium">Orders Completed</div>
                                    <div className="flex items-center gap-1">
                                        <FiTruck className="text-gray-600" size={14} />
                                        <span className="font-semibold text-gray-900">{deliveryBoy.ordersCompleted}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-gray-600 text-xs font-medium">Next Payment Date</div>
                                <div className="text-gray-700">{formatDate(deliveryBoy.nextPaymentDate)}</div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <FiEye size={16} />
                                    <span>Details</span>
                                </button>
                                <button
                                    onClick={() => handlePayDeliveryBoy(deliveryBoy.id, deliveryBoy.totalCash)}
                                    disabled={deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id || !isPayButtonEnabled(deliveryBoy.nextPaymentDate)}
                                    className={`px-4 py-2 rounded-lg shadow-sm transform transition-all flex items-center gap-2
                    ${(deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id || !isPayButtonEnabled(deliveryBoy.nextPaymentDate))
                                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                            : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                                        }`}
                                >
                                    <FiDollarSign size={16} />
                                    <span>{processingPayment === deliveryBoy.id ? 'Processing...' : 'Pay Now'}</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-600">No delivery boys found matching your filters</div>
                )}
            </div>
        </div>
    );
};

export default DeliveryBoysTable;