import { Dispatch } from 'redux';
import { LatLngExpression } from 'leaflet';
import { createAxios } from '../../service/axious-services/adminAxious';


// Centralized API service for admin-related calls
export const adminApi = {
    //Users side API calls
    fetchUsers: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/getAllUsers');
        return response.data;
    },

    //Restaurant side API calls

    // fetchRestaurants: async (dispatch: Dispatch) => {
    //     const axiosInstance = createAxios(dispatch);
    //     const response = await axiosInstance.get('/getAllRestaurants');
    //     if (response.data.message !== 'success') {
    //         throw new Error(response.data.message || 'Failed to load restaurants');
    //     }
    //     return response.data;
    // },
    fetchRestaurants: async (dispatch: Dispatch, searchTerm?: string, statusFilter?: string) => {
        const axiosInstance = createAxios(dispatch);
        const queryParams = new URLSearchParams();

        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        if (statusFilter && statusFilter !== 'all') {
            queryParams.append('status', statusFilter);
        }

        const response = await axiosInstance.get(`/getAllRestaurants?${queryParams.toString()}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load restaurants');
        }
        return response.data;
    },

    fetchRestaurantDetails: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/getRestaurant/${restaurantId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load restaurant details');
        }
        return response.data;
    },

    verifyRestaurantDocuments: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/verifyRestaurantDocs/${restaurantId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to verify restaurant');
        }
        return response.data;
    },

    rejectRestaurantDocuments: async (dispatch: Dispatch, restaurantId: string, rejectionReason: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/rejectedRestaurantDocs`, {
            restaurantId,
            rejectionReason,
        });
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to reject restaurant');
        }
        return response.data;
    },

    fetchSubscriptionPlans: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/getSubscriptionPlans');
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load plans');
        }
        return response.data;
    },

    addSubscriptionPlan: async (dispatch: Dispatch, plan: any) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/addSubscriptionPlan', plan);
        if (response.data.message !== 'Subscription Plan Created Successfully') {
            throw new Error(response.data.message || 'Failed to add subscription plan');
        }
        return response.data.data;
    },

    updateSubscriptionPlan: async (dispatch: Dispatch, planId: string, plan: any) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/updateSubscriptionPlan/${planId}`, plan);
        if (response.data.plan?.message !== 'success') {
            throw new Error(response.data.plan?.message || 'Failed to update subscription plan');
        }
        return response.data.plan;
    },

    deleteSubscriptionPlan: async (dispatch: Dispatch, planId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/deleteSubscriptionPlan/${planId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Error deleting plan');
        }
        return response.data;
    },

    fetchPayments: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/getAllPayments');
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load payments');
        }
        return response.data;
    },
    //Deliveryboy side API calls
    fetchDeliveryBoys: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/getAllDeliveryBoys');
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load delivery boys');
        }
        return response.data;
    },

    updateDeliveryBoyStatus: async (dispatch: Dispatch, deliveryBoyId: string, isActive: boolean) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.patch(`/updateDeliveryBoyStatus/${deliveryBoyId}`, { isActive });
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to update status');
        }
        return response.data;
    },

    fetchDeliveryBoyDetails: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/getDeliveryBoy/${deliveryBoyId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to load delivery boy details');
        }
        return response.data;
    },

    verifyDeliveryBoyDocuments: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/verifyDeliveryBoyDocs/${deliveryBoyId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to verify delivery boy');
        }
        return response.data;
    },

    rejectDeliveryBoyDocuments: async (dispatch: Dispatch, deliveryBoyId: string, rejectionReason: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/rejectDeliveryBoyDocs`, {
            deliveryBoyId,
            rejectionReason,
        });
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to reject delivery boy');
        }
        return response.data;
    },

    createDeliveryZone: async (dispatch: Dispatch, zone: { name: string; coordinates: LatLngExpression[] }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/zone-creation', zone);
        if (response.data.error) {
            throw new Error(response.data.message || 'Failed to save zone');
        }
        return response.data;
    },

    fetchZones: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/fetch-zone');
        if (response.data.message !== 'Fetch data success') {
            throw new Error(response.data.message || 'Failed to load zones');
        }
        return response.data;
    },

    deleteZone: async (dispatch: Dispatch, zoneId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/deleteZone/${zoneId}`);
        if (response.data.message !== 'success') {
            throw new Error(response.data.message || 'Failed to delete zone');
        }
        return response.data;
    },

    addRidePayment: async (dispatch: Dispatch, payload: {
        KM: number,
        ratePerKm: number,
        vehicleType: string,
        isActive: boolean
    }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/add-ride-payment-rule', payload)
        return response
    },

    getRidePaymentRules: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/fetch-ride-rate-payment')
        return response
    },

    updateRidePayment: async (
        dispatch: Dispatch,
        payload: { id: string; KM: number; ratePerKm: number; vehicleType: string; isActive: boolean }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/update-ride-payment-rule/${payload.id}`, payload);
        return response;
    },

    blockRidePayment: async (
        dispatch: Dispatch,
        payload: { id: string; vehicleType: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/block-ride-payment-rule/${payload.id}`, { vehicleType: payload.vehicleType });
        return response;
    },

    unblockRidePayment: async (
        dispatch: Dispatch,
        payload: { id: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/unblock-ride-payment-rule/${payload.id}`);
        return response;
    },

    createRazorpayOrder: async (dispatch: Dispatch, data: { deliveryBoyId: string, amount: number }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/create-delivery-partner-order', data)
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    },

    verifyPayment: async (
        dispatch: Dispatch,
        data: { deliveryBoyId?: string, razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }
    ) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post('/verify-payment-delivery-partner', data);
    },
};