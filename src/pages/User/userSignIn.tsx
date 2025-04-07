import Navbar from "../../components/Navbar";
import createAxios from "../../service/axiousServices/userAxious";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../service/redux/slices/userAuthSlice";
import { validateSignin } from "../../utils/validation";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode'
import { adminLogin } from "../../service/redux/slices/adminSlice";


interface FormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const SigninPage: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);


    const validationErrors = validateSignin(formData);
    setErrors(validationErrors);


    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const axiosInstance = createAxios();

    try {
      const response = await axiosInstance.post('/login', formData);

      console.log('login responseeeeeeeeeeeee:', response);



      if (response.data.message === 'Invalid password') {

        setServerError('Invalid password. Please check your password and try again.');

      } else if (response.data.message === 'No user found') {

        setServerError(`You don't have any account please SignUp`)

      } else if (!response.data.isAdmin) {
        const userData = {
          user: response.data.user,
          user_id: response.data.user_id,
          isLogin: true
        };

        dispatch(userLogin(userData));
        localStorage.setItem('userToken', response.data.token)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        navigate('/');
      } else if (response.data.isAdmin) {
        const adminData = {
          admin: response.data.user,
          isLogin: true
        }

        dispatch(adminLogin(adminData))
        localStorage.setItem('adminToken', response.data.token)
        localStorage.setItem('adminRefreshToken', response.data.refreshToken)
        console.log('userSignin adminRefresh token', localStorage.getItem('adminRefreshToken'));

        navigate('/admin-dashboard')
      }
      
    } catch (error: any) {
      console.log('error on the login page ', (error as Error));
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else if (error.message) {
        setServerError(error.message);
      } else {
        setServerError('An error occurred during login. Please try again.');
      }
    }
  };


  const googleSignIn = async (data: CredentialResponse) => {
    const axiosInstance = createAxios()
    try {
      const token: string | undefined = data.credential

      if (token) {
        const decode = jwtDecode(token) as any
        console.log('Decoded Google Data:', decode);

        const response = await axiosInstance.post('/checkGoogleLoginUser', {
          email: decode.email,
        })

        console.log('Google login response:', response.data);

        if (response.data.message === 'No user found') {
          setServerError('No account found. Please sign up.')
          return;
        } else if (response.data.message === 'Success') {

          const userData = {
            user: response.data.user,
            user_id: response.data.user_id,
            isLogin: true
          }

          dispatch(userLogin(userData))
          localStorage.setItem('userToken', response.data.token)
          localStorage.setItem('refreshToken', response.data.refreshToken)
          navigate('/')
        }

      }

    } catch (error: any) {
      console.log('Google login error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong.');
    }
  };


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full max-h-[85vh]">

          {/* Right Side - Branding */}
          <div className="hidden md:flex flex-1 bg-[rgb(60,110,113)] text-white p-12 flex-col justify-center items-center max-h-[85vh]">
            <h2 className="text-3xl font-bold">FoodHub</h2>
            <h3 className="text-xl mt-2">Taste Excellence</h3>
            <p className="mt-4 text-center">Join our community and explore delightful meals at your convenience.</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center"><span className="text-yellow-300 mr-2">✔</span> Quick & easy ordering</li>
              <li className="flex items-center"><span className="text-yellow-300 mr-2">✔</span> Exclusive offers</li>
              <li className="flex items-center"><span className="text-yellow-300 mr-2">✔</span> 24/7 Customer support</li>
            </ul>
            <div className="mt-6 text-sm text-center">
              <p>📍 123 Gourmet Street, Foodville</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Left Side - Sign-in Form */}
          <div className="flex-1 flex justify-center items-center p-6 overflow-auto bg-white rounded-lg">
            <div className="max-w-md w-full p-8">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Welcome Back!</h2>
              <p className="text-gray-500 text-center">Sign in to continue your journey with FoodHub</p>

              {/* Server Error Display */}
              {serverError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                  <label className="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] ${errors.email ? "border-red-500" : ""
                      }`}
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] ${errors.password ? "border-red-500" : ""
                      }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                <button
                  className="w-full bg-[rgb(60,110,113)] text-white py-2 rounded-lg hover:bg-[rgb(50,100,105)] transition-all"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center my-4 text-gray-500">OR SIGN IN WITH</div>
              <div className="flex space-x-4">
                <div className="flex justify-center items-center mt-5 w-full">
                  <GoogleLogin shape="circle" ux_mode="popup" onSuccess={googleSignIn} />
                </div>
              </div>

              <p className="text-center text-gray-700 mt-4">
                Don't have an account? <a href="/signup" className="text-[rgb(60,110,113)]">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninPage;