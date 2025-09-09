import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import DetailsHeader from '../../../../components/delivery-boy/authentication-details/DetailsHeader';
import PersonalInfoForm from '../../../../components/delivery-boy/authentication-details/PersonalInfoForm';
import DocumentsForm from '../../../../components/delivery-boy/authentication-details/DocumentsForm';
import BankDetailsForm from '../../../../components/delivery-boy/authentication-details/BankDetailsForm';
import { DetailsPageProps } from '../../../../interfaces/delivery-boy/authentication/details-form.types';
import { UserDetails } from '../../../../interfaces/delivery-boy/authentication/user-details.types';
import { deliveryBoyApi } from '../../../../api/endpoints/deliveryBoyApi';

const DetailsPage: React.FC<DetailsPageProps> = ({ userDetails, setUserDetails, handleNavigation }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof UserDetails, string>>>({});
  const [activeSection, setActiveSection] = useState<'personal' | 'documents' | 'bank'>('personal');
  const dispatch = useDispatch();
  const deliveryBoyId = localStorage.getItem('deliveryBoyId') ?? '';

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
        const data = await deliveryBoyApi.submitDeliveryBoyDetails(dispatch, deliveryBoyId, userDetails);
        toast.success('Details updated successfully!');
        handleNavigation('vehicle');
      } catch (error: any) {
        toast.error(error.message || 'Error updating details');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl w-full">
      <DetailsHeader
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleNavigation={handleNavigation}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeSection === 'personal' && (
          <PersonalInfoForm
            userDetails={userDetails}
            handleInputChange={handleInputChange}
            handleSingleFileChange={handleSingleFileChange}
            errors={errors}
          />
        )}
        {activeSection === 'documents' && (
          <DocumentsForm
            userDetails={userDetails}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        )}
        {activeSection === 'bank' && (
          <BankDetailsForm
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
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailsPage;