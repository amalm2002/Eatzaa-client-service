import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import Header from './navbar/header';
import Sidebar from './navbar/sidebar';
import OrderCard from '../../components/restaurant/order-management/OrderCard';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/restaurant/order-management/EmptyState';
import { Order } from '../../interfaces/restaurant/order/order.types';
import { restaurantApi } from '../../api/endpoints/restaurantApi';
import { createAxiosInstance } from '../../service/axious-services/axiosInstance';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeMenu, setActiveMenu] = useState('Orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [itemsPerPage] = useState(4); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance('Restaurant', dispatch);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) return;
      try {
        setLoading(true);
        const response = await restaurantApi.fetchOrders(dispatch, restaurantId, currentPage, itemsPerPage);
        console.log('response:', response);

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch orders');
        }

        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders.');
        setOrders([]);
        setTotalPages(1);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [restaurantId, currentPage, itemsPerPage, dispatch]);

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
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order) => (
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