import { Dispatch } from 'redux';
import createAxios from '../../service/axious-services/restaurantAxious';
import { FormData } from "../../interfaces/restaurant/authentication/register/form-data.types";
import { Variant } from '../../interfaces/restaurant/menu/variant.types';
import { Order } from '../../interfaces/restaurant/order/order.types';
import { Plan } from '../../interfaces/restaurant/subscription/plan.types';
import { Transaction } from "../../interfaces/restaurant/transaction/transaction-details.types";



// Centralized API service for restaurant-related calls
export const restaurantApi = {

    restaurantLogin: async (dispatch: Dispatch, formData: { email: string; mobile: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurant-login', formData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    },

    resubmitRestaurantDocuments: async (
        dispatch: Dispatch,
        restaurantId: string,
        formData: any
    ) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/resubmit-restaurant-docs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to resubmit documents');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to resubmit documents');
        }
    },

    checkRestaurant: async (dispatch: Dispatch, formData: { email: string; mobile: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurant-checking', formData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error: Server issue');
        }
    },

    registerRestaurant: async (
        dispatch: Dispatch,
        data: { otp: string; otpToken: string | null; formData: FormData }
    ) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurant-register', data);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
    },

    resendRestaurantOtp: async (dispatch: Dispatch, formData: FormData) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurant-otp-resend', { formData });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'OTP resend failed');
        }
    },

    submitRestaurantDocuments: async (dispatch: Dispatch, formData: any) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurant-documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.message !== 'Success') {
                throw new Error(response.data.error || 'Failed to submit documents.');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred while submitting documents.');
        }
    },

    submitRestaurantLocation: async (
        dispatch: Dispatch,
        restaurantId: string,
        locationData: { latitude: number; longitude: number }
    ) => {
        const axiosInstance = createAxios(dispatch);
        try {
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'Failed to submit location.');
        }
    },

    submitMenuItem: async (dispatch: Dispatch, formData: any) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/menu-items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data === 'Menu item already exists') {
                throw new Error('Menu item already exists');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to save menu item.');
        }
    },

    fetchExistingVariants: async (dispatch: Dispatch): Promise<Variant[]> => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/variants');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to load existing variants.');
        }
    },

    fetchMenuItem: async (dispatch: Dispatch, menuItemId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/menu-item/${menuItemId}`);
            if (!response.data) {
                throw new Error('No menu item data found in response');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to load menu item. Please try again.');
        }
    },

    updateMenuItem: async (dispatch: Dispatch, menuItemId: string, formData: FormData) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.put(`/edit-menu-item/${menuItemId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update menu item.');
        }
    },

    fetchMenuItems: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/all-menus/${restaurantId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch menu items.');
        }
    },

    toggleMenuItemActive: async (dispatch: Dispatch, menuItemId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/menu/${menuItemId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to toggle menu item.');
        }
    },

    fetchOrders: async (dispatch: Dispatch, restaurantId: string): Promise<Order[]> => {
        const axiosInstance = createAxios(dispatch);
        try {
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch orders.');
        }
    },

    updateOrderStatus: async (dispatch: Dispatch, orderId: string, orderStatus: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/order/status/${orderId}`, {
                orderStatus,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update order status.');
        }
    },

    fetchSubscriptionPlans: async (dispatch: Dispatch): Promise<Plan[]> => {
        const axiosInstance = createAxios(dispatch);
        try {
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch plans');
        }
    },

    checkPlanExistence: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/check-plan-exist/${restaurantId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to check plan existence.');
        }
    },

    initiateSubscriptionPayment: async (dispatch: Dispatch, payload: { amount: string; planId: string; restaurantId: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurnt/subscription-plan', payload);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Payment initiation failed');
        }
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
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurnt-verify-payment', payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Payment verification failed. Contact support.');
        }
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
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/restaurnt-payment-failed', payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to log payment failure. Contact support.');
        }
    },

    fetchTransactionDetails: async (dispatch: Dispatch, transactionId: string): Promise<Transaction> => {
        const axiosInstance = createAxios(dispatch);
        try {
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transaction details');
        }
    },

    fetchTransactionHistory: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
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
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
        }
    },
};