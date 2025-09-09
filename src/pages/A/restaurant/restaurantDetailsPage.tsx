import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import RestaurantDetailsHeader from '../../../components/admin/restaurant/details/RestaurantDetailsHeader';
import RestaurantDetailsTabs from '../../../components/admin/restaurant/details/RestaurantDetailsTabs';
import RestaurantDetailsOverview from '../../../components/admin/restaurant/details/RestaurantDetailsOverview';
import RestaurantDetailsDocuments from '../../../components/admin/restaurant/details/RestaurantDetailsDocuments';
import RestaurantDetailsContact from '../../../components/admin/restaurant/details/RestaurantDetailsContact';
import RestaurantDetailsModals from '../../../components/admin/restaurant/details/RestaurantDetailsModals';
import { RestaurantDetailsProps, Restaurant } from '../../../interfaces/admin/restaurants/restaurant-details.types';
import { adminApi } from '../../../api/endpoints/adminApi';

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await adminApi.fetchRestaurantDetails(dispatch, restaurantId);
        const responseData = data.response;
        setRestaurant({
          id: responseData._id,
          restaurantName: responseData.restaurantName,
          email: responseData.email,
          mobile: responseData.mobile,
          isVerified: responseData.isVerified || false,
          isRejected: responseData.rejectionReason ? true : false,
          rejectionReason: responseData.rejectionReason || '',
          location: {
            longitude: responseData.location?.longitude,
            latitude: responseData.location?.latitude,
            address: responseData.address || '123 Food Street, Foodville',
          },
          cuisine: responseData.cuisine || ['North Indian', 'Chinese', 'Fast Food'],
          rating: responseData.rating || 4.2,
          avgDeliveryTime: responseData.avgDeliveryTime,
          restaurantDocuments: {
            idProofUrl: responseData.restaurantDocuments?.idProofUrl,
            fssaiLicenseUrl: responseData.restaurantDocuments?.fssaiLicenseUrl,
            businessCertificateUrl: responseData.restaurantDocuments?.businessCertificateUrl,
            bankAccountNumber: responseData.restaurantDocuments?.bankAccountNumber,
            ifscCode: responseData.restaurantDocuments?.ifscCode,
          },
          coverImage: responseData.coverImage || '/api/placeholder/1200/400',
          logo: responseData.logo || '/api/placeholder/150/150',
          description: responseData.description || 'A delightful restaurant serving authentic cuisine with passion and care.',
          openingHours: responseData.openingHours || '10:00 AM - 11:00 PM',
        }); 
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        toast.error('Error loading restaurant details');
      }
    };
    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleVerify = async () => {
    try {
      const response = await adminApi.verifyRestaurantDocuments(dispatch, restaurant!.id);
      setRestaurant((prev) => ({
        ...prev!,
        isVerified: response.response.isVerified,
      }));
      toast.success('Restaurant has been successfully verified!');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    }
  };

  const handleReject = async () => {
    try {
      const response = await adminApi.rejectRestaurantDocuments(dispatch, restaurant!.id, rejectionReason);
      setRestaurant((prev) => ({
        ...prev!,
        isRejected: true,
        rejectionReason: rejectionReason,
      }));
      toast.success('Restaurant has been rejected successfully!');
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error('An error occurred during rejection');
    }
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const handleImageClick = (url: string) => {
    setZoomedImage(url);
  };

  const getCloudinaryUrl = (path: string) => {
    if (!path || path.startsWith('/api/placeholder')) return path;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${path}`;
  };

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <RestaurantDetailsHeader restaurant={restaurant} />
        <RestaurantDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'overview' && <RestaurantDetailsOverview restaurant={restaurant} />}
          {activeTab === 'documents' && (
            <RestaurantDetailsDocuments
              restaurant={restaurant}
              handleVerify={handleVerify}
              setShowRejectModal={setShowRejectModal}
              handleImageClick={handleImageClick}
              getCloudinaryUrl={getCloudinaryUrl}
            />
          )}
          {activeTab === 'contact' && <RestaurantDetailsContact restaurant={restaurant} />}
        </main>
        <RestaurantDetailsModals
          showRejectModal={showRejectModal}
          setShowRejectModal={setShowRejectModal}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          handleReject={handleReject}
          zoomedImage={zoomedImage}
          setZoomedImage={setZoomedImage}
          restaurant={restaurant}
        />
      </div>
    </div>
  );
};

export default RestaurantDetails;