import { Mail, Phone, Store, Clock, Calendar, Users } from "lucide-react";
import { CredentialsFormProps } from "../../../../interfaces/restaurant/authentication/register/credentials-form.types";

const CredentialsForm = ({ formData, validationErrors, error, handleChange, handleSubmit, showAnimation }: CredentialsFormProps) => {
  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <Store className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500">Register your restaurant in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
              <Store className="text-blue-500 mr-2" />
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className={`w-full focus:outline-none ${validationErrors.restaurantName ? "border-red-500" : ""}`}
                placeholder="Enter your restaurant name"
              />
            </div>
            {validationErrors.restaurantName && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.restaurantName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
              <Mail className="text-blue-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full focus:outline-none ${validationErrors.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
              <Phone className="text-blue-500 mr-2" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 Enter 10-digit mobile number"
                className={`w-full focus:outline-none ${validationErrors.mobile ? "border-red-500" : ""}`}
              />
            </div>
            {validationErrors.mobile && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
            )}
          </div>

          <div className="pt-2 relative">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 md:py-4 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-blue-900 transition duration-300 shadow-lg"
              disabled={showAnimation}
            >
              Register Now
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between text-sm mt-4 text-gray-500 space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>2 min setup</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>24/7 support</span>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            By registering, you agree to our{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Already have an account?{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              <a href="/restaurant/login">Login instead</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CredentialsForm;