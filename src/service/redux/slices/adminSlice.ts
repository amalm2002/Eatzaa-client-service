import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const storedAsmin = localStorage.getItem('adminAuth')
const initialState: AdminState = storedAsmin
    ? JSON.parse(storedAsmin)
    : {admin_id:'', admin: '', isLogin: false, role: '' }

interface AdminState {
    admin_id:string
    admin: string,
    isLogin: boolean,
    role: 'Admin' | '';
}

export const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        adminLogin: (state, action: PayloadAction<AdminState>) => {
            console.log("Reducer received payload:", action.payload);
            state.admin_id=action.payload.admin_id
            state.admin = action.payload.admin;
            state.isLogin = action.payload.isLogin;
            state.role = action.payload.role;
            localStorage.setItem("adminAuth", JSON.stringify(state));
        },
        adminLogout: (state) => {
            state.admin_id=""
            state.admin = "";
            state.isLogin = false;
            state.role = '';
            localStorage.removeItem("adminAuth");
            localStorage.removeItem('role')
            localStorage.removeItem('adminRefreshToken')
        }
    }
})


export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;