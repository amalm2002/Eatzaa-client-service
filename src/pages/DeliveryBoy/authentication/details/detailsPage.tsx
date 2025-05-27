import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createAxios from "../../../../service/axiousServices/deliveryBoyAxious";
import { toast } from 'sonner';

type Page = 'login' | 'otp' | 'details' | 'vehicle' | 'zone' | 'location' | 'resubmit';

interface UserDetails {
    name: string;
    mobile: string;
    panCard: string;
    panCardImages: (File | null)[];
    license: string;
    licenseImages: (File | null)[];
    bankAccount: string;
    ifscCode: string;
    profileImage: File | null;
}

interface DetailsPageProps {
    userDetails: UserDetails;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
    handleNavigation: (page: Page) => void;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ userDetails, setUserDetails, handleNavigation }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof UserDetails, string>>>({});
    const [activeSection, setActiveSection] = useState<'personal' | 'documents' | 'bank'>('personal');
    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    // const deliveryBoyId = useSelector((store: { deliveryBoyAuth: { delivery_boy_id: string } }) => store.deliveryBoyAuth.delivery_boy_id);
    const deliveryBoyId = localStorage.getItem('deliveryBoyId')?? ''

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'panCardImages' | 'licenseImages', index: number): void => {
        if (e.target.files && e.target.files[0]) {
            const newImages = [...userDetails[field]];
            newImages[index] = e.target.files[0];
            setUserDetails({ ...userDetails, [field]: newImages });
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage'): void => {
        if (e.target.files && e.target.files[0]) {
            setUserDetails({ ...userDetails, [field]: e.target.files[0] });
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof UserDetails, string>> = {};
        if (!userDetails.name) newErrors.name = 'Full name is required';
        if (!userDetails.panCard) newErrors.panCard = 'PAN card number is required';
        if (userDetails.panCardImages.length < 2 || !userDetails.panCardImages[0] || !userDetails.panCardImages[1])
            newErrors.panCardImages = 'Both front and back images are required';
        if (!userDetails.license) newErrors.license = 'License number is required';
        if (userDetails.licenseImages.length < 2 || !userDetails.licenseImages[0] || !userDetails.licenseImages[1])
            newErrors.licenseImages = 'Both front and back images are required';
        if (!userDetails.bankAccount) newErrors.bankAccount = 'Bank account number is required';
        if (!userDetails.ifscCode) newErrors.ifscCode = 'IFSC code is required';
        if (!userDetails.profileImage) newErrors.profileImage = 'Profile photo is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const formData = new FormData();
                formData.append('deliveryBoyId', deliveryBoyId);
                formData.append('name', userDetails.name);
                formData.append('panCard[number]', userDetails.panCard);
                userDetails.panCardImages.forEach((image, index) => {
                    if (image) formData.append(`panCard[images][${index}]`, image);
                });
                formData.append('license[number]', userDetails.license);
                userDetails.licenseImages.forEach((image, index) => {
                    if (image) formData.append(`license[images][${index}]`, image);
                });
                formData.append('bankDetails[accountNumber]', userDetails.bankAccount);
                formData.append('bankDetails[ifscCode]', userDetails.ifscCode);
                if (userDetails.profileImage) formData.append('profileImage', userDetails.profileImage);
                

                const { data } = await axiosInstance.post('/details', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                console.log('detailssssssss :',data);
                

                if (data.success) {
                    toast.success('Details updated successfully!');
                    handleNavigation('vehicle');
                } else {
                    toast.error(data.message || 'Failed to update details');
                }
            } catch (error: any) {
                toast.error(error.message || 'Error updating details');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl w-full">
            <button
                onClick={() => handleNavigation('location')}
                className="mb-4 flex items-center text-orange-500 hover:text-orange-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Profile</h2>

            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeSection === 'personal'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500 hover:text-orange-500'
                        }`}
                    onClick={() => setActiveSection('personal')}
                >
                    Personal Info
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeSection === 'documents'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500 hover:text-orange-500'
                        }`}
                    onClick={() => setActiveSection('documents')}
                >
                    Documents
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeSection === 'bank'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500 hover:text-orange-500'
                        }`}
                    onClick={() => setActiveSection('bank')}
                >
                    Bank Details
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {activeSection === 'personal' && (
                    <>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userDetails.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Profile Photo
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                    {userDetails.profileImage ? (
                                        <img
                                            src={URL.createObjectURL(userDetails.profileImage)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="profileImage"
                                        className="bg-orange-50 text-orange-600 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer hover:bg-orange-100 transition"
                                    >
                                        Upload Photo
                                    </label>
                                    <input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSingleFileChange(e, 'profileImage')}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
                        </div>
                    </>
                )}

                {activeSection === 'documents' && (
                    <>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="panCard">
                                PAN Card Number
                            </label>
                            <input
                                type="text"
                                id="panCard"
                                name="panCard"
                                value={userDetails.panCard}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                                placeholder="Enter PAN card number"
                            />
                            {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                PAN Card Images
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                    <label
                                        htmlFor="panFront"
                                        className="block cursor-pointer"
                                    >
                                        {userDetails.panCardImages[0] ? (
                                            <img
                                                src={URL.createObjectURL(userDetails.panCardImages[0])}
                                                alt="PAN Front"
                                                className="w-full h-20 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-600">Front Side</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        id="panFront"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panCardImages', 0)}
                                        className="hidden"
                                    />
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                    <label
                                        htmlFor="panBack"
                                        className="block cursor-pointer"
                                    >
                                        {userDetails.panCardImages[1] ? (
                                            <img
                                                src={URL.createObjectURL(userDetails.panCardImages[1])}
                                                alt="PAN Back"
                                                className="w-full h-20 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-600">Back Side</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        id="panBack"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panCardImages', 1)}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {errors.panCardImages && <p className="text-red-500 text-xs mt-1">{errors.panCardImages}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="license">
                                License Number
                            </label>
                            <input
                                type="text"
                                id="license"
                                name="license"
                                value={userDetails.license}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                                placeholder="Enter license number"
                            />
                            {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                License Images
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                    <label
                                        htmlFor="licenseFront"
                                        className="block cursor-pointer"
                                    >
                                        {userDetails.licenseImages[0] ? (
                                            <img
                                                src={URL.createObjectURL(userDetails.licenseImages[0])}
                                                alt="License Front"
                                                className="w-full h-20 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-600">Front Side</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        id="licenseFront"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'licenseImages', 0)}
                                        className="hidden"
                                    />
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                    <label
                                        htmlFor="licenseBack"
                                        className="block cursor-pointer"
                                    >
                                        {userDetails.licenseImages[1] ? (
                                            <img
                                                src={URL.createObjectURL(userDetails.licenseImages[1])}
                                                alt="License Back"
                                                className="w-full h-20 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-600">Back Side</span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        id="licenseBack"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'licenseImages', 1)}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            {errors.licenseImages && <p className="text-red-500 text-xs mt-1">{errors.licenseImages}</p>}
                        </div>
                    </>
                )}

                {activeSection === 'bank' && (
                    <>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bankAccount">
                                Bank Account Number
                            </label>
                            <input
                                type="text"
                                id="bankAccount"
                                name="bankAccount"
                                value={userDetails.bankAccount}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                                placeholder="Enter bank account number"
                            />
                            {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ifscCode">
                                IFSC Code
                            </label>
                            <input
                                type="text"
                                id="ifscCode"
                                name="ifscCode"
                                value={userDetails.ifscCode}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                                placeholder="Enter IFSC code"
                            />
                            {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                        </div>
                    </>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DetailsPage;