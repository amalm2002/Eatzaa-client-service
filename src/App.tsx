import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
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


function App() {
  const user = useSelector((store: { userAuth: { isLogin: boolean } }) => store.userAuth.isLogin)
  const restaurant = useSelector((store: { restaurantAuth: { isLogin: boolean } }) => store.restaurantAuth.isLogin)
  const admin = useSelector((store: RootState) => store.adminAuth.isLogin)

  console.log(restaurant, 'data on restaurant slice ');


  const location = useLocation()

  // const hideFooterPath = ['/restaurant-register', '/restaurant-login']
  // const showFooter = !hideFooterPath.includes(location.pathname)

  const hideFooterPaths = [
    '/restaurant-register',
    '/restaurant-login',
    '/restaurant-dashboard',
    '/restaurant-payment',
    '/restaurant-location',
    '/restaurant-add-menu',
    '/restaurant-menu-list',
    '/restaurant-edit-menu/:id',
    '/admin-dashboard',
    '/admin/restaurants',
    '/admin/customers',
    '/admin/restaurants/:id',
    '/admin/restaurants/subscription',
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

            {/* ---------- RESTAURANT ROUTES ---------- */}
            <Route path="/restaurant-register" element={restaurant ? <Navigate to="/restaurant-dashboard" /> : <Register />} />
            <Route path="/restaurant-login" element={restaurant ? <Navigate to="/restaurant-dashboard" /> : <Login />} />
            <Route path="/restaurant-dashboard" element={restaurant ? <RestaurantDashboard /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-add-menu" element={restaurant ? <AddMenuItems /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-menu-list" element={restaurant ? <MenuList /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-edit-menu/:id" element={restaurant ? <EditMenuItems /> : <Navigate to="/restaurant-login" />} />
            <Route path="/restaurant-payment" element={restaurant ? <PaymentPage /> : <Navigate to="/restaurant-login" />} />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin-dashboard" element={admin ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/customers" element={admin ? <AdminDashboard initialPage="Customers" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants" element={admin ? <AdminDashboard initialPage="Restaurants" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/:id" element={admin ? <AdminDashboard initialPage="RestaurantDetails" /> : <Navigate to="/" />} />
            <Route path="/admin/restaurants/subscription" element={admin ? <AdminDashboard initialPage="Payments" /> : <Navigate to="/" />} />

          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>

    </>
  )
}

export default App
