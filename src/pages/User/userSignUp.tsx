import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../../components/Navbar";
import { validateSignup } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import createAxios from "../../service/axiousServices/userAxious";
import { EyeIcon, EyeOffIcon } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode'
// import { userLogin } from "../../redux/slices/userAuthSlice";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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

  // const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (serverError) {
      setServerError(null)
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
      const axiosInstance = createAxios()

      try {

        const response = await axiosInstance.post('/checkUser', { email: formData.email, name: formData.name })

        if (response.data.message === 'user already have an account !') {
          toast.error(response.data.message)
        } else {
          toast.success('Signup successful! Redirecting to OTP...', {
            position: 'top-right',
            autoClose: 3000,
          });
          setTimeout(() => {
            navigate('/otp', { state: { email: formData.email, formData } })
          }, 3000);
        }

      } catch (error: any) {
        toast.error(error.response?.data?.message || "Signup failed");
      }

    }
  };


  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-white overflow-hidden">
        <ToastContainer />
        <div className="flex flex-col md:flex-row bg-[rgb(60,110,113)] shadow-lg rounded-lg overflow-hidden max-w-4xl w-full max-h-[85vh]">
          {/* Right Side - Branding Message */}
          <div className="hidden md:flex flex-1 bg-[rgb(60,110,113)] text-white p-12 flex-col justify-center items-center max-h-[85vh] overflow-auto">
            <h2 className="text-3xl font-bold">FoodHub</h2>
            <h3 className="text-xl mt-2">Taste Excellence</h3>
            <p className="mt-4 text-center">
              Join our community and explore delightful meals at your convenience.
            </p>
            <ul className="mt-6 space-y-3 text-left w-full">
              <li className="flex items-center">
                <span className="text-white/80 mr-2">✔</span> Quick & easy ordering
              </li>
              <li className="flex items-center">
                <span className="text-white/80 mr-2">✔</span> Exclusive offers
              </li>
              <li className="flex items-center">
                <span className="text-white/80 mr-2">✔</span> 24/7 Customer support
              </li>
            </ul>
            <div className="mt-6 text-sm text-center w-full text-white/80">
              <p>📍 123 Gourmet Street, Foodville</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Left Side - Sign-Up Form */}
          <div className="flex-1 flex justify-center items-center p-6 overflow-auto bg-white rounded-lg">
            <div className="max-w-md w-full p-8">
              <h2 className="text-2xl font-semibold text-[rgb(60,110,113)] text-center">
                Create Your Account
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[rgb(60,110,113)]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[rgb(60,110,113)]">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[rgb(60,110,113)]">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[rgb(60,110,113)]">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[rgb(60,110,113)] text-white py-2 rounded-lg hover:bg-[rgb(50,100,103)] mt-4 transition-all"
                >
                  Sign Up
                </button>
              </form>

              <div className="text-center my-4 text-[rgb(60,110,113)]/80">OR SIGN UP WITH</div>
              <div className="flex space-x-4 justify-center">
                <button className="w-1/2 bg-white border py-2 rounded-lg flex items-center justify-center shadow hover:bg-[rgb(60,110,113)]/10">
                  <img
                    src="https://img.icons8.com/color/24/google-logo.png"
                    alt="Google"
                    className="mr-2"
                  />
                  Google
                </button>
                <button className="w-1/2 bg-white border py-2 rounded-lg flex items-center justify-center shadow hover:bg-[rgb(60,110,113)]/10">
                  <img
                    src="https://img.icons8.com/color/24/facebook.png"
                    alt="Facebook"
                    className="mr-2"
                  />
                  Facebook
                </button>

              </div>

              <p className="text-center text-[rgb(60,110,113)] mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-[rgb(60,110,113)] font-semibold">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;