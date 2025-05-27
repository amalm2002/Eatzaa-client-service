import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/user/Footer'
import Index from './pages/User/userHome'
import SignupPage from './pages/User/authentication/userSignUp'
import SigninPage from './pages/User/authentication/userSignIn'
import OtpPage from './pages/User/authentication/userOtpPage'
import Register from './pages/Restaurant/authentication/register'
import { useSelector } from 'react-redux'
import Login from './pages/Restaurant/authentication/login'
import RestaurantDashboard from './pages/Restaurant/dashboard'
import AdminDashboard from './pages/Admin/admindashboard'
import { AddMenuItems } from './pages/Restaurant/menu/addMenus'
import MenuList from './pages/Restaurant/menu/menuListPage'
import { EditMenuItems } from './pages/Restaurant/menu/editMenus'
import { RootState } from './service/redux/store'
import ForgotPassword from './pages/User/forgotPassword/forgotPass'
import FoodDeliveryPage from './pages/User/foodListPage'
import ProfilePage from './pages/User/profile/userProfilePage'
import PaymentPage from './pages/Restaurant/paymentPage'
import TransactionHistory from './pages/Restaurant/transactionHistoryPage'
import TransactionDetails from './pages/Restaurant/transactionDetails'
import DeliveryBoyLogin from './pages/DeliveryBoy/authentication/login'
import DeliveryPartnerHomepage from './pages/DeliveryBoy/homePage'
import CartPage from './pages/User/userCart'
import Checkout from './pages/User/userCheckOut'



function App() {
  const user = useSelector((store: { userAuth: { isLogin: boolean } }) => store.userAuth.isLogin)
  const restaurant = useSelector((store: { restaurantAuth: { isLogin: boolean } }) => store.restaurantAuth.isLogin)
  const deliveryBoy = useSelector((store: { deliveryBoyAuth: { isLogin: boolean } }) => store.deliveryBoyAuth.isLogin)
  const admin = useSelector((store: RootState) => store.adminAuth.isLogin)

  const location = useLocation()

  const hideFooterPaths = [
    '/restaurant-register',
    '/restaurant-login',
    '/restaurant-dashboard',
    '/restaurant-payment',
    '/restaurant-payment-history',
    '/restaurant-payment-details/:id',
    '/restaurant-location',
    '/restaurant-add-menu',
    '/restaurant-menu-list',
    '/restaurant-edit-menu/:id',

    '/admin-dashboard',
    '/admin/restaurants',
    '/admin/customers',
    '/admin/restaurants/:id',
    '/admin/restaurants/subscription',
    '/admin/payments',
    '/admin/deliveryBoy/zone',
    '/admin/zone-list',
    '/admin/Delivery-Boy',
    '/admin/delivery-boys/:id',

    '/deliveryBoy-login',
    '/deliveryBoy-Home'
  ]
  // const showFooter = !hideFooterPaths.includes(location.pathname)
  const showFooter = !hideFooterPaths.some((path) =>
    location.pathname.startsWith(path.split('/:')[0])
  );

  return (
    <>

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />

            {/* ---------- USER ROUTES ---------- */}
            <Route path="/login" element={user ? <Navigate to={'/'} /> : <SigninPage />} />
            <Route path="/signup" element={user ? <Navigate to={'/'} /> : <SignupPage />} />
            <Route path="/otp" element={user ? <Navigate to={'/'} /> : <OtpPage />} />
            <Route path="/forgot-password" element={user ? <Navigate to={'/'} /> : <ForgotPassword />} />
            <Route path="/food-list-page" element={user ? <FoodDeliveryPage /> : <Navigate to="/login" />} />
            <Route path="/user-profile-page" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/user-cart-page" element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/user-check-out-page" element={user ? <Checkout /> : <Navigate to="/login" />} />
            

            {/* ---------- RESTAURANT ROUTES ---------- */}
            <Route path="/restaurant-register" element={restaurant ? <Navigate to="/restaurant-dashboard" /> : <Register />} />
            <Route path="/restaurant-login" element={restaurant ? <Navigate to="/restaurant-dashboard" /> : <Login />} />
            <Route path="/restaurant-dashboard" element={restaurant ? <RestaurantDashboard /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-add-menu" element={restaurant ? <AddMenuItems /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-menu-list" element={restaurant ? <MenuList /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-edit-menu/:id" element={restaurant ? <EditMenuItems /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-payment" element={restaurant ? <PaymentPage /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-payment-history" element={restaurant ? <TransactionHistory /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-payment-details/:id" element={restaurant ? <TransactionDetails /> : <Navigate to="/restaurant-login" />} />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin-dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/customers" element={admin ? <AdminDashboard initialPage="Customers" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants" element={admin ? <AdminDashboard initialPage="Restaurants" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/:id" element={admin ? <AdminDashboard initialPage="RestaurantDetails" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/subscription" element={admin ? <AdminDashboard initialPage="Subscription-Plan" /> : <Navigate to="/" />} />
            <Route path="/admin/payments" element={admin ? <AdminDashboard initialPage="Payments" /> : <Navigate to="/" />} />
            <Route path="/admin/deliveryBoy/zone" element={admin ? <AdminDashboard initialPage="Zone-Creation" /> : <Navigate to="/" />} />
            <Route path="/admin/zone-list" element={admin ? <AdminDashboard initialPage="Zone-List" /> : <Navigate to="/" />} />
            <Route path="/admin/Delivery-Boy" element={admin ? <AdminDashboard initialPage="DeliveryBoy" /> : <Navigate to="/" />} />
            <Route path="/admin/delivery-boys/:id" element={admin ? <AdminDashboard initialPage="DeliveryBoyDetails" /> : <Navigate to="/" />} />

            {/* ---------- DELIVER_BOY ROUTES ---------- */}
            <Route path="/deliveryBoy-Home" element={deliveryBoy ? <DeliveryPartnerHomepage /> : <Navigate to="/deliveryBoy-login" />} />
            <Route path="/deliveryBoy-login" element={deliveryBoy ? <Navigate to="/deliveryBoy-Home" /> : <DeliveryBoyLogin />} />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>

    </>
  )
}

export default App
