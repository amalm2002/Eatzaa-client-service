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
        try {
            const response = await axiosInstance.post('/login', data);
            if (response.data.message === 'Invalid password' || response.data.message === 'No user found' || response.data.isActive === false) {
                throw new Error(response.data.message || 'An error occurred during login');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || error.message || 'An error occurred during login');
        }
    },

    checkGoogleLogin: async (dispatch: Dispatch, email: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/checkGoogleLoginUser', { email });
            if (response.data.message === 'No user found' || response.data.isActive === false) {
                throw new Error(response.data.message || 'An error occurred during Google login');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Something went wrong');
        }
    },

    checkUser: async (dispatch: Dispatch, data: { email: string; name: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/checkUser', data);
            if (response.data.message === 'user already have an account !') {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    },

    getRestaurantMenus: async (dispatch: Dispatch) => {
        const axiosInstance = createAxios(dispatch);
        return axiosInstance.get<any>('/restaurant-menus');
    },

    updateMenuQuantities: async (dispatch: Dispatch, cartItems: any[]) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post<{ success: boolean }>('/update-menu-quantities', { cartItems });
            if (!response.data.success) {
                throw new Error('Failed to update menu quantities');
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error updating menu quantities: ${(error as Error).message}`);
        }
    },

    updateUserCart: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete<{ success: boolean }>(`/delete-user-cart/${userId}`);
            if (!response.data.success) {
                throw new Error('Failed to delete user cart');
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error updating user cart: ${(error as Error).message}`);
        }
    },

    createOrder: async (dispatch: Dispatch, data: { amount: number; userId: string; cartItems: any[] }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post<CreateOrderResponse>('/create-order', data);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error creating order: ${(error as Error).message}`);
        }
    },

    verifyPayment: async (
        dispatch: Dispatch,
        data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderData: OrderData }
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
        try {
            const response = await axiosInstance.get(`/get-cart/${userId}`);
            return response.data.response.items || [];
        } catch (error) {
            throw new Error(`Error fetching cart items: ${(error as Error).message}`);
        }
    },

    getMenuItemQuantity: async (dispatch: Dispatch, menuId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/menu-item/${menuId}`);
            return response.data.quantity || 10;
        } catch (error) {
            throw new Error(`Error fetching menu quantity for item ${menuId}: ${(error as Error).message}`);
        }
    },

    updateCartItemQuantity: async (dispatch: Dispatch, userId: string, menuId: string, quantity: number) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/update-cart-item/${userId}`, {
                menuId,
                quantity,
            });
            if (response.data.message !== 'Cart item quantity updated successfully') {
                throw new Error(response.data.message || 'Failed to update cart item quantity');
            }
            return response.data.response.cart.items || [];
        } catch (error) {
            throw new Error(`Error updating cart item quantity: ${(error as Error).message}`);
        }
    },

    removeCartItem: async (dispatch: Dispatch, userId: string, menuId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete(`/remove-cart-item/${userId}/${menuId}`);
            if (response.data.message !== 'Item removed from cart successfully') {
                throw new Error(response.data.message || 'Failed to remove cart item');
            }
            return response.data.response.cart.items || [];
        } catch (error) {
            throw new Error(`Error removing cart item: ${(error as Error).message}`);
        }
    },

    getSortedMenu: async (dispatch: Dispatch, sortOption: string, searchTerm: string, category: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/sort-menu', {
                tempSortOption: sortOption,
                searchTerm: searchTerm || '',
                category: category || 'All',
            });
            return response.data || [];
        } catch (error) {
            throw new Error(`Error fetching sorted menu items: ${(error as Error).message}`);
        }
    },

    addToCart: async (dispatch: Dispatch, userId: string, cartItem: any) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post(`/add-to-cart/${userId}`, cartItem);
            return response.data;
        } catch (error) {
            throw new Error(`Error adding item to cart: ${(error as Error).message}`);
        }
    },

    resetCart: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete(`/delete-user-cart/${userId}`);
            if (!response.data.success) {
                throw new Error('Failed to delete user cart');
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error clearing cart: ${(error as Error).message}`);
        }
    },

    getUserProfile: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/get-user/${userId}`);
            return response.data.response.user;
        } catch (error) {
            throw new Error(`Error fetching user profile: ${(error as Error).message}`);
        }
    },

    updateUserProfile: async (dispatch: Dispatch, userId: string, userData: { name: string; phone: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.put(`/edit-profile/${userId}`, userData);
            return response.data.response.user;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update profile.');
        }
    },

    updateUserAddress: async (dispatch: Dispatch, userId: string, addressData: { street: string; city: string; state: string; pinCode: number }, index: number) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.put(`/update-address/${userId}`, { address: addressData, index });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update address.');
        }
    },

    deleteUserAddress: async (dispatch: Dispatch, userId: string, index: number) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.delete(`/delete-address/${userId}/${index}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete address.');
        }
    },

    getOrderDetails: async (dispatch: Dispatch, orderId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/order-details/${orderId}`);
            return response.data.data;
        } catch (error) {
            throw new Error((error as Error).message || 'Failed to fetch order details.');
        }
    },

    cancelOrder: async (dispatch: Dispatch, orderId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.patch(`/order/cancel/${orderId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to cancel order');
            }
            return response.data;
        } catch (error) {
            throw new Error((error as Error).message || 'Failed to cancel order');
        }
    },

    getUserOrders: async (dispatch: Dispatch, userId: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.get(`/get-orders/${userId}`);
            return response.data.data || [];
        } catch (error) {
            throw new Error('Failed to load orders.');
        }
    },

    sendForgotPasswordOtp: async (dispatch: Dispatch, email: string) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/forgot-password-check', { email });
            if (response.data.message !== 'OTP sent successfully') {
                throw new Error(response.data.message || 'Failed to send OTP');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred while sending OTP');
        }
    },

    verifyForgotPasswordOtp: async (dispatch: Dispatch, data: { email: string; otp: string; token: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/verify-otp', data);
            if (response.data.message !== 'OTP verified') {
                throw new Error(response.data.message || 'Invalid OTP');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Invalid OTP');
        }
    },

    resetPassword: async (dispatch: Dispatch, data: { email: string; password: string; token: string }) => {
        const axiosInstance = createAxios(dispatch);
        try {
            const response = await axiosInstance.post('/reset-password', data);
            if (response.data.message !== 'Password reset successfully') {
                throw new Error(response.data.message || 'Failed to reset password');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'An error occurred while resetting password');
        }
    },
};
