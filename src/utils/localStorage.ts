
type Role='User'|'Admin'|'Restaurant'|'DeliveryBoy'

const logoutLocalStorage=(role:Role)=>{
    localStorage.removeItem('role')
    if (role==='User') {
        localStorage.removeItem('userToken')
        localStorage.removeItem('refreshToken')
    }else if (role==='Admin') {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
    }else if (role==='Restaurant') {
        localStorage.removeItem('restaurantToken')
        localStorage.removeItem('restaurantRefreshToken')
        localStorage.removeItem('restaurantId')
    }else if (role==='DeliveryBoy') {
        localStorage.removeItem('deliveryBoyToken')
        localStorage.removeItem('deliveryBoyRefreshToken')
        localStorage.removeItem('deliveryBoyId')
    }
}

export default logoutLocalStorage