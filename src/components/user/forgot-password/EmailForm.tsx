import { EmailFormProps } from "../../../interfaces/user/authentication/forgotPassword/email-form.types";

const EmailForm = ({ formData, handleChange, handleSendOtp, errors }: EmailFormProps) => {
    return (
        <div className="max-w-md w-full space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                <p className="text-gray-500 mt-2">Enter your email to receive an OTP</p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] transition-all`}
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[rgb(60,110,113)] text-white py-3 rounded-lg hover:bg-[rgb(50,100,105)] transition-all transform hover:scale-105"
                >
                    Send OTP
                </button>
            </form>
        </div>
    );
};

export default EmailForm;