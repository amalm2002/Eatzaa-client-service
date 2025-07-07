import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { validateSignup } from '../../../utils/validation';
import Navbar from '../../../components/user/layouts/Navbar';
import SignupForm from '../../../components/user/authentication/SignupForm';
import SocialSignupButtons from '../../../components/user/authentication/SocialSignupButtons';
import Sidebar from '../../../components/user/authentication/SideBar';
import { FormData } from '../../../interfaces/user/authentication/login/form-data.types';
import { userApi } from '../../../api/endpoints/userApi';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateSignup(formData);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    } else {
      try {
        setIsLoading(true);
        await userApi.checkUser(dispatch, {
          email: formData.email,
          name: formData.name,
        });

        toast.success('Signup successful! Redirecting to OTP...', {
          position: 'top-right',
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate('/otp', { state: { email: formData.email, formData } });
        }, 3000);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Signup failed');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      }
    }
  };

  const handleGoogleClick = () => {
    toast.info('Google sign-up not implemented yet.');
  };

  const handleFacebookClick = () => {
    toast.info('Facebook sign-up not implemented yet.');
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-white overflow-hidden">
        <ToastContainer />
        <div className="flex flex-col md:flex-row bg-[rgb(60,110,113)] shadow-lg rounded-lg overflow-hidden max-w-4xl w-full max-h-[85vh]">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center p-6 overflow-auto bg-white rounded-lg">
            <div className="w-full">
              <SignupForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
              <SocialSignupButtons
                onGoogleClick={handleGoogleClick}
                onFacebookClick={handleFacebookClick}
              />
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-white/15 bg-opacity-70 z-50 flex justify-center items-center">
            <DotLottieReact
              src="https://lottie.host/462a8621-e5ac-48c4-b8d0-1055ba28ab8d/K1RLg3Jf8G.lottie"
              loop
              autoplay
              style={{ width: '350px', height: '350px' }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SignupPage;