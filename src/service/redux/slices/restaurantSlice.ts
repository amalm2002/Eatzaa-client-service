import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const storedrestaurant = localStorage.getItem("restaurantAuth");
const initialState: RestaurantState = storedrestaurant
    ? JSON.parse(storedrestaurant)
    : { restaurant: "", restaurant_id: "", isLogin: false };

interface RestaurantState {
    restaurant: string;
    restaurant_id: string;
    isLogin: boolean;
}

export const restaurantAuthSlice = createSlice({
    name: "restaurantAuth",
    initialState,
    reducers: {       
        restaurantLogin: (state, action: PayloadAction<RestaurantState>) => {
            console.log("Reducer received payload:", action.payload);
            state.restaurant = action.payload.restaurant;
            state.restaurant_id = action.payload.restaurant_id;
            state.isLogin = action.payload.isLogin;
            localStorage.setItem("restaurantAuth", JSON.stringify(state)); 
        },
        restaurantLogout: (state) => {
            state.restaurant = "";
            state.restaurant_id = "";
            state.isLogin = false;
            localStorage.removeItem("restaurantAuth"); 
        }
    }
});

export const { restaurantLogin, restaurantLogout } = restaurantAuthSlice.actions;
export default restaurantAuthSlice.reducer;
