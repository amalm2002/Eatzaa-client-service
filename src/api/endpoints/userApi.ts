import { Dispatch } from 'redux';
import createAxios from '../../service/axious-services/userAxious';
import { OtpRequest, UserApiResponse, ResendOtpRequest } from '../../interfaces/api/user.types';
import {
    VerifyPaymentResponse,
    OrderData,
    CreateOrderResponse,
    PlaceOrderResponse,
} from '../../interfaces/api/order.types';

// Centralized API service for user-related calls
export const userApi = {

    verifyOtp: async (dispatch: Dispatch, data: OtpRequest) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post<UserApiResponse>('/signup', data);
    },

    resendOtp: async (dispatch: Dispatch, data: ResendOtpRequest) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post<UserApiResponse>('/resendOtp', data);
    },

    userSignIn: async (dispatch: Dispatch, data: { email: string; password: string; userToken?: string; refreshToken?: string; role?: string }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/login', data);
        console.log('login response :', response);

        if (response.data.message === 'Invalid password' || response.data.message === 'No user found') {
            throw new Error(response.data.message || 'An error occurred during login');
        }
        if (response.data.isActive === false) {
            throw new Error('Admin has been block your account');
        }
        return response.data;
    },

    checkGoogleLogin: async (dispatch: Dispatch, email: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/checkGoogleLoginUser', { email });
        if (response.data.message === 'No user found' || response.data.isActive === false) {
            throw new Error(response.data.message || 'An error occurred during Google login');
        }
        return response.data;
    },

    checkUser: async (dispatch: Dispatch, data: { email: string; name: string }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/checkUser', data);
        if (response.data.message === 'user already have an account !') {
            throw new Error(response.data.message);
        }
        return response.data;
    },

    getRestaurantMenus: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.get<any>('/restaurant-menus');
    },

    updateMenuQuantities: async (dispatch: Dispatch, cartItems: any[]) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post<{ success: boolean }>('/update-menu-quantities', { cartItems });
        if (!response.data.success) {
            throw new Error('Failed to update menu quantities');
        }
        return response.data;
    },

    updateUserCart: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete<{ success: boolean }>(`/delete-user-cart/${userId}`);
        if (!response.data.success) {
            throw new Error('Failed to delete user cart');
        }
        return response.data;
    },

    createOrder: async (dispatch: Dispatch, data: { amount: number; userId: string; cartItems: any[] }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post<CreateOrderResponse>('/create-order', data);
        console.log('create order response :', response);

        if (response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    },

    verifyPayment: async (
        dispatch: Dispatch,
        data: { paymentDbId?: string, razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderData: OrderData }
    ) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post<VerifyPaymentResponse>('/verify-payment', data);
    },

    placeOrder: async (dispatch: Dispatch, orderData: OrderData) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.post<PlaceOrderResponse>('/place-order', orderData);
    },

    getCartItems: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/get-cart/${userId}`);
        return response.data.response.items || [];
    },

    getMenuItemQuantity: async (dispatch: Dispatch, menuId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/menu-item/${menuId}`);
        return response.data.quantity || 10;
    },

    updateCartItemQuantity: async (dispatch: Dispatch, userId: string, menuId: string, quantity: number) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.patch(`/update-cart-item/${userId}`, {
            menuId,
            quantity,
        });
        if (response.data.message !== 'Cart item quantity updated successfully') {
            throw new Error(response.data.message || 'Failed to update cart item quantity');
        }
        return response.data.response.cart.items || [];
    },

    removeCartItem: async (dispatch: Dispatch, userId: string, menuId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/remove-cart-item/${userId}/${menuId}`);
        if (response.data.message !== 'Item removed from cart successfully') {
            throw new Error(response.data.message || 'Failed to remove cart item');
        }
        return response.data.response.cart.items || [];
    },

    getSortedMenu: async (dispatch: Dispatch, sortOption: string, searchTerm: string, category: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/sort-menu', {
            tempSortOption: sortOption,
            searchTerm: searchTerm || '',
            category: category || 'All',
        });
        return response.data || [];
    },

    addToCart: async (dispatch: Dispatch, userId: string, cartItem: any) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post(`/add-to-cart/${userId}`, cartItem);
        return response.data;
    },

    resetCart: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/delete-user-cart/${userId}`);
        if (!response.data.success) {
            throw new Error('Failed to delete user cart');
        }
        return response.data;
    },

    getUserProfile: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/get-user/${userId}`);
        return response.data.response.user;
    },

    updateUserProfile: async (dispatch: Dispatch, userId: string, userData: { name: string; phone: string }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/edit-profile/${userId}`, userData);
        return response.data.response.user;
    },

    updateUserAddress: async (dispatch: Dispatch, userId: string, addressData: { street: string; city: string; state: string; pinCode: number }, index: number) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.put(`/update-address/${userId}`, { address: addressData, index });
        return response.data;
    },

    deleteUserAddress: async (dispatch: Dispatch, userId: string, index: number) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.delete(`/delete-address/${userId}/${index}`);
        return response.data;
    },

    getOrderDetails: async (dispatch: Dispatch, orderId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/order-details/${orderId}`);
        return response.data.data;
    },

    cancelOrder: async (dispatch: Dispatch, orderId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.patch(`/order/cancel/${orderId}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to cancel order');
        }
        return response.data;
    },

    getUserOrders: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.get(`/get-orders/${userId}`);
        return response.data.data || [];
    },

    sendForgotPasswordOtp: async (dispatch: Dispatch, email: string) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/forgot-password-check', { email });
        if (response.data.message !== 'OTP sent successfully') {
            throw new Error(response.data.message || 'Failed to send OTP');
        }
        return response.data;
    },

    verifyForgotPasswordOtp: async (dispatch: Dispatch, data: { email: string; otp: string; token: string }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/verify-otp', data);
        if (response.data.message !== 'OTP verified') {
            throw new Error(response.data.message || 'Invalid OTP');
        }
        return response.data;
    },

    resetPassword: async (dispatch: Dispatch, data: { email: string; password: string; token: string }) => {
        const axiosInstance = createAxios(dispatch);
        const response = await axiosInstance.post('/reset-password', data);
        if (response.data.message !== 'Password reset successfully') {
            throw new Error(response.data.message || 'Failed to reset password');
        }
        return response.data;
    },
};
