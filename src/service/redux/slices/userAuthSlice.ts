import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const storedUser = localStorage.getItem("userAuth");
const initialState: UserState = storedUser
    ? JSON.parse(storedUser)
    : { user: "", user_id: "", role: '', isLogin: false };

interface UserState {
    user: string;
    user_id: string;
    isLogin: boolean;
    role: 'User' | ''
}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state, action: PayloadAction<UserState>) => {
            console.log("Reducer received payload:", action.payload);
            state.user = action.payload.user;
            state.user_id = action.payload.user_id;
            state.isLogin = action.payload.isLogin;
            state.role = action.payload.role;
            localStorage.setItem("userAuth", JSON.stringify(state));
        },
        userLogout: (state) => {
            state.user = "";
            state.user_id = "";
            state.isLogin = false;
            state.role = '';
            localStorage.removeItem("userAuth");
            localStorage.removeItem('role');
            localStorage.removeItem('refreshToken');
        }
    }
});

export const { userLogin, userLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
