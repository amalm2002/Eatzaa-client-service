import { adminLogout } from "../../redux/slices/adminSlice";
import { userLogout } from "../../redux/slices/userAuthSlice";
import { restaurantLogout } from "../../redux/slices/restaurantSlice";
import { deliveryBoyLogout } from "../../redux/slices/deliveryBoySlice";

export const roleConfig = {
    Admin: {
        basePath: "admin",
        tokenKey: "adminToken",
        refreshTokenKey: "adminRefreshToken",
        logoutAction: adminLogout,
        loginPath: "/login",
    },
    User: {
        basePath: "user",
        tokenKey: "userToken",
        refreshTokenKey: "refreshToken",
        logoutAction: userLogout,
        loginPath: "/login",
    },
    DeliveryBoy: {
        basePath: "deliveryBoy",
        tokenKey: "deliveryBoyToken",
        refreshTokenKey: "deliveryBoyRefreshToken",
        logoutAction: deliveryBoyLogout,
        loginPath: "/deliveryBoy-login",
    },
    Restaurant: {
        basePath: "restaurant",
        tokenKey: "restaurantToken",
        refreshTokenKey: "restaurantRefreshToken",
        logoutAction: restaurantLogout,
        loginPath: "/restaurant-login",
    },
};
