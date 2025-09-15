import { useState } from "react";
import OtpPage from "./otp/otpPage";
import DetailsPage from "./details/detailsPage";
import VehiclePage from "./vehicle/vehicle";
import ZoneShiftPage from "./zone/zoneSelectPage";
import DeliveryBoyLocation from "./location/deliveryBoyLocationPage";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../../hooks/auth";
import { auth } from "../../../service/firebase/firebase";
import { toast } from "sonner";
import { Clock, X } from "lucide-react";
import ResubmitDetailsPage from "./details/resubmitDetails";
import { UserDetails } from "../../../interfaces/delivery-boy/authentication/user-details.types";
import { Page } from "../../../interfaces/delivery-boy/authentication/login.types";
import { LoginPageProps } from "../../../interfaces/delivery-boy/authentication/login.types";
import { deliveryBoyApi } from "../../../api/endpoints/deliveryBoyApi";

// declare global {
//     interface Window {
//         recaptchaVerifier?: RecaptchaVerifier;
//     }
// }

// if (window.recaptchaVerifier) {
//     window.recaptchaVerifier.clear();
// }

const DeliveryBoyLogin: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    // const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: '',
        mobile: '',
        panCard: '',
        panCardImages: [null, null],
        license: '',
        licenseImages: [null, null],
        bankAccount: '',
        ifscCode: '',
        profileImage: null,
    });
    const [vehicle, setVehicle] = useState<string>('');
    const [zone, setZone] = useState<string>('');
    const [shift, setShift] = useState<string>('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [backendData, setBackendData] = useState<{
        token: string;
        refreshToken: string;
        _id: string;
        mobile: string;
        isVerified: boolean;
        message: string;
        missingFields: string;
        rejectionReason?: string;
    } | null>(null);
    const [showVerificationPopup, setShowVerificationPopup] = useState<boolean>(false);
    const [showRejectionPopup, setShowRejectionPopup] = useState<boolean>(false);

    const dispatch = useDispatch();

    const handleNavigation = (page: Page): void => {
        setCurrentPage(page);
    };

    const getProgress = (): number => {
        const steps: Page[] = ['login', 'otp', 'location', 'details', 'vehicle', 'zone', 'resubmit'];
        const currentIndex = steps.indexOf(currentPage);
        return ((currentIndex + 1) / steps.length) * 100;
    };

    const handleSendOtp = async (mobile: string) => {
        try {

            // const { data } = await axiosInstance.post('/deliveryBoy-rigister', { mobile });
            // console.log('login data is :', data);
            const data = await deliveryBoyApi.registerDeliveryBoy(dispatch, mobile)
            console.log('data is :',data);
            
            setBackendData({
                token: data.token,
                refreshToken: data.refreshToken,
                _id: data._id,
                mobile: data.mobile,
                isVerified: data.isVerified,
                message: data.message,
                missingFields: data.missingFields,
                rejectionReason: data.rejectionReason,
            });
            setMobileNumber(mobile);

            if (data.isActive === false) {
                toast.warning('Your Account has been blocked by admin');
            } else if (data.isRejected && data.message === "You are already registered" && !data.isVerified) {
                setShowRejectionPopup(true);
            } else if (data.message === "You are already registered" && !data.isVerified) {
                setShowVerificationPopup(true);
            } else {
                sendOtp(handleNavigation, auth, mobile, setConfirmationResult);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Error sending OTP. Please try again.');
        }
    };

    const handleResubmit = () => {
        setShowRejectionPopup(false);
        handleNavigation('resubmit');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage setMobileNumber={setMobileNumber} handleNavigation={handleNavigation} handleSendOtp={handleSendOtp} />;
            case 'otp':
                return (
                    <OtpPage
                        mobileNumber={mobileNumber}
                        setOtp={setOtp}
                        handleNavigation={handleNavigation}
                        confirmationResult={confirmationResult}
                        backendData={backendData}
                    />
                );
            case 'details':
                return <DetailsPage userDetails={userDetails} setUserDetails={setUserDetails} handleNavigation={handleNavigation} />;
            case 'resubmit':
                return <ResubmitDetailsPage userDetails={userDetails} setUserDetails={setUserDetails} handleNavigation={handleNavigation} />;
            case 'vehicle':
                return <VehiclePage vehicle={vehicle} setVehicle={setVehicle} handleNavigation={handleNavigation} />;
            case 'location':
                return <DeliveryBoyLocation handleNavigation={handleNavigation} />;
            case 'zone':
                return <ZoneShiftPage zone={zone} setZone={setZone} shift={shift} setShift={setShift} handleNavigation={handleNavigation} />;
            default:
                return <LoginPage setMobileNumber={setMobileNumber} handleNavigation={handleNavigation} handleSendOtp={handleSendOtp} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                {currentPage !== 'login' && (
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-medium text-orange-600">
                                {currentPage === 'otp' && 'Verification'}
                                {currentPage === 'location' && 'Location Selection'}
                                {currentPage === 'details' && 'Profile Details'}
                                {currentPage === 'vehicle' && 'Vehicle Selection'}
                                {currentPage === 'zone' && 'Zone & Shift'}
                            </span>
                            <span className="text-xs font-medium text-orange-600">{Math.round(getProgress())}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${getProgress()}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                {showVerificationPopup && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
                            <Clock className="w-7 h-7 text-white animate-pulse" />
                            <div className="flex-1">
                                <p className="font-extrabold text-lg">Verification Pending!</p>
                                <p className="text-sm opacity-90">
                                    You are already registered. Please wait for admin to verify your documents via email, then try logging in again.
                                </p>
                            </div>
                            <X
                                className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
                                onClick={() => setShowVerificationPopup(false)}
                            />
                        </div>
                    </div>
                )}
                {showRejectionPopup && backendData?.rejectionReason && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
                            <Clock className="w-7 h-7 text-white animate-pulse" />
                            <div className="flex-1">
                                <p className="font-extrabold text-lg">Document Rejected!</p>
                                <p className="text-sm opacity-90">
                                    Your documents were rejected. Reason: {backendData.rejectionReason}
                                </p>
                                <button
                                    onClick={handleResubmit}
                                    className="mt-4 bg-white text-yellow-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Resubmit
                                </button>
                            </div>
                            <X
                                className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
                                onClick={() => setShowRejectionPopup(false)}
                            />
                        </div>
                    </div>
                )}

                {renderPage()}
            </div>
        </div>
    );
};

const LoginPage: React.FC<LoginPageProps> = ({ setMobileNumber, handleNavigation, handleSendOtp }) => {
    const [localMobile, setLocalMobile] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (/^\d{10}$/.test(localMobile)) {
            setMobileNumber(localMobile);
            setError('');
            await handleSendOtp(localMobile);
        } else {
            setError('Please enter a valid 10-digit mobile number');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full overflow-hidden">
            <div className="text-center mb-8">
                <div className="bg-orange-500 text-white p-4 inline-block rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Delivery Partner</h1>
                <p className="text-gray-500 mt-2">Login to continue as delivery partner</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="mobile">
                        Mobile Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">+91</span>
                        </div>
                        <input
                            type="tel"
                            id="mobile"
                            value={localMobile}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalMobile(e.target.value.replace(/\D/g, ''))}
                            className={`w-full pl-12 pr-3 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                >
                    Get OTP
                </button>
                <div id="recaptcha-container"></div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    New to our platform?
                    <a href="" className="text-orange-600 font-medium ml-1 hover:text-orange-700">
                        Register Now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default DeliveryBoyLogin;