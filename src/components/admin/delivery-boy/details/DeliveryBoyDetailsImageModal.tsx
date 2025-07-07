import { X } from 'lucide-react';
import { DeliveryBoyDetailsImageModalProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsImageModal = ({ zoomedImage, setZoomedImage }: DeliveryBoyDetailsImageModalProps) => {
  return (
    zoomedImage && (
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
    )
  );
};

export default DeliveryBoyDetailsImageModal;