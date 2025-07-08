import { Dispatch } from 'redux';
import { LatLngExpression } from 'leaflet';
import { createAxios } from '../../service/axious-services/adminAxious';


// Centralized API service for admin-related calls
export const adminApi = {
    //Users side API calls
    fetchUsers: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/getAllUsers');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to load users');
        }
    },

    toggleBlockUser: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/block-user/${userId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to toggle user block status');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to toggle user block status');
        }
    },
    //Restaurant side API calls
    fetchRestaurants: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/getAllRestaurants');
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load restaurants');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },

    fetchRestaurantDetails: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/getRestaurant/${restaurantId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load restaurant details');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error loading restaurant details');
        }
    },

    verifyRestaurantDocuments: async (dispatch: Dispatch, restaurantId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post(`/verifyRestaurantDocs/${restaurantId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to verify restaurant');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred during verification');
        }
    },

    rejectRestaurantDocuments: async (dispatch: Dispatch, restaurantId: string, rejectionReason: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post(`/rejectedRestaurantDocs`, {
                restaurantId,
                rejectionReason,
            });
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to reject restaurant');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred during rejection');
        }
    },

    fetchSubscriptionPlans: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/getSubscriptionPlans');
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load plans');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error fetching plans');
        }
    },

    addSubscriptionPlan: async (dispatch: Dispatch, plan: any) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/addSubscriptionPlan', plan);
            console.log('Add plan response:', response);
            if (response.data.message !== 'Subscription Plan Created Successfully') {
                throw new Error(response.data.message || 'Failed to add subscription plan');
            }
            return response.data.data;
        } catch (error: any) {
            console.error('Error adding subscription plan:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            throw new Error(error.response?.data?.plan?.message || 'Failed to add subscription plan');
        }
    },

    updateSubscriptionPlan: async (dispatch: Dispatch, planId: string, plan: any) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.put(`/updateSubscriptionPlan/${planId}`, plan);
            console.log('Update plan response:', response.data);
            if (response.data.plan?.message !== 'success') {
                throw new Error(response.data.plan?.message || 'Failed to update subscription plan');
            }
            return response.data.plan;
        } catch (error: any) {
            console.error('Error updating subscription plan:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            throw new Error(error.response?.data?.plan?.message || 'Failed to update subscription plan');
        }
    },

    deleteSubscriptionPlan: async (dispatch: Dispatch, planId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete(`/deleteSubscriptionPlan/${planId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Error deleting plan');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error deleting plan');
        }
    },

    fetchPayments: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/getAllPayments');
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load payments');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },
    //Deliveryboy side API calls
    fetchDeliveryBoys: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/getAllDeliveryBoys');
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load delivery boys');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },

    updateDeliveryBoyStatus: async (dispatch: Dispatch, deliveryBoyId: string, isActive: boolean) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/updateDeliveryBoyStatus/${deliveryBoyId}`, { isActive });
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to update status');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },

    fetchDeliveryBoyDetails: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/getDeliveryBoy/${deliveryBoyId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to load delivery boy details');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error loading delivery boy details');
        }
    },

    verifyDeliveryBoyDocuments: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post(`/verifyDeliveryBoyDocs/${deliveryBoyId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to verify delivery boy');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred during verification');
        }
    },

    rejectDeliveryBoyDocuments: async (dispatch: Dispatch, deliveryBoyId: string, rejectionReason: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post(`/rejectDeliveryBoyDocs`, {
                deliveryBoyId,
                rejectionReason,
            });
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to reject delivery boy');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred during rejection');
        }
    },

    createDeliveryZone: async (dispatch: Dispatch, zone: { name: string; coordinates: LatLngExpression[] }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/zone-creation', zone);
            if (response.data.error) {
                throw new Error(response.data.message || 'Failed to save zone');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to save zone. Please try again.');
        }
    },

    fetchZones: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get('/fetch-zone');
            if (response.data.message !== 'Fetch data success') {
                throw new Error(response.data.message || 'Failed to load zones');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },

    deleteZone: async (dispatch: Dispatch, zoneId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete(`/deleteZone/${zoneId}`);
            if (response.data.message !== 'success') {
                throw new Error(response.data.message || 'Failed to delete zone');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Internal error');
        }
    },
};