
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const storedDeliveryBoy = localStorage.getItem("deliveryBoyAuth");
const initialState: DeliveryBoyState = storedDeliveryBoy
    ? JSON.parse(storedDeliveryBoy)
    : { delivery_boy_name: "", delivery_boy_id: "", isLogin: false, role: '' };

interface DeliveryBoyState {
    delivery_boy_name: string;
    delivery_boy_id: string;
    isLogin: boolean;
    role: 'DeliveryBoy' | ''
}

export const deliveryBoyAuthSlice = createSlice({
    name: "deliveryBoyAuth",
    initialState,
    reducers: {
       deliveryBoyLogin: (state, action: PayloadAction<DeliveryBoyState>) => {
            console.log("Reducer received payload:", action.payload);
            state.delivery_boy_name = action.payload.delivery_boy_name;
            state.delivery_boy_id = action.payload.delivery_boy_id;
            state.isLogin = action.payload.isLogin;
            state.role = action.payload.role
            localStorage.setItem("deliveryBoyAuth", JSON.stringify(state));
        },
        deliveryBoyLogout: (state) => {
            state.delivery_boy_name = "";
            state.delivery_boy_id = "";
            state.isLogin = false;
            state.role = ''
            localStorage.removeItem("deliveryBoyAuth");
            localStorage.removeItem('role')
            localStorage.removeItem('deliveryBoyRefreshToken')
        }
    }
});

export const { deliveryBoyLogin, deliveryBoyLogout } = deliveryBoyAuthSlice.actions;
export default deliveryBoyAuthSlice.reducer;
