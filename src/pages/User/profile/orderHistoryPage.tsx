import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../../components/user/order-history/OrderCard';
import Pagination from '../../../components/user/order-history/Pagination';
import { OrderItem } from '../../../interfaces/user/profile/order-tracking.types';
import { Order, OrderHistoryProps } from '../../../interfaces/user/profile/order-history.types';
import { userApi } from '../../../api/endpoints/userApi';

const OrderHistory: React.FC<OrderHistoryProps> = ({ tealColor = '#2C938C' }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 2;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderData = await userApi.getUserOrders(dispatch, userId);

                const enrichedOrders: Order[] = orderData.map((order: any) => {
                    const enrichedItems: OrderItem[] = order.items.map((item: any) => ({
                        foodId: item.foodId,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        quantity: item.quantity,
                        images: item.images || ['/api/placeholder/150/150'],
                        restaurantId: item.restaurantId,
                        restaurantName: item.restaurantName,
                        category: item.category,
                        hasVariants: item.hasVariants,
                        variants: item.variants || [],
                    }));

                    return {
                        id: order._id,
                        restaurantName: enrichedItems[0]?.restaurantName || 'Unknown Restaurant',
                        date: order.createdAt,
                        status: order.orderStatus,
                        total: order.totalAmount,
                        items: enrichedItems,
                    };
                });

                setOrders(enrichedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders.');
                setOrders([]);
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const handleViewOrderDetails = (orderId: string) => {
        navigate(`/order-details-page/${orderId}`);
        toast.info(`Order ${orderId} details would be shown here.`);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: tealColor }}></div>
            </div>
        );
    }
    return (
        <div className="space-y-6 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                    <p className="text-gray-500 text-base">No orders yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Your past orders will appear here.</p>
                </div>
            ) : (
                <>
                    {currentOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            tealColor={tealColor}
                            handleViewOrderDetails={handleViewOrderDetails}
                        />
                    ))}
                    {orders.length > ordersPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            tealColor={tealColor}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default OrderHistory;