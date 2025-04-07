import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Index from './pages/User/userHome'
import SignupPage from './pages/User/userSignUp'
import SigninPage from './pages/User/userSignIn'
import OtpPage from './pages/User/userOtpPage'
import Register from './pages/Restaurant/authentication/register'
import { useSelector } from 'react-redux'
import Login from './pages/Restaurant/authentication/login'
import RestaurantDashboard from './pages/Restaurant/dashboard'
import AdminDashboard from './pages/Admin/admindashboard'


function App() {
  const user = useSelector((store: { userAuth: { isLogin: boolean } }) => store.userAuth.isLogin)
  const restaurant = useSelector((store: { restaurantAuth: { isLogin: boolean } }) => store.restaurantAuth.isLogin)

  console.log(restaurant, 'data on restaurant slice ');


  const location = useLocation()

  // const hideFooterPath = ['/restaurant-register', '/restaurant-login']
  // const showFooter = !hideFooterPath.includes(location.pathname)

  const hideFooterPaths = [
    '/restaurant-register',
    '/restaurant-login',
    '/restaurant-dashboard',
    '/restaurant-location',
    '/admin-dashboard',
    '/admin/restaurants',
    '/admin/customers',
    '/admin/restaurants/:id',
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
            <Route path="/login" element={user ? <Navigate to={'/'} /> : <SigninPage />} />
            <Route path="/signup" element={user ? <Navigate to={'/'} /> : <SignupPage />} />
            <Route path="/otp" element={user ? <Navigate to={'/'} /> : <OtpPage />} />

            <Route path="/restaurant-register" element={restaurant ? <Navigate to={'/restaurant-dashboard'} /> : <Register />} />
            <Route path="/restaurant-login" element={restaurant ? <Navigate to={'/restaurant-dashboard'} /> : <Login />} />
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminDashboard initialPage="Customers" />} />
            <Route path="/admin/restaurants" element={<AdminDashboard initialPage="Restaurants" />} />
            <Route path="/admin/restaurants/:id" element={<AdminDashboard initialPage="RestaurantDetails" />} />
          </Routes>
        </div>
        {showFooter && <Footer />}
      </div>

    </>
  )
}

export default App
