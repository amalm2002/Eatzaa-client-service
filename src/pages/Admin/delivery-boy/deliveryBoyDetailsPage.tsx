import { useState, useEffect } from 'react';
import { Check, X, Clock, } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import DeliveryBoyDetailsHeader from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsHeader';
import DeliveryBoyDetailsTabs from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsTabs';
import DeliveryBoyDetailsOverview from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsOverview';
import DeliveryBoyDetailsDocuments from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsDocuments';
import DeliveryBoyDetailsPersonal from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsPersonal';
import DeliveryBoyDetailsRejectModal from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsRejectModal';
import DeliveryBoyDetailsImageModal from '../../../components/admin/delivery-boy/details/DeliveryBoyDetailsImageModal';
import { DeliveryBoyDetailsProps } from '../../../interfaces/admin/delivery-boys/delivery-boy-details.types';
import { adminApi } from '../../../api/endpoints/adminApi';

const DeliveryBoyDetails: React.FC<DeliveryBoyDetailsProps> = ({ deliveryBoyId, activePage, setActivePage }) => {
  const [deliveryBoy, setDeliveryBoy] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const dispatch = useDispatch();

  const commonReasons = [
    'Invalid or expired PAN card',
    'Invalid or expired driving license',
    'Unreadable document images',
    'Bank details mismatch',
    'Profile image unclear or missing',
  ];

  useEffect(() => {
    const fetchDeliveryBoyDetails = async () => {
      try {
        const data = await adminApi.fetchDeliveryBoyDetails(dispatch, deliveryBoyId);
        const responseData = data.response;
        setDeliveryBoy({
          id: responseData._id,
          name: responseData.name,
          mobile: responseData.mobile,
          isVerified: responseData.isVerified,
          isRejected: responseData.rejectionReason ? true : false,
          rejectionReason: responseData.rejectionReason || '',
          panCard: {
            number: responseData.panCard?.number,
            images: responseData.panCard?.images,
          },
          license: {
            number: responseData.license?.number,
            images: responseData.license?.images,
          },
          bankDetails: {
            accountNumber: responseData.bankDetails?.accountNumber,
            ifscCode: responseData.bankDetails?.ifscCode,
          },
          profileImage: responseData.profileImage,
          vehicle: responseData.vehicle,
          zone: {
            id: responseData.zone?.id,
            name: responseData.zone?.name,
          },
          status: responseData.status,
          isOnline: responseData.isOnline,
          createdAt: responseData.createdAt,
          updatedAt: responseData.updatedAt,
        });
      } catch (error) {
        console.error('Error fetching delivery boy details:', error);
        toast.error('Error loading delivery boy details');
      }
    };
    fetchDeliveryBoyDetails();
  }, [deliveryBoyId]);

  const handleVerify = async () => {
    try {
      const response = await adminApi.verifyDeliveryBoyDocuments(dispatch, deliveryBoyId);
      setDeliveryBoy((prev: any) => ({
        ...prev,
        isVerified: response.response.isVerified,
        isRejected: false,
        rejectionReason: '',
      }));
      toast.success('Delivery boy has been successfully verified!');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    }
  };

  const handleReject = async () => {
    try {
      const response = await adminApi.rejectDeliveryBoyDocuments(dispatch, deliveryBoyId, rejectionReason);
      setDeliveryBoy((prev: any) => ({
        ...prev,
        isVerified: false,
        isRejected: true,
        rejectionReason,
      }));
      toast.success('Delivery boy has been rejected successfully!');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = () => {
    if (deliveryBoy.isVerified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    } else if (deliveryBoy.isRejected) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>
      );
    }
  };

  const getOnlineBadge = () => {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${deliveryBoy.isOnline
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
        }`}>
        <span className={`w-2 h-2 mr-1 rounded-full ${deliveryBoy.isOnline ? "bg-green-500" : "bg-gray-500"}`}></span>
        {deliveryBoy.isOnline ? "Online" : "Offline"}
      </span>
    );
  };

  if (!deliveryBoy) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading delivery partner details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeliveryBoyDetailsHeader
        deliveryBoy={deliveryBoy}
        getStatusBadge={getStatusBadge}
        getOnlineBadge={getOnlineBadge}
        handleVerify={handleVerify}
        handleReject={handleReject}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
      />
      <DeliveryBoyDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <DeliveryBoyDetailsOverview
            deliveryBoy={deliveryBoy}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            getOnlineBadge={getOnlineBadge}
          />
        )}
        {activeTab === 'documents' && (
          <DeliveryBoyDetailsDocuments
            deliveryBoy={deliveryBoy}
            handleVerify={handleVerify}
            handleReject={handleReject}
            showRejectModal={showRejectModal}
            setShowRejectModal={setShowRejectModal}
            handleImageClick={handleImageClick}
          />
        )}
        {activeTab === 'personal' && (
          <DeliveryBoyDetailsPersonal deliveryBoy={deliveryBoy} formatDate={formatDate} />
        )}
      </main>
      <DeliveryBoyDetailsRejectModal
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleReject={handleReject}
        commonReasons={commonReasons}
      />
      <DeliveryBoyDetailsImageModal zoomedImage={zoomedImage} setZoomedImage={setZoomedImage} />
    </>
  );
};

export default DeliveryBoyDetails;