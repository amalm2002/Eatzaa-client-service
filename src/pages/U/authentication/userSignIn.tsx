import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { CredentialResponse } from '@react-oauth/google';
import { userLogin } from '../../../service/redux/slices/userAuthSlice';
import { adminLogin } from '../../../service/redux/slices/adminSlice';
import { validateSignin } from '../../../utils/validation';
import Navbar from '../../../components/user/layouts/Navbar';
import SigninForm from '../../../components/user/authentication/SigninForm';
import GoogleSigninButton from '../../../components/user/authentication/GoogleSigninButton';
import Sidebar from '../../../components/user/authentication/SideBar';
import { FormData } from '../../../interfaces/user/authentication/register/form-data.types';
import { ValidationErrors } from '../../../interfaces/common/validation-errors.types';
import { userApi } from '../../../api/endpoints/userApi';



const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    userToken: '',
    refreshToken: '',
    role: 'User',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
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

    try {
      const response = await userApi.userSignIn(dispatch, formData);

      if (!response.isAdmin && response.role === 'User') {
        const userData = {
          user: response.user,
          user_id: response.userId,
          isLogin: true,
          role: response.role,
        };

        dispatch(userLogin(userData));
        localStorage.setItem('role', response.role);
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        navigate('/');
      } else if (response.isAdmin && response.role === 'Admin') {
        const adminData = {
          admin_id: response.userId,
          admin: response.user,
          isLogin: true,
          role: response.role,
        };

        dispatch(adminLogin(adminData));
        localStorage.setItem('role', response.role);
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminRefreshToken', response.refreshToken);
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.log('error on the login page ', error);
      setServerError(error.message);
    }
  };

  const googleSignIn = async (data: CredentialResponse) => {
    try {
      const token: string | undefined = data.credential;

      if (token) {
        const decode = jwtDecode(token) as any;
        const response = await userApi.checkGoogleLogin(dispatch, decode.email);

        if (response.message === 'Success') {
          const { role, user, user_id, token, refreshToken } = response;

          if (role === 'User') {
            const userData = {
              user,
              user_id,
              isLogin: true,
              role,
            };
            dispatch(userLogin(userData));
            localStorage.setItem('role', role);
            localStorage.setItem('userToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            navigate('/');
          } else if (role === 'Admin') {
            const adminData = {
              admin_id: user_id,
              admin: user,
              isLogin: true,
              role,
            };
            dispatch(adminLogin(adminData));
            localStorage.setItem('role', role);
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminRefreshToken', refreshToken);
            navigate('/admin/dashboard');
          } else {
            setServerError('Invalid role received. Please contact support.');
          }
        }
      }
    } catch (error: any) {
      console.log('Google login error:', error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full max-h-[85vh]">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center p-6 overflow-auto bg-white rounded-lg">
            <div className="w-full">
              <SigninForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                serverError={serverError}
              />
              <GoogleSigninButton googleSignIn={googleSignIn} />
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