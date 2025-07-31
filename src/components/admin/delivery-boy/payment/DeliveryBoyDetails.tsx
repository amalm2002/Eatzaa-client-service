import { FiPhone, FiDollarSign, FiCreditCard, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import { DeliveryBoy, formatDate, isPayButtonEnabled, isAlreadyPaid } from '../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types';

interface DeliveryBoyDetailsModalProps {
  selectedDeliveryBoy: DeliveryBoy;
  processingPayment: string | null;
  setSelectedDeliveryBoy: (deliveryBoy: DeliveryBoy | null) => void;
  handlePayDeliveryBoy: (deliveryBoyId: string, totalCash: number) => void;
}

const DeliveryBoyDetailsModal: React.FC<DeliveryBoyDetailsModalProps> = ({
  selectedDeliveryBoy,
  processingPayment,
  setSelectedDeliveryBoy,
  handlePayDeliveryBoy,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xl">
                {selectedDeliveryBoy.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDeliveryBoy.name}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <FiPhone size={16} />
                  {selectedDeliveryBoy.phone}
                </p>
                <p className="text-sm text-gray-600">Joined: {formatDate(selectedDeliveryBoy.joinDate)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDeliveryBoy(null)}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-gray-700" size={20} />
                <span className="text-sm font-medium text-gray-700">Weekly Earnings</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.weeklyEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FiCreditCard className="text-gray-700" size={20} />
                <span className="text-sm font-medium text-gray-700">In-Hand Cash</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.inHandCash.toLocaleString()}</p>
            </div>
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-gray-700" size={20} />
                <span className="text-sm font-medium text-gray-700">Completed Payments</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.completeAmount.toLocaleString()}</p>
            </div>
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-gray-700" size={20} />
                <span className="text-sm font-medium text-gray-700">Owed to Admin</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</p>
            </div>
            <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="text-gray-700" size={20} />
                <span className="text-sm font-medium text-gray-700">Orders Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{selectedDeliveryBoy.ordersCompleted}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings History</h3>
            <div className="space-y-3">
              {selectedDeliveryBoy.monthlyEarnings.map((earning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200"
                >
                  <div>
                    <div className="font-medium text-gray-900">{earning.month}</div>
                    <div className="text-sm text-gray-600">{earning.orders} orders completed</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-900">₹{earning.amount.toLocaleString()}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${earning.status === 'paid' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {earning.status === 'paid' ? (
                        <span className="flex items-center gap-1">
                          <FiCheck size={12} />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          Pending
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Payment Schedule</h4>
            <p className="text-sm text-gray-700">
              Next payment due: <strong>{formatDate(selectedDeliveryBoy.nextPaymentDate)}</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Payments are processed monthly on the 1st of each month for the previous month's earnings.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setSelectedDeliveryBoy(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {isAlreadyPaid(selectedDeliveryBoy) ? (
              <span className="px-6 py-3 text-sm text-gray-600 font-medium">Already paid for this month</span>
            ) : (
              <button
                onClick={() => {
                  handlePayDeliveryBoy(selectedDeliveryBoy.id, selectedDeliveryBoy.totalCash);
                  setSelectedDeliveryBoy(null);
                }}
                disabled={
                  selectedDeliveryBoy.amountToPayDeliveryBoy > 0 ||
                  processingPayment === selectedDeliveryBoy.id ||
                  !isPayButtonEnabled(selectedDeliveryBoy.nextPaymentDate)
                }
                className={`px-6 py-3 rounded-lg shadow-sm transform transition-all flex items-center gap-2
                  ${selectedDeliveryBoy.amountToPayDeliveryBoy > 0 ||
                    processingPayment === selectedDeliveryBoy.id ||
                    !isPayButtonEnabled(selectedDeliveryBoy.nextPaymentDate)
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                  }`}
              >
                <FiDollarSign size={18} />
                <span>{processingPayment === selectedDeliveryBoy.id ? 'Processing...' : 'Process Payment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDetailsModal;