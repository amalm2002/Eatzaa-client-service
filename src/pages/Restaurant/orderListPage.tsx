import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import createAxios from '../../service/axious-services/restaurantAxious';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import Header from './navbar/header';
import Sidebar from './navbar/sidebar';
// import OrderFilters from '../../components/restaurant/order-management/OrderFilters';
import OrderCard from '../../components/restaurant/order-management/OrderCard';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/restaurant/order-management/EmptyState';
import { Order } from '../../interfaces/restaurant/order/order.types';
import { restaurantApi } from '../../api/endpoints/restaurantApi';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeMenu, setActiveMenu] = useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) return;
      try {
        setLoading(true);
        const transformedOrders = await restaurantApi.fetchOrders(dispatch, restaurantId);
        
        setOrders(transformedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantId]);

  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders: Order[] = useMemo(() => {
    return orders
      .filter(
        (order) =>
          (statusFilter === 'all' || order.orderStatus === statusFilter) &&
          (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phoneNumber.includes(searchTerm))
      )
      .sort((a, b) => {
        if (sortField === 'totalAmount') {
          return sortDirection === 'asc'
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        } else {
          const aValue = String(a[sortField]).toLowerCase();
          const bValue = String(b[sortField]).toLowerCase();
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
  }, [orders, statusFilter, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
            .card-hover {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
            }
            .filter-input {
              transition: all 0.3s ease;
            }
            .filter-input:focus {
              box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
            }
            .gradient-border {
              position: relative;
              background: linear-gradient(to right, #6366f1, #a855f7);
              padding: 2px;
              border-radius: 1rem;
            }
            .gradient-border > div {
              background: white;
              border-radius: 0.875rem;
            }
          `}
      </style>
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />
      <Header
        isOnline={isOnline}
        handleToggleOnline={handleToggleOnline}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
        {/* <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        /> */}
        <div className="space-y-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Loading Your Orders...</h3>
              <p className="text-gray-600 mt-2">Fetching the latest orders for your restaurant.</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <EmptyState />
          ) : (
            paginatedOrders.map((order) => (
              <OrderCard key={order._id} order={order} axiosInstance={axiosInstance} setOrders={setOrders} />
            ))
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default OrderList;