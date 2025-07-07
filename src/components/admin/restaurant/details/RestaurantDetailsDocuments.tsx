import { Camera, Info, Check, X } from 'lucide-react';
import { RestaurantDetailsDocumentsProps } from '../../../../interfaces/admin/restaurants/restaurant-details.types';

const RestaurantDetailsDocuments = ({
  restaurant,
  handleVerify,
  setShowRejectModal,
  handleImageClick,
  getCloudinaryUrl,
}: RestaurantDetailsDocumentsProps) => {
  return (
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
  );
};

export default RestaurantDetailsDocuments;