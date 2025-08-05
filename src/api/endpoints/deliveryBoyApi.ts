import { Dispatch } from 'redux';
import createAxios from '../../service/axious-services/deliveryBoyAxious';
import { OrderApiResponse } from '../../interfaces/delivery-boy/location-map/order-api-response.types';
import { VerifyOrderResponse } from '../../interfaces/delivery-boy/location-map/verify-order-response.types';
import { UserApiResponse } from '../../interfaces/delivery-boy/location-map/user-api-response.types';
import { UserDetails } from '../../interfaces/delivery-boy/authentication/user-details.types';
import { HelpOption } from '../../pages/delivery-boy/needHelpPage';

// Centralized API service for delivery boy-related calls

export const deliveryBoyApi = {

    getDeliveryBoyData: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/delivery-boy/${deliveryBoyId}`);
        return response.data.data;
    },

    getDeliveryBoyOrders: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/delivery-partner/order/${deliveryBoyId}`);
        return response.data.data;
    },

    updateOnlineStatus: async (dispatch: Dispatch, deliveryBoyId: string, status: boolean) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/enable-online/${deliveryBoyId}`, { isOnline: status });
        return response.data.data;
    },

    updateLocation: async (dispatch: Dispatch, deliveryBoyId: string, location: { latitude: number; longitude: number }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/update-location/${deliveryBoyId}`, location);
        return response.data;
    },

    getOrderDetails: async (dispatch: Dispatch, orderId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get<OrderApiResponse>(`/order-details/${orderId}`);
        return response.data.data;
    },

    getLiveLocation: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get<{
            success: boolean;
            location?: { latitude: number; longitude: number };
            message?: string;
        }>(`/get-live-location/${deliveryBoyId}`);
        if (!response.data.success || !response.data.location) {
            throw new Error(response.data.message || 'No location data available');
        }
        return response.data.location;
    },

    verifyOrderPin: async (dispatch: Dispatch, orderId: string, enteredPin: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post<VerifyOrderResponse>('/verify-order-number', { enteredPin, orderId });
        if (!response.data.success) {
            throw new Error('Entered PIN does not match the order');
        }
        return response.data;
    },

    getUserDetails: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get<UserApiResponse>(`/get-user/${userId}`);
        return response.data.response.user;
    },

    completeOrder: async (dispatch: Dispatch, orderId: string, deliveryBoyId?: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/complete-order', { orderId, deliveryBoyId });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to complete delivery');
        }
        return response.data;
    },

    orderEarnings: async (dispatch: Dispatch, paymentMethod?: string, deliveryBoyId?: string, finalTotalDistance?: number, orderAmount?: number, order_id?: string) => {
        const axiosInstance = createAxios(dispatch)
        const response = await axiosInstance.post('/complete-and-earn', { paymentMethod, deliveryBoyId, finalTotalDistance, orderAmount, order_id })
        return response.data
    },

    registerDeliveryBoy: async (dispatch: Dispatch, mobile: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/deliveryBoy-rigister', { mobile });
        return response.data;
    },

    submitDeliveryBoyDetails: async (dispatch: Dispatch, deliveryBoyId: string, userDetails: UserDetails) => {
        const axiosInstance = createAxios(dispatch);
        const formData = new FormData();
        formData.append('deliveryBoyId', deliveryBoyId);
        formData.append('name', userDetails.name);
        formData.append('panCard[number]', userDetails.panCard);
        userDetails.panCardImages.forEach((image, index) => {
            if (image) formData.append(`panCard[images][${index}]`, image);
        });
        formData.append('license[number]', userDetails.license);
        userDetails.licenseImages.forEach((image, index) => {
            if (image) formData.append(`license[images][${index}]`, image);
        });
        formData.append('bankDetails[accountNumber]', userDetails.bankAccount);
        formData.append('bankDetails[ifscCode]', userDetails.ifscCode);
        if (userDetails.profileImage) formData.append('profileImage', userDetails.profileImage);

        const response = await axiosInstance.post('/details', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update details');
        }
        return response.data;
    },

    fetchResubmitDocuments: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/fetch-resubmit-doc/${deliveryBoyId}`);
        if (response.data.message !== 'success') {
            throw new Error('Failed to fetch rejected documents');
        }
        return response.data;
    },

    resubmitDeliveryBoyDetails: async (dispatch: Dispatch, deliveryBoyId: string, userDetails: UserDetails, changedFields: Partial<Record<keyof UserDetails, boolean>>) => {
        const axiosInstance = createAxios(dispatch);
        const formData = new FormData();
        formData.append('deliveryBoyId', deliveryBoyId);

        if (changedFields.name) {
            formData.append('name', userDetails.name);
        }
        if (changedFields.panCard) {
            formData.append('panCard[number]', userDetails.panCard);
        }
        if (changedFields.panCardImages) {
            userDetails.panCardImages.forEach((image, index) => {
                if (image) {
                    formData.append(`panCard[images][${index}]`, image);
                }
            });
        }
        if (changedFields.license) {
            formData.append('license[number]', userDetails.license);
        }
        if (changedFields.licenseImages) {
            userDetails.licenseImages.forEach((image, index) => {
                if (image) {
                    formData.append(`license[images][${index}]`, image);
                }
            });
        }
        if (changedFields.bankAccount) {
            formData.append('bankDetails[accountNumber]', userDetails.bankAccount);
        }
        if (changedFields.ifscCode) {
            formData.append('bankDetails[ifscCode]', userDetails.ifscCode);
        }
        if (changedFields.profileImage && userDetails.profileImage) {
            formData.append('profileImage', userDetails.profileImage);
        }

        const response = await axiosInstance.post('/details/resubmit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to resubmit details');
        }
        return response.data;
    },

    submitVehicleSelection: async (dispatch: Dispatch, deliveryBoyId: string, vehicle: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/vehicle?deliveryBoyId=${deliveryBoyId}`, { vehicle });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to submit vehicle selection');
        }
        return response.data;
    },

    submitDeliveryBoyLocation: async (dispatch: Dispatch, deliveryBoyId: string, location: { latitude: number; longitude: number }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/location?deliveryBoyId=${deliveryBoyId}`, location, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.data.success) {
            throw new Error(response.data.message || 'Something went wrong, please try again.');
        }
        return response.data;
    },

    fetchZones: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/get-zone');
        return response.data;
    },

    submitZoneSelection: async (dispatch: Dispatch, deliveryBoyId: string, zone: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/zone?deliveryBoyId=${deliveryBoyId}`, { zone });
        return response.data;
    },

    checkTheInHandCash: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch)
        const response = await axiosInstance.post('/check-inHand-cash-limit', { deliveryBoyId })
        return response
    },

    createAdminPayment: async (
        dispatch: Dispatch,
        data: { deliveryBoyId: string; amount: number; role?: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/create-delivery-boy-admin-payment', data);
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    },

    verifyAdminPayment: async (
        dispatch: Dispatch,
        data: {
            deliveryBoyId: string;
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
            role?: string;
        }
    ) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post('/verify-delivery-boy-admin-payment', data);
    },

    cancelAdminPayment: async (
        dispatch: Dispatch,
        data: { deliveryBoyId: string; orderId: string; role?: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post('/cancel-delivery-boy-admin-payment', data);
    },

    getDeliveryBoyInHandPaymentHistory: async (dispatch: Dispatch, data: { deliveryBoyId: string, role?: string }) => {
        const axiosInstance = createAxios(dispatch)
        const response = await axiosInstance.get('/get-partner-in-hand-payment-history', {
            params: data
        })
        return response.data
    },

    getAllDeliverBoyHelpOptions: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get('/get-all-help-options');
        return response.data;
    },

    getChatState: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/delivery-boy/chat-state/${deliveryBoyId}`);
        return response.data;
    },
    saveChatState: async (dispatch: Dispatch, deliveryBoyId: string, state: any) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/delivery-boy/chat-state/${deliveryBoyId}`, state);
        return response.data;
    },
    clearChatState: async (dispatch: Dispatch, deliveryBoyId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/delivery-boy/chat-state/${deliveryBoyId}`);
        return response.data;
    },
    submitConcern: async (
        dispatch: Dispatch,
        data: { deliveryBoyId: string; selectedOption: { _id?: string; title: string; description?: string; category?: string; isActive?: boolean; responseMessage?: string } | null; reason: string; description: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.patch('/delivery-boy/chat-state/concern', data);
        return response.data;
    },
    submitZoneChangeRequest: async (
        dispatch: Dispatch,
        data: { deliveryBoyId: string; concernId: string; zoneId: string; zoneName: string; reason: string; description: string }
    ) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.patch('/delivery-boy/chat-state/zone', data);
        return response.data;
    },
};