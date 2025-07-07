import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
    isMapOpen: boolean;
    orderId: string | null;
    deliveryBoyId: string | null;
    origin: { latitude: number; longitude: number } | null;
    destination: { latitude: number; longitude: number } | null;
}

const initialState: OrderState = {
    isMapOpen: false,
    orderId: null,
    deliveryBoyId: null,
    origin: null,
    destination: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        openMapModal: (
            state,
            action: PayloadAction<{
                orderId: string;
                deliveryBoyId: string;
                origin: { latitude: number; longitude: number };
                destination: { latitude: number; longitude: number };
            }>
        ) => {
            state.isMapOpen = true;
            state.orderId = action.payload.orderId;
            state.deliveryBoyId = action.payload.deliveryBoyId;
            state.origin = action.payload.origin;
            state.destination = action.payload.destination;
        },
        updateDestination: (
            state,
            action: PayloadAction<{ latitude: number; longitude: number }>
        ) => {
            state.destination = action.payload;
        },
        closeMapModal: (state) => {
            state.isMapOpen = false;
            state.orderId = null;
            state.deliveryBoyId = null;
            state.origin = null;
            state.destination = null;
        },
    },
});

export const { openMapModal, updateDestination, closeMapModal } =
    orderSlice.actions;
export default orderSlice.reducer;