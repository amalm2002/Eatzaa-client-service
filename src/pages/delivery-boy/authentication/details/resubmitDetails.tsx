import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import ResubmitHeader from '../../../../components/delivery-boy/authentication-details/ResubmitHeader';
import ResubmitPersonalInfoForm from '../../../../components/delivery-boy/authentication-details/ResubmitPersonalInfoForm';
import ResubmitDocumentsForm from '../../../../components/delivery-boy/authentication-details/ResubmitDocumentsForm';
import ResubmitBankDetailsForm from '../../../../components/delivery-boy/authentication-details/ResubmitBankDetailsForm';
import { ResubmitDetailsPageProps } from '../../../../interfaces/delivery-boy/authentication/resubmit-details.types';
import { UserDetails } from '../../../../interfaces/delivery-boy/authentication/user-details.types';
import { deliveryBoyApi } from '../../../../api/endpoints/deliveryBoyApi';

const ResubmitDetailsPage: React.FC<ResubmitDetailsPageProps> = ({ userDetails, setUserDetails, handleNavigation }) => {
    const [errors, setErrors] = useState<Partial<Record<keyof UserDetails, string>>>({});
    const [activeSection, setActiveSection] = useState<'personal' | 'documents' | 'bank'>('personal');
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [existingPanCardImages, setExistingPanCardImages] = useState<string[]>([]);
    const [existingLicenseImages, setExistingLicenseImages] = useState<string[]>([]);
    const [existingProfileImage, setExistingProfileImage] = useState<string | null>(null);
    const [changedFields, setChangedFields] = useState<Partial<Record<keyof UserDetails, boolean>>>({});

    const dispatch = useDispatch();
    const deliveryBoyId = localStorage.getItem('deliveryBoyId') ?? '';

    useEffect(() => {
        const fetchTheResubmitDocs = async () => {
            try {
                const data = await deliveryBoyApi.fetchResubmitDocuments(dispatch, deliveryBoyId);
                // console.log('Fetched resubmit data:', data);
                const fetchedData = data.fetchRejectedDocs.data;

                setExistingPanCardImages(fetchedData.panCard?.images || []);
                setExistingLicenseImages(fetchedData.license?.images || []);
                setExistingProfileImage(fetchedData.profileImage || null);

                setUserDetails({
                    name: fetchedData.name || '',
                    mobile: fetchedData.mobile || '',
                    panCard: fetchedData.panCard?.number || '',
                    panCardImages: [null, null],
                    license: fetchedData.license?.number || '',
                    licenseImages: [null, null],
                    bankAccount: fetchedData.bankDetails?.accountNumber || '',
                    ifscCode: fetchedData.bankDetails?.ifscCode || '',
                    profileImage: null,
                });

                setRejectionReason(fetchedData.rejectionReason || 'Please resubmit the required documents.');
            } catch (error) {
                console.error('Error fetching resubmit documents:', error);
                toast.error('Error fetching resubmit documents');
            }
        };

        if (deliveryBoyId) {
            fetchTheResubmitDocs();
        }
    }, [deliveryBoyId, setUserDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
        setChangedFields({ ...changedFields, [name]: true });
        setErrors({ ...errors, [name]: '' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'panCardImages' | 'licenseImages', index: number): void => {
        if (e.target.files && e.target.files[0]) {
            const newImages = [...userDetails[field]];
            newImages[index] = e.target.files[0];
            setUserDetails({ ...userDetails, [field]: newImages });
            setChangedFields({ ...changedFields, [field]: true });
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage'): void => {
        if (e.target.files && e.target.files[0]) {
            setUserDetails({ ...userDetails, [field]: e.target.files[0] });
            setChangedFields({ ...changedFields, [field]: true });
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof UserDetails, string>> = {};
        if (!userDetails.name) newErrors.name = 'Full name is required';
        if (!userDetails.panCard) newErrors.panCard = 'PAN card number is required';
        if (userDetails.panCardImages.every((img) => img === null) && (!existingPanCardImages[0] || !existingPanCardImages[1])) {
            newErrors.panCardImages = 'Both front and back images are required';
        }
        if (!userDetails.license) newErrors.license = 'License number is required';
        if (userDetails.licenseImages.every((img) => img === null) && (!existingLicenseImages[0] || !existingLicenseImages[1])) {
            newErrors.licenseImages = 'Both front and back images are required';
        }
        if (!userDetails.bankAccount) newErrors.bankAccount = 'Bank account number is required';
        if (!userDetails.ifscCode) newErrors.ifscCode = 'IFSC code is required';
        if (!userDetails.profileImage && !existingProfileImage) newErrors.profileImage = 'Profile photo is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const data = await deliveryBoyApi.resubmitDeliveryBoyDetails(dispatch, deliveryBoyId, userDetails, changedFields);
                console.log('Resubmitted Doc data response:', data);
                toast.success('Details resubmitted successfully!');
                handleNavigation('login');
            } catch (error: any) {
                toast.error(error.message || 'Error resubmitting details');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl w-full">
            <ResubmitHeader activeSection={activeSection} setActiveSection={setActiveSection} rejectionReason={rejectionReason} />
            <form onSubmit={handleSubmit} className="space-y-4">
                {activeSection === 'personal' && (
                    <ResubmitPersonalInfoForm
                        userDetails={userDetails}
                        handleInputChange={handleInputChange}
                        handleSingleFileChange={handleSingleFileChange}
                        errors={errors}
                        existingProfileImage={existingProfileImage}
                    />
                )}
                {activeSection === 'documents' && (
                    <ResubmitDocumentsForm
                        userDetails={userDetails}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                        errors={errors}
                        existingPanCardImages={existingPanCardImages}
                        existingLicenseImages={existingLicenseImages}
                    />
                )}
                {activeSection === 'bank' && (
                    <ResubmitBankDetailsForm
                        userDetails={userDetails}
                        handleInputChange={handleInputChange}
                        errors={errors}
                    />
                )}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                    >
                        Resubmit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResubmitDetailsPage;