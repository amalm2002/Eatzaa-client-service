import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userAuthReducer from './slices/userAuthSlice';
import restaurantAuthReducer from './slices/restaurantSlice';
import admnAuthReducer from './slices/adminSlice';
import deliveryBoyAuthReducer from './slices/deliveryBoySlice';
import notificationReducer from './slices/notificationSlice';
import orderReducer from './slices/orderSlice';


const persistConfig = {
    key: 'order',
    storage,
    whitelist: ['order'],
};


const rootReducer = combineReducers({
    userAuth: userAuthReducer,
    restaurantAuth: restaurantAuthReducer,
    adminAuth: admnAuthReducer,
    deliveryBoyAuth: deliveryBoyAuthReducer,
    notification: notificationReducer,
    order: orderReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
            },
        }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;