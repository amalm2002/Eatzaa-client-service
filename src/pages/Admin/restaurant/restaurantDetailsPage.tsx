import { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Check, X, ExternalLink } from 'lucide-react';
import { Header } from '../header/header';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner'

interface RestaurantDetailsProps {
  activePage: string;
  setActivePage: (page: string) => void;
  restaurantId: string;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejected, setIsRejected] = useState(() => {
    const storedValue = localStorage.getItem(`isRejected_${restaurantId}`);
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

  const commonReasons = [
    'Invalid or expired FSSAI license',
    'Incomplete documentation',
    'Unreadable documents',
    'Business address verification failed',
    'Bank details mismatch',
  ];

  useEffect(() => {
    localStorage.setItem(`isRejected_${restaurantId}`, JSON.stringify(isRejected));
  }, [isRejected, restaurantId]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        // console.log('details page ', restaurantId);
        const response = await axiosInstance.get(`/getRestaurant/${restaurantId}`);
        console.log('response from the backend ', response);

        if (response.data.message === 'success') {
          const data = response.data.response;
          setRestaurant({
            id: data._id,
            restaurantName: data.restaurantName,
            email: data.email,
            mobile: data.mobile,
            isVerified: data.isVerified || false,
            location: {
              longitude: data.location?.longitude,
              latitude: data.location?.latitude,
            },
            restaurantDocuments: {
              idProofUrl: data.restaurantDocuments?.idProofUrl || '/api/placeholder/800/500',
              fssaiLicenseUrl: data.restaurantDocuments?.fssaiLicenseUrl || '/api/placeholder/800/500',
              businessCertificateUrl: data.restaurantDocuments?.businessCertificateUrl || '/api/placeholder/800/500',
              bankAccountNumber: data.restaurantDocuments?.bankAccountNumber || 'XXXX1234',
              ifscCode: data.restaurantDocuments?.ifscCode || 'SBIN0001234',
            },
          });
        } else {
          toast('Failed to load restaurant details');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        toast('Error loading restaurant details');
      }
    };
    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleVerify = async () => {
    try {
      const restaurantId = restaurant.id;
      const response = await axiosInstance.post(`/verifyRestaurantDocs/${restaurantId}`);

      if (response.data.message === 'success') {
        setRestaurant((prev: any) => ({
          ...prev,
          isVerified: response.data.response.isVerified,
        }));

        toast.success('Restaurant has been successfully verified!');
      } else {
        toast.error('Failed to verify restaurant');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    }
  };

  console.log(isRejected, 'rejectedddddddddd');
  const handleReject = async () => {
    const restaurantId = restaurant.id;

    try {
      const response = await axiosInstance.post(`/rejectedRestaurantDocs`, {
        restaurantId,
        rejectionReason,
      });

      console.log(response, 'rejection response');
      console.log('trueeeeeeeeee', response.data.isRejected);

      if (response.data.message === 'success') {
        setIsRejected(response.data.isRejected);
        toast.success('Restaurant has been rejected successfully!');
      } else {
        toast.error('Failed to reject restaurant');
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

  if (!restaurant) {
    return <div className='loding justify-items-center'>Loading...</div>;
  }

  return (<>

    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex-1 flex flex-col w-full">
        <Header />
        <main className=" pt-20 pl-0 pr-4  sm:pr-6 lg:pr-8 w-full">
          <div className="w-full mt-6">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 border border-gray-200 w-full">
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                      {restaurant.restaurantName}
                    </h2>
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-semibold text-white shadow-md ${restaurant.isVerified
                        ? 'bg-green-600'
                        : isRejected
                          ? 'bg-red-600'
                          : 'bg-yellow-500'
                        }`}
                    >
                      {restaurant.isVerified
                        ? 'Verified'
                        : isRejected
                          ? 'Rejected'
                          : 'Pending'}
                    </span>

                  </div>
                  <div className="flex gap-4">
                    {!restaurant.isVerified && !isRejected ? (
                      <>
                        <button
                          onClick={handleVerify}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl shadow-sm transition"
                        >
                          <Check className="w-4 h-4 inline mr-2" /> Verify
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-xl shadow-sm transition"
                        >
                          <X className="w-4 h-4 inline mr-2" /> Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-green-600 text-white font-medium px-6 py-2 rounded-xl shadow-sm opacity-70 cursor-not-allowed"
                          disabled
                        >
                          <Check className="w-4 h-4 inline mr-2" /> {restaurant.isVerified ? 'Verified' : 'Verify'}
                        </button>
                        <button
                          className="bg-red-600 text-white font-medium px-6 py-2 rounded-xl shadow-sm opacity-70 cursor-not-allowed"
                          disabled
                        >
                          <X className="w-4 h-4 inline mr-2" /> {isRejected ? 'Rejected' : 'Reject'}
                        </button>
                      </>
                    )}

                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Contact</h3>
                    <div className="flex items-center text-gray-700 gap-3">
                      <Mail className="text-teal-600 w-5 h-5" /> {restaurant.email}
                    </div>
                    <div className="flex items-center text-gray-700 gap-3">
                      <Phone className="text-teal-600 w-5 h-5" /> {restaurant.mobile}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Location</h3>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="text-teal-600 w-5 h-5 mt-1" />
                      <div>
                        <p>Latitude: {restaurant.location.latitude}</p>
                        <p>Longitude: {restaurant.location.longitude}</p>
                        <a
                          href={`https://maps.google.com/?q=${restaurant.location.latitude},${restaurant.location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline text-sm mt-1 inline-flex items-center"
                        >
                          View on Map <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Documents & Bank Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: 'ID Proof',
                        url: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${restaurant.restaurantDocuments.idProofUrl}`,
                      },
                      {
                        title: 'FSSAI License',
                        url: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${restaurant.restaurantDocuments.fssaiLicenseUrl}`,
                      },
                      {
                        title: 'Business Certificate',
                        url: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${restaurant.restaurantDocuments.businessCertificateUrl}`,
                      },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition cursor-pointer"
                        onClick={() => handleImageClick(doc.url)}
                      >
                        <h4 className="text-lg font-medium text-gray-800 mb-2">{doc.title}</h4>
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={doc.url}
                            alt={doc.title}
                            className="w-full h-32 object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow hover:shadow-md transition">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Bank Details</h4>
                      <p className="text-sm text-gray-600">
                        Account:{' '}
                        <span className="text-gray-800 font-semibold">{restaurant.restaurantDocuments.bankAccountNumber}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        IFSC: <span className="text-gray-800 font-semibold">{restaurant.restaurantDocuments.ifscCode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Reject Restaurant</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a reason for rejecting <span className="font-medium">{restaurant.restaurantName}</span>
              </p>
              <div className="space-y-3 mb-6">
                {commonReasons.map((reason, i) => (
                  <label key={i} className="flex items-center text-sm text-gray-700 gap-2">
                    <input
                      type="radio"
                      value={reason}
                      checked={rejectionReason === reason}
                      onChange={() => setRejectionReason(reason)}
                      className="text-teal-600 focus:ring-0"
                      name="rejectReason"
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setZoomedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] p-4">
              <img src={zoomedImage} alt="Zoomed" className="w-full h-full object-contain rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default RestaurantDetails;