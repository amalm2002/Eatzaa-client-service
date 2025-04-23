import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./slices/userAuthSlice";
import restaurantAuthReducer from "./slices/restaurantSlice";
import admnAuthReducer  from "./slices/adminSlice";

export const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        restaurantAuth: restaurantAuthReducer,
        adminAuth:admnAuthReducer
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
