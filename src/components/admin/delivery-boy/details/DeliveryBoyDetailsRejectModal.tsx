import { AlertCircle } from 'lucide-react';
import { DeliveryBoyDetailsRejectModalProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsRejectModal = ({ showRejectModal, setShowRejectModal, rejectionReason, setRejectionReason, handleReject, commonReasons }: DeliveryBoyDetailsRejectModalProps) => {
  return (
    showRejectModal && (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setShowRejectModal(false)}
            aria-hidden="true"
          ></div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

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
    )
  );
};

export default DeliveryBoyDetailsRejectModal;