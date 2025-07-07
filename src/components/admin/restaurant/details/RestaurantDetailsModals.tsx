import { X } from 'lucide-react';
import { RestaurantDetailsModalsProps } from '../../../../interfaces/admin/restaurants/restaurant-details.types';

const commonReasons = [
  'Invalid or expired FSSAI license',
  'Incomplete documentation',
  'Unreadable documents',
  'Business address verification failed',
  'Bank details mismatch',
];

const RestaurantDetailsModals = ({
  showRejectModal,
  setShowRejectModal,
  rejectionReason,
  setRejectionReason,
  handleReject,
  zoomedImage,
  setZoomedImage,
  restaurant,
}: RestaurantDetailsModalsProps) => {
  return (
    <>
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
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantDetailsModals;