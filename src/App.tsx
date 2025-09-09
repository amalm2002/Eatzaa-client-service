import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/user/layouts/Footer'
import Index from './pages/U/userHome'
import SignupPage from './pages/U/authentication/userSignUp'
import SigninPage from './pages/U/authentication/userSignIn'
import OtpPage from './pages/U/authentication/userOtpPage'
import Register from './pages/R/authentication/register'
import { useSelector } from 'react-redux'
import Login from './pages/R/authentication/login'
import RestaurantDashboard from './pages/R/dashboard'
import AdminDashboard from './pages/A/AdminDashboard'
import { AddMenuItems } from './pages/R/menu/addMenus'
import MenuList from './pages/R/menu/menuListPage'
import { EditMenuItems } from './pages/R/menu/editMenus'
import { RootState } from './service/redux/store'
import ForgotPassword from './pages/U/forgotPassword/forgotPass'
import FoodDeliveryPage from './pages/U/foodListPage'
import ProfilePage from './pages/U/profile/userProfilePage'
import PaymentPage from './pages/R/paymentPage'
import TransactionHistory from './pages/R/transactionHistoryPage'
import TransactionDetails from './pages/R/transactionDetails'
import DeliveryBoyLogin from './pages/D/authentication/login'
import DeliveryPartnerHomepage from './pages/D/homePage'
import CartPage from './pages/U/userCart'
import Checkout from './pages/U/userCheckOut'
import OrderList from './pages/R/orderListPage'
import OrderTrackingUI from './pages/U/profile/orderTrackingPage'
import DeliveryMapPage from './pages/D/locationMap/mapModal'
import DeliveryPartnerEarnings from './pages/D/earningsPage'
import FoodDetailModal from './pages/U/foodDetailsPage'
import DeliveryHelpChat from './pages/D/needHelpPage'
import CustomerListUI from './pages/R/customersListPage'
import ConcernsPage from './pages/D/concernPage'



function App() {
  const user = useSelector((store: { userAuth: { isLogin: boolean } }) => store.userAuth.isLogin)
  const restaurant = useSelector((store: { restaurantAuth: { isLogin: boolean } }) => store.restaurantAuth.isLogin)
  const deliveryBoy = useSelector((store: { deliveryBoyAuth: { isLogin: boolean } }) => store.deliveryBoyAuth.isLogin)
  const admin = useSelector((store: RootState) => store.adminAuth.isLogin)

  const location = useLocation()

  const hideFooterPaths = [
    '/restaurant/register',
    '/restaurant/login',
    '/restaurant/dashboard',
    '/restaurant/menus',
    '/restaurant/menus/add',
    '/restaurant/menus/edit/:id',
    '/restaurant/payments',
    '/restaurant/payments/history',
    '/restaurant/payments/:id',
    '/restaurant-location',
    '/restaurant/orders',
    '/restaurant/customers',

    '/admin/dashboard',
    '/admin/restaurants',
    '/admin/customers',
    '/admin/restaurants/:id',
    '/admin/restaurants/subscriptions',
    '/admin/payments',
    '/admin/zone/create',
    '/admin/zones',
    '/admin/delivery-boy',
    '/admin/delivery-boys/:id',
    '/admin/ride-payments',
    '/admin/partner-payments',
    '/admin/partner/help-center',
    '/admin/partner/concern',

    '/delivery-boy/login',
    '/delivery-boy/home',
    '/delivery-boy/earnings',
    '/delivery-boy/help',
    '/delivery-boy/concerns',
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
            <Route path="/foods" element={user ? <FoodDeliveryPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/orders/:id" element={user ? <OrderTrackingUI /> : <Navigate to="/login" />} />
            <Route path="/dish/:dishId" element={user ? <FoodDetailModal /> : <Navigate to="/login" />} />


            {/* ---------- RESTAURANT ROUTES ---------- */}
            <Route path="/restaurant/register" element={restaurant ? <Navigate to="/restaurant/dashboard" /> : <Register />} />
            <Route path="/restaurant/login" element={restaurant ? <Navigate to="/restaurant/dashboard" /> : <Login />} />
            <Route path="/restaurant/dashboard" element={restaurant ? <RestaurantDashboard /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/menus" element={restaurant ? <MenuList /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/menus/add" element={restaurant ? <AddMenuItems /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/menus/edit/:id" element={restaurant ? <EditMenuItems /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/payments" element={restaurant ? <PaymentPage /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/payments/history" element={restaurant ? <TransactionHistory /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/payments/:id" element={restaurant ? <TransactionDetails /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/orders" element={restaurant ? <OrderList /> : <Navigate to="/restaurant/login" />} />
            <Route path="/restaurant/customers" element={restaurant ? <CustomerListUI /> : <Navigate to="/restaurant/login" />} />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin/dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/customers" element={admin ? <AdminDashboard initialPage="Customers" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants" element={admin ? <AdminDashboard initialPage="Restaurants" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/:id" element={admin ? <AdminDashboard initialPage="RestaurantDetails" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/subscriptions" element={admin ? <AdminDashboard initialPage="Subscription-Plan" /> : <Navigate to="/" />} />
            <Route path="/admin/payments" element={admin ? <AdminDashboard initialPage="Payments" /> : <Navigate to="/" />} />
            <Route path="/admin/zone/create" element={admin ? <AdminDashboard initialPage="Zone-Creation" /> : <Navigate to="/" />} />
            <Route path="/admin/zones" element={admin ? <AdminDashboard initialPage="Zone-List" /> : <Navigate to="/" />} />
            <Route path="/admin/delivery-boy" element={admin ? <AdminDashboard initialPage="DeliveryBoy" /> : <Navigate to="/" />} />
            <Route path="/admin/delivery-boys/:id" element={admin ? <AdminDashboard initialPage="DeliveryBoyDetails" /> : <Navigate to="/" />} />
            <Route path="/admin/ride-payments" element={admin ? <AdminDashboard initialPage="RidePayment" /> : <Navigate to="/" />} />
            <Route path="/admin/partner-payments" element={admin ? <AdminDashboard initialPage="PartnerPayment" /> : <Navigate to="/" />} />
            <Route path="/admin/partner/help-center" element={admin ? <AdminDashboard initialPage="Help Center" /> : <Navigate to="/" />} />
            <Route path="/admin/partner/concern" element={admin ? <AdminDashboard initialPage="Concern" /> : <Navigate to="/" />} />

            {/* ---------- DELIVER_BOY ROUTES ---------- */}
            <Route path="/delivery-boy/home" element={deliveryBoy ? <DeliveryPartnerHomepage /> : <Navigate to="/delivery-boy/login" />} />
            <Route path="/delivery-boy/login" element={deliveryBoy ? <Navigate to="/delivery-boy/home" /> : <DeliveryBoyLogin />} />
            <Route path="/delivery-boy/map" element={deliveryBoy ? (
              <DeliveryMapPage origin={location.state?.origin || { latitude: 0, longitude: 0 }}
                destination={location.state?.destination || { latitude: 0, longitude: 0 }}
                orderId={location.state?.orderId || ''}
                deliveryBoyId={location.state?.deliveryBoyId || ''}
              />
            ) : (<DeliveryBoyLogin />)} />
            <Route path='/delivery-boy/earnings' element={deliveryBoy ? <DeliveryPartnerEarnings /> : <Navigate to="/delivery-boy/login" />} />
            <Route path='/delivery-boy/help' element={deliveryBoy ? <DeliveryHelpChat /> : <Navigate to="/delivery-boy/login" />} />
            <Route path='/delivery-boy/concerns' element={deliveryBoy ? <ConcernsPage /> : <Navigate to="/delivery-boy/login" />} />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>

    </>
  )
}

export default App
