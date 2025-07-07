import { FileText, Check, X, CreditCard } from 'lucide-react';
import { DeliveryBoyDetailsDocumentsProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsDocuments = ({ deliveryBoy, handleVerify, handleReject, showRejectModal, setShowRejectModal, handleImageClick }: DeliveryBoyDetailsDocumentsProps) => {
  return (
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
  );
};

export default DeliveryBoyDetailsDocuments;