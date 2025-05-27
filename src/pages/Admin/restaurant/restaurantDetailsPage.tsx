import { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Check, X, ExternalLink, Star, Clock, Utensils, Info, Camera, AlertCircle } from 'lucide-react';
import { Header } from '../header/header';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

interface RestaurantDetailsProps {
  activePage: string;
  setActivePage: (page: string) => void;
  restaurantId: string;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axiosInstance.get(`/getRestaurant/${restaurantId}`);
        if (response.data.message === 'success') {
          const data = response.data.response;
          setRestaurant({
            id: data._id,
            restaurantName: data.restaurantName,
            email: data.email,
            mobile: data.mobile,
            isVerified: data.isVerified || false,
            isRejected: data.rejectionReason ? true : false,
            rejectionReason: data.rejectionReason || '',
            location: {
              longitude: data.location?.longitude,
              latitude: data.location?.latitude,
              address: data.address || '123 Food Street, Foodville',
            },
            cuisine: data.cuisine || ['North Indian', 'Chinese', 'Fast Food'],
            rating: data.rating || 4.2,
            avgDeliveryTime: data.avgDeliveryTime ,
            restaurantDocuments: {
              idProofUrl: data.restaurantDocuments?.idProofUrl ,
              fssaiLicenseUrl: data.restaurantDocuments?.fssaiLicenseUrl ,
              businessCertificateUrl: data.restaurantDocuments?.businessCertificateUrl,
              bankAccountNumber: data.restaurantDocuments?.bankAccountNumber ,
              ifscCode: data.restaurantDocuments?.ifscCode ,
            },
            coverImage: data.coverImage || '/api/placeholder/1200/400',
            logo: data.logo || '/api/placeholder/150/150',
            description: data.description || 'A delightful restaurant serving authentic cuisine with passion and care.',
            openingHours: data.openingHours || '10:00 AM - 11:00 PM',
          });
        } else {
          toast.error('Failed to load restaurant details');
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        toast.error('Error loading restaurant details');
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

  const handleReject = async () => {
    const restaurantId = restaurant.id;
    try {
      const response = await axiosInstance.post(`/rejectedRestaurantDocs`, {
        restaurantId,
        rejectionReason,
      });
      if (response.data.message === 'success') {
        setRestaurant((prev: any) => ({
          ...prev,
          isRejected: true,
          rejectionReason: rejectionReason,
        }));
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

  const getStatusBadge = () => {
    if (restaurant.isVerified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
          <Check className="w-4 h-4 mr-1" /> Verified
        </span>
      );
    } else if (restaurant.isRejected) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 shadow-sm">
          <X className="w-4 h-4 mr-1" /> Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600 shadow-sm">
          <Clock className="w-4 h-4 mr-1" /> Pending
        </span>
      );
    }
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

  const getCloudinaryUrl = (path: string) => {
    if (!path || path.startsWith('/api/placeholder')) return path;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <Header />
        
        {/* Hero Section */}
        <div className="w-full h-64 md:h-80 lg:h-96 relative shadow-lg">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${restaurant.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20"></div>
          </div>
          
          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end gap-4 w-full max-w-7xl mx-auto">
              <div className="h-20 w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 bg-white rounded-xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-105 transition">
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.restaurantName} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
                      {restaurant.restaurantName}
                    </h1>
                    <p className="text-white/90 text-sm md:text-base font-medium">
                      {restaurant.cuisine?.join(', ')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <div className="flex items-center gap-1 bg-white/90 text-gray-800 px-2 py-1 rounded-md shadow-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto py-4 gap-8">
              {['overview', 'documents', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap font-semibold text-sm uppercase tracking-wide pb-2 px-1 transition-all ${
                    activeTab === tab
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-orange-600" /> 
                  About Restaurant
                </h2>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {[
                    { icon: Clock, title: 'Hours', value: restaurant.openingHours },
                    { icon: Utensils, title: 'Cuisine', value: restaurant.cuisine?.join(', ') },
                    { icon: Clock, title: 'Avg. Delivery Time', value: restaurant.avgDeliveryTime },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {restaurant.isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Rejection Reason</h3>
                      <p className="text-sm text-red-700 mt-1">{restaurant.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-orange-600 animate-pulse" /> 
                    Restaurant Documents
                  </h2>
                  
                  {!restaurant.isVerified && !restaurant.isRejected ? (
                    <div className="flex gap-4">
                      <button
                        onClick={handleVerify}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center"
                      >
                        <Check className="w-5 h-5 mr-2" /> Verify
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center"
                      >
                        <X className="w-5 h-5 mr-2" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        className="bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow-md opacity-70 cursor-not-allowed flex items-center"
                        disabled
                      >
                        <Check className="w-5 h-5 mr-2" /> {restaurant.isVerified ? 'Verified' : 'Verify'}
                      </button>
                      <button
                        className="bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-md opacity-70 cursor-not-allowed flex items-center"
                        disabled
                      >
                        <X className="w-5 h-5 mr-2" /> {restaurant.isRejected ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'ID Proof', url: getCloudinaryUrl(restaurant.restaurantDocuments.idProofUrl), description: 'Personal Identification Document' },
                    { title: 'FSSAI License', url: getCloudinaryUrl(restaurant.restaurantDocuments.fssaiLicenseUrl), description: 'Food Safety License' },
                    { title: 'Business Certificate', url: getCloudinaryUrl(restaurant.restaurantDocuments.businessCertificateUrl), description: 'Business Registration' },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="relative bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleImageClick(doc.url)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={doc.url}
                          alt={doc.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-semibold bg-orange-600 px-3 py-1 rounded-full shadow-md">View Larger</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-gray-900 font-bold text-lg">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 italic">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Info className="w-6 h-6 mr-3 text-orange-600 animate-pulse" /> 
                  Bank Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Account Number', value: restaurant.restaurantDocuments.bankAccountNumber },
                    { label: 'IFSC Code', value: restaurant.restaurantDocuments.ifscCode },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <h3 className="text-sm text-orange-600 font-semibold mb-2">{item.label}</h3>
                      <p className="text-gray-900 font-bold text-lg tracking-wide">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-orange-600 animate-pulse" /> 
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: Mail, color: 'orange', title: 'Email Address', value: restaurant.email },
                    { icon: Phone, color: 'orange', title: 'Phone Number', value: restaurant.mobile },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="relative bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`bg-orange-100 p-3 rounded-full shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className={`w-6 h-6 text-orange-600`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                          <p className="text-gray-700 text-sm mt-1">{item.value}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className={`bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md`}>Contact</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-orange-600 animate-pulse" /> 
                  Restaurant Location
                </h2>
                
                <div className="mb-8">
                  <div className="h-72 bg-gradient-to-br from-orange-50 to-gray-100 rounded-2xl overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center animate-bounce">
                        <MapPin className="h-16 w-16 text-orange-500 mx-auto" />
                        <p className="mt-3 text-sm text-gray-700 font-semibold">Map Preview</p>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <a
                          href={`https://maps.google.com/?q=${restaurant.location.latitude},${restaurant.location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center"
                        >
                          Open in Maps <ExternalLink className="w-5 h-5 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Address', value: restaurant.location.address },
                    { label: 'Latitude', value: restaurant.location.latitude },
                    { label: 'Longitude', value: restaurant.location.longitude },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <h3 className="text-sm text-orange-600 font-semibold mb-2">{item.label}</h3>
                      <p className="text-gray-900 font-bold text-lg tracking-wide">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reject Restaurant</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a reason for rejecting <span className="font-medium">{restaurant.restaurantName}</span>
            </p>
            <div className="space-y-3 mb-6">
              {commonReasons.map((reason, i) => (
                <label key={i} className="flex items-center text-sm text-gray-700 gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    value={reason}
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="text-orange-600 focus:ring-orange-500"
                    name="rejectReason"
                  />
                  {reason}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <div className="w-[800px] h-[600px] p-4">
            <img 
              src={zoomedImage} 
              alt="Zoomed" 
              className="w-full h-full object-contain rounded-xl shadow-2xl" 
            />
            <button
              className="absolute top-6 right-6 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-6 h-6 " />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;