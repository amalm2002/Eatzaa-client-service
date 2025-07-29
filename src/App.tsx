import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/user/layouts/Footer'
import Index from './pages/user/userHome'
import SignupPage from './pages/user/authentication/userSignUp'
import SigninPage from './pages/user/authentication/userSignIn'
import OtpPage from './pages/user/authentication/userOtpPage'
import Register from './pages/restaurant/authentication/register'
import { useSelector } from 'react-redux'
import Login from './pages/restaurant/authentication/login'
import RestaurantDashboard from './pages/restaurant/dashboard'
import AdminDashboard from './pages/admin/admindashboard'
import { AddMenuItems } from './pages/restaurant/menu/addMenus'
import MenuList from './pages/restaurant/menu/menuListPage'
import { EditMenuItems } from './pages/restaurant/menu/editMenus'
import { RootState } from './service/redux/store'
import ForgotPassword from './pages/user/forgotPassword/forgotPass'
import FoodDeliveryPage from './pages/user/foodListPage'
import ProfilePage from './pages/user/profile/userProfilePage'
import PaymentPage from './pages/restaurant/paymentPage'
import TransactionHistory from './pages/restaurant/transactionHistoryPage'
import TransactionDetails from './pages/restaurant/transactionDetails'
import DeliveryBoyLogin from './pages/delivery-boy/authentication/login'
import DeliveryPartnerHomepage from './pages/delivery-boy/homePage'
import CartPage from './pages/user/userCart'
import Checkout from './pages/user/userCheckOut'
import OrderList from './pages/restaurant/orderListPage'
import OrderTrackingUI from './pages/user/profile/orderTrackingPage'
import DeliveryMapPage from './pages/delivery-boy/locationMap/mapModal'



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
    '/order-list-page',

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
    '/admin/ride-payment',

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
            <Route path="/order-history" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/order-details-page/:id" element={user ? <OrderTrackingUI /> : <Navigate to="/login" />} />


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
            <Route path="/order-list-page" element={restaurant ? <OrderList /> : <Navigate to="/restaurant-login" />} />

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
            <Route path="/admin/ride-payment" element={admin ? <AdminDashboard initialPage="RidePayment" /> : <Navigate to="/" />} />

            {/* ---------- DELIVER_BOY ROUTES ---------- */}
            <Route path="/deliveryBoy-Home" element={deliveryBoy ? <DeliveryPartnerHomepage /> : <Navigate to="/deliveryBoy-login" />} />
            <Route path="/deliveryBoy-login" element={deliveryBoy ? <Navigate to="/deliveryBoy-Home" /> : <DeliveryBoyLogin />} />
            <Route
              path="/location-map"
              element={
                deliveryBoy ? (
                  <DeliveryMapPage
                    origin={location.state?.origin || { latitude: 0, longitude: 0 }}
                    destination={location.state?.destination || { latitude: 0, longitude: 0 }}
                    orderId={location.state?.orderId || ''}
                    deliveryBoyId={location.state?.deliveryBoyId || ''}
                  />
                ) : (
                  <DeliveryBoyLogin />
                )
              }
            />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>

    </>
  )
}

export default App
