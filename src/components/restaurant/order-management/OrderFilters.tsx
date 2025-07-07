import React from 'react';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import { OrderFiltersProps } from '../../../interfaces/restaurant/order/order.filters.types';
import { Order } from '../../../interfaces/restaurant/order/order.types';

const statusOptions = [
    { value: 'Pending', label: 'Order Received' },
    { value: 'Preparing', label: 'Preparing' },
    { value: 'Packed', label: 'Ready for Pickup' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
];

const OrderFilters: React.FC<OrderFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    itemsPerPage,
    setItemsPerPage,
    sortField,
    sortDirection,
    handleSort,
}) => {
    return (
        <div className="max-w-7xl mx-auto mb-8">
            <div className="gradient-border">
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Phone..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent filter-input text-sm bg-gray-50 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <select
                                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none filter-input text-sm bg-gray-50 transition-all duration-300 hover:bg-gray-100"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none filter-input text-sm bg-gray-50 transition-all duration-300 hover:bg-gray-100"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none filter-input text-sm bg-gray-50 transition-all duration-300 hover:bg-gray-100"
                                value={`${sortField}-${sortDirection}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split('-') as [keyof Order, 'asc' | 'desc'];
                                    handleSort(field);
                                    if (field === sortField) handleSort(field); 
                                }}
                            >
                                <option value="createdAt-desc">Sort by Date (Newest)</option>
                                <option value="createdAt-asc">Sort by Date (Oldest)</option>
                                <option value="totalAmount-desc">Sort by Amount (High to Low)</option>
                                <option value="totalAmount-asc">Sort by Amount (Low to High)</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderFilters;