import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const storedAsmin = localStorage.getItem('adminAuth')
const initialState: AdminState = storedAsmin
    ? JSON.parse(storedAsmin)
    : { admin: '', isLogin: false }

interface AdminState {
    admin: string,
    isLogin: boolean
}

export const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        adminLogin: (state, action: PayloadAction<AdminState>) => {
            console.log("Reducer received payload:", action.payload);
            state.admin = action.payload.admin;
            state.isLogin = action.payload.isLogin;
            localStorage.setItem("adminAuth", JSON.stringify(state));
        },
        adminLogout: (state) => {
            state.admin = "";
            state.isLogin = false;
            localStorage.removeItem("adminAuth");
        }
    }
})


export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;