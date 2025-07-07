import { Mail, Phone, ArrowRight } from "lucide-react";
import { CredentialsFormProps } from "../../../../interfaces/restaurant/authentication/login/credentials-form.types";

const CredentialsForm: React.FC<CredentialsFormProps> = ({
  formData,
  errors,
  handleChange,
  handleSubmitCredentials,
}) => {
  return (
    <form onSubmit={handleSubmitCredentials} className="space-y-4">
      <div>
        <label className="block text-blue-100 font-medium mb-1">Email Address</label>
        <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
          <Mail className="text-blue-300 mr-2" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
            placeholder="your@email.com"
          />
        </div>
      </div>
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <div>
        <label className="block text-blue-100 font-medium mb-1">Mobile Number</label>
        <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
          <Phone className="text-blue-300 mr-2" />
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="+91 Enter 10-digit mobile number"
            className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
          />
        </div>
      </div>
      {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 flex items-center justify-center gap-2"
        >
          <span>Get OTP</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div id="recaptcha-container"></div>
    </form>
  );
};

export default CredentialsForm;