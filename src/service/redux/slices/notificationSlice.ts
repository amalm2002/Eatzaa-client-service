import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  isOpen: boolean;
  type: string;
  message: string;
  navigate?: string;
  data?: {
    orderId?: string;
    restaurantId?: string;
    restaurantDetails?: {
      restaurantName: string;
      location: { latitude: number; longitude: number };
      email: string;
      mobile: string;
    };
    deliveryBoys?: Array<{
      name: string;
      mobile: string;
      location: { latitude: number; longitude: number };
      rating: number;
    }>;
  } | null;
}

const initialState: NotificationState = {
  isOpen: false,
  type: 'info',
  message: '',
  navigate: undefined,
  data: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<NotificationState, 'isOpen'>>) => {
      console.log('Notification Reducer received payload:', JSON.stringify(action.payload));
      state.isOpen = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.navigate = action.payload.navigate;
      state.data = action.payload.data ?? null;
    },
    hideNotification(state, action: PayloadAction<{ preserveData?: boolean } | undefined>) {
      state.isOpen = false;
      if (!action.payload?.preserveData) {
        state.type = 'info';
        state.message = '';
        state.navigate = undefined;
        state.data = null;
      }
    },
    completeDelivery: (state) => {
      state.isOpen = false;
      state.type = 'info';
      state.message = '';
      state.navigate = undefined;
      state.data = null;
    },
  },
});

export const { showNotification, hideNotification, completeDelivery } = notificationSlice.actions;
export default notificationSlice.reducer;