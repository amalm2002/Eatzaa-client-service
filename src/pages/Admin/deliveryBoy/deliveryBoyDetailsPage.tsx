import { useState, useEffect } from 'react';
import { User, FileText, Check, X, AlertCircle, Clock, Info, Bike, MapPin, CreditCard, Phone, Calendar } from 'lucide-react';
import { Header } from '../header/header';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

interface DeliveryBoyDetailsProps {
  deliveryBoyId: string;
  setActivePage: (page: string) => void;
  activePage: string;
}

const DeliveryBoyDetails: React.FC<DeliveryBoyDetailsProps> = ({ deliveryBoyId, activePage, setActivePage }) => {
  const [deliveryBoy, setDeliveryBoy] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

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
        const response = await axiosInstance.get(`/getDeliveryBoy/${deliveryBoyId}`);

        if (response.data.message === 'success') {
          const data = response.data.response;
          setDeliveryBoy({
            id: data._id,
            name: data.name,
            mobile: data.mobile,
            isVerified: data.isVerified,
            isRejected: data.rejectionReason ? true : false,
            rejectionReason: data.rejectionReason || '',
            panCard: {
              number: data.panCard?.number,
              images: data.panCard?.images,
            },
            license: {
              number: data.license?.number,
              images: data.license?.images,
            },
            bankDetails: {
              accountNumber: data.bankDetails?.accountNumber,
              ifscCode: data.bankDetails?.ifscCode,
            },
            profileImage: data.profileImage,
            vehicle: data.vehicle,
            zone: {
              id: data.zone?.id,
              name: data.zone?.name,
            },
            status: data.status,
            isOnline: data.isOnline,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        } else {
          toast.error('Failed to load delivery boy details');
        }
      } catch (error) {
        console.error('Error fetching delivery boy details:', error);
        toast.error('Error loading delivery boy details');
      }
    };
    fetchDeliveryBoyDetails();
  }, [deliveryBoyId]);

  const handleVerify = async () => {
    try {
      const response = await axiosInstance.post(`/verifyDeliveryBoyDocs/${deliveryBoyId}`);
      // console.log('verification responseeee :', response);

      if (response.data.message === 'success') {

        setDeliveryBoy((prev: any) => ({
          ...prev,
          isVerified: response.data.response.isVerified,
          isRejected: false,
          rejectionReason: '',
        }));

        toast.success('Delivery boy has been successfully verified!');
      } else {
        toast.error('Failed to verify delivery boy');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    }
  };

  const handleReject = async () => {
    try {
      const response = await axiosInstance.post(`/rejectDeliveryBoyDocs`, {
        deliveryBoyId,
        rejectionReason,
      });
      // console.log('rejection response :',response);

      if (response.data.message === 'success') {
        setDeliveryBoy((prev: any) => ({
          ...prev,
          isVerified: false,
          isRejected: true,
          rejectionReason,
        }));
        toast.success('Delivery boy has been rejected successfully!');
      } else {
        toast.error('Failed to reject delivery boy');
      }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Profile Section */}
      <div className="flex-1 pt-20 sm:pt-24 max-w-[90rem] mx-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow">
                <img
                  src={deliveryBoy.profileImage}
                  alt={deliveryBoy.name}
                  className="h-full w-full object-cover"
                />
                {deliveryBoy.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">{deliveryBoy.name}</h1>
                <div className="ml-3 flex space-x-2">
                  {getStatusBadge()}
                  {getOnlineBadge()}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Bike className="mr-1 h-4 w-4 text-orange-500" />
                <span className="mr-3">{deliveryBoy.vehicle}</span>
                <MapPin className="mr-1 h-4 w-4 text-orange-500" />
                <span>{deliveryBoy.zone.name}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            {!deliveryBoy.isVerified && !deliveryBoy.isRejected ? (
              <>
                <button
                  onClick={handleVerify}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  <Check className="mr-2 h-4 w-4" /> Verify Partner
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  <X className="mr-2 h-4 w-4" /> Reject Partner
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md">
                {deliveryBoy.isVerified ? 'Partner Verified' : 'Partner Rejected'}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {['overview', 'documents', 'personal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                    border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
                    ${activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-orange-500" />
                  Delivery Partner Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and status.</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: User, label: 'Full Name', value: deliveryBoy.name },
                    { icon: Phone, label: 'Mobile', value: deliveryBoy.mobile },
                    { icon: MapPin, label: 'Zone', value: deliveryBoy.zone.name },
                    { icon: Bike, label: 'Vehicle', value: deliveryBoy.vehicle },
                    { icon: Clock, label: 'Status', value: deliveryBoy.status },
                    { icon: Calendar, label: 'Joined', value: formatDate(deliveryBoy.createdAt) },
                  ].map((item, index) => (
                    <div key={index} className="flex group hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <item.icon className="h-6 w-6 text-orange-400 group-hover:text-orange-500 transition-colors duration-200" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
                        <p className="mt-1 text-sm text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {deliveryBoy.isRejected && (
              <div className="bg-red-50 border border-red-200 rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{deliveryBoy.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-orange-500" />
                      Verification Documents
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Review uploaded identity and legal documents
                    </p>
                  </div>

                  {!deliveryBoy.isVerified && !deliveryBoy.isRejected && (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleVerify}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">PAN Card</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Front', 'Back'].map((side, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                          onClick={() => handleImageClick(deliveryBoy.panCard.images[idx])}
                        >
                          <div className="aspect-w-3 aspect-h-2 bg-gray-100 relative">
                            <img
                              src={deliveryBoy.panCard.images[idx]}
                              alt={`PAN Card ${side}`}
                              className="object-cover cursor-pointer group-hover:opacity-80 transition-opacity duration-200"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <span className="text-white font-medium bg-orange-500 px-2 py-1 rounded-md text-xs">Zoom</span>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50">
                            <p className="text-xs font-medium text-gray-500">PAN Card {side}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="font-medium mr-1">PAN Number:</span> {deliveryBoy.panCard.number}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Driving License</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Front', 'Back'].map((side, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                          onClick={() => handleImageClick(deliveryBoy.license.images[idx])}
                        >
                          <div className="aspect-w-3 aspect-h-2 bg-gray-100 relative">
                            <img
                              src={deliveryBoy.license.images[idx]}
                              alt={`License ${side}`}
                              className="object-cover cursor-pointer group-hover:opacity-80 transition-opacity duration-200"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <span className="text-white font-medium bg-orange-500 px-2 py-1 rounded-md text-xs">Zoom</span>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50">
                            <p className="text-xs font-medium text-gray-500">License {side}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="font-medium mr-1">License Number:</span> {deliveryBoy.license.number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <User className="mr-2 h-5 w-5 text-orange-500" />
                  Personal & Banking Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Secure personal and payment details
                </p>
              </div>

              <div className="border-t border-gray-200">
                <dl>
                  {[
                    { label: 'Full Name', value: deliveryBoy.name },
                    { label: 'Mobile Number', value: deliveryBoy.mobile },
                    { label: 'PAN Card Number', value: deliveryBoy.panCard.number },
                    { label: 'License Number', value: deliveryBoy.license.number },
                    { label: 'Vehicle Type', value: deliveryBoy.vehicle },
                    { label: 'Bank Account Number', value: deliveryBoy.bankDetails.accountNumber },
                    { label: 'IFSC Code', value: deliveryBoy.bankDetails.ifscCode },
                    { label: 'Service Zone', value: deliveryBoy.zone.name },
                    { label: 'Account Created', value: formatDate(deliveryBoy.createdAt) },
                    { label: 'Last Updated', value: formatDate(deliveryBoy.updatedAt) },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-gray-100 transition-colors duration-200`}
                    >
                      <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* </div> */}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowRejectModal(false)}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reject Delivery Partner
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please select a reason for rejecting this delivery partner. This will prevent them from accepting orders.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-2">
                    {commonReasons.map((reason, idx) => (
                      <label
                        key={idx}
                        className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      >
                        <input
                          type="radio"
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                          value={reason}
                          checked={rejectionReason === reason}
                          onChange={() => setRejectionReason(reason)}
                          name="rejection-reason"
                        />
                        <span className="ml-3 text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={!rejectionReason}
                  onClick={handleReject}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {zoomedImage && (
        <div
          className="fixed z-20 inset-0 overflow-y-auto"
          aria-labelledby="image-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity duration-200"
              onClick={() => setZoomedImage(null)}
              aria-hidden="true"
            ></div>

            <div className="inline-block align-middle bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all sm:max-w-3xl sm:w-full">
              <div className="relative">
                <img
                  src={zoomedImage}
                  alt="Document Zoom"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  onClick={() => setZoomedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                  aria-label="Close image modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyDetails;