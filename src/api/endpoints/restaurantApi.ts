import { Dispatch } from 'redux';
import { FormData } from "../../interfaces/restaurant/authentication/register/form-data.types";
import { Variant } from '../../interfaces/restaurant/menu/variant.types';
import { Order } from '../../interfaces/restaurant/order/order.types';
import { Plan } from '../../interfaces/restaurant/subscription/plan.types';
import { Transaction } from "../../interfaces/restaurant/transaction/transaction-details.types";
import { createAxiosInstance } from '../../service/axious-services/axiosInstance';


// Centralized API service for restaurant-related calls
export const restaurantApi = {

    restaurantLogin: async (dispatch: Dispatch, formData: { email: string; mobile: string }) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurant-login', formData);
        return response.data;
    },

    resubmitRestaurantDocuments: async (
        dispatch: Dispatch,
        restaurantId: string,
        formData: any
    ) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/resubmit-restaurant-docs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to resubmit documents');
        }
        return response.data;
    },

    checkRestaurant: async (dispatch: Dispatch, formData: { email: string; mobile: string }) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurant-checking', formData);
        return response.data;
    },

    registerRestaurant: async (
        dispatch: Dispatch,
        data: { otp: string; otpToken: string | null; formData: FormData }
    ) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurant-register', data);
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    },

    resendRestaurantOtp: async (dispatch: Dispatch, formData: FormData) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurant-otp-resend', { formData });
        return response.data;
    },

    submitRestaurantDocuments: async (dispatch: Dispatch, formData: any) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurant-documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.message !== 'Success') {
            throw new Error(response.data.error || 'Failed to submit documents.');
        }
        return response.data;
    },

    submitRestaurantLocation: async (
        dispatch: Dispatch,
        restaurantId: string,
        locationData: { latitude: number; longitude: number }
    ) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post(
            `/location?restaurantId=${restaurantId}`,
            locationData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (!response.data?.success) {
            throw new Error(response.data?.message || 'Something went wrong, please try again.');
        }
        return response.data;
    },

    submitMenuItem: async (dispatch: Dispatch, formData: any) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/menu-items', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data === 'Menu item already exists') {
            throw new Error('Menu item already exists');
        }
        return response.data;
    },

    fetchExistingVariants: async (dispatch: Dispatch): Promise<Variant[]> => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get('/variants');
        return response.data;
    },

    fetchMenuItem: async (dispatch: Dispatch, menuItemId: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/menu-item/${menuItemId}`);
        if (!response.data) {
            throw new Error('No menu item data found in response');
        }
        return response.data;
    },

    updateMenuItem: async (dispatch: Dispatch, menuItemId: string, formData: FormData) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.put(`/edit-menu-item/${menuItemId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    fetchMenuItems: async (dispatch: Dispatch, restaurantId: string, searchTerm?: string, categoryFilter?: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const queryParams = new URLSearchParams();

        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        if (categoryFilter && categoryFilter !== 'all') {
            queryParams.append('category', categoryFilter);
        }

        const response = await axiosInstance.get(`/all-menus/${restaurantId}?${queryParams.toString()}`);
        console.log('response api side :', response);

        return response.data;
    },

    toggleMenuItemActive: async (dispatch: Dispatch, menuItemId: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.patch(`/menu/${menuItemId}`);
        return response.data;
    },

    fetchOrders: async (dispatch: Dispatch, restaurantId: string): Promise<Order[]> => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/orders/${restaurantId}`);
        return response.data.data.map((order: any) => ({
            ...order,
            orderId: order._id,
            items: order.items.map((item: any) => ({
                foodId: item.foodId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: item.category,
                description: item.description,
                images: item.images || [],
                hasVariants: item.hasVariants,
                variants: item.variants || [],
                restaurantId: item.restaurantId,
                restaurantName: item.restaurantName,
            })),
        }));
    },

    fetchDashboardStats: async (dispatch: Dispatch, restaurantId: string, params: { period: string; startDate?: string; endDate?: string }) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/dashboard-stats/${restaurantId}`, { params });
        return response.data;
    },

    getTheCustomers: async (dispatch: Dispatch, data: { userId: string[] }) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/customers', data)
        return response.data
    },

    updateOrderStatus: async (dispatch: Dispatch, orderId: string, orderStatus: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.patch(`/order/status/${orderId}`, {
            orderStatus,
        });
        return response.data;
    },

    fetchSubscriptionPlans: async (dispatch: Dispatch): Promise<Plan[]> => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get('/get-all-plans');
        if (response.data.message !== 'success') {
            throw new Error('Failed to load subscription plans');
        }
        return response.data.response.map((plan: any) => ({
            id: plan._id,
            name: plan.name,
            price: `₹${plan.price}`,
            period: plan.period,
            description: plan.description,
            features: plan.features || [],
            popular: plan.popular || false,
        }));
    },

    checkPlanExistence: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/check-plan-exist/${restaurantId}`);
        return response.data;
    },

    initiateSubscriptionPayment: async (dispatch: Dispatch, payload: { amount: string; planId: string; restaurantId: string }) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurnt/subscription-plan', payload);
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    },

    verifyPayment: async (
        dispatch: Dispatch,
        payload: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
            planId: string;
            restaurantId: string;
        }
    ) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurnt-verify-payment', payload);
        return response.data;
    },

    logPaymentFailure: async (
        dispatch: Dispatch,
        payload: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            error_code: string;
            error_description: string;
            planId: string;
            restaurantId: string;
        }
    ) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.post('/restaurnt-payment-failed', payload);
        return response.data;
    },

    fetchTransactionDetails: async (dispatch: Dispatch, transactionId: string): Promise<Transaction> => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/payment/details/${transactionId}`);
        return {
            ...response.data,
            subscriptionPlan: {
                name: response.data.subscriptionPlanId?.name || "Unknown Plan",
                period: response.data.subscriptionPlanId?.period || "Unknown period",
            },
            subscriptionId: response.data.subscriptionPlanId?._id || response.data.subscriptionPlanId,
            restaurantId: response.data.restaurantId,
            amount: response.data.amount,
            status: response.data.status,
        };
    },

    fetchTransactionHistory: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxiosInstance('Restaurant', dispatch);
        const response = await axiosInstance.get(`/payment/history/${restaurantId}`);
        return response.data.map((item: any) => ({
            _id: item._id,
            restaurantId: item.restaurantId,
            subscriptionId: item.subscriptionPlanId._id,
            amount: item.amount,
            currency: item.currency,
            razorpayOrderId: item.razorpayOrderId,
            razorpayPaymentId: item.razorpayPaymentId || undefined,
            razorpaySignature: item.razorpaySignature || undefined,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            subscriptionPlan: item.subscriptionPlanId || { name: "Unknown Plan", period: "unknown" },
            expireAt: item.expireAt,
        }));

    },
};