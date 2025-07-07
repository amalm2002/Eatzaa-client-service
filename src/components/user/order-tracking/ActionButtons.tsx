import { X, Wallet } from 'lucide-react';
import { ActionButtonsProps } from '../../../interfaces/user/profile/order-tracking.types';

const ActionButtons = ({ canCancel, isCancelling, handleCancelOrder, fetchWalletDetails, formatTimeLeft, timeLeft }: ActionButtonsProps) => {
    return (
        <div className="space-y-3">
            {canCancel && (
                <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center shadow-md ${isCancelling ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <X size={20} className="mr-2" />
                    {isCancelling ? 'Cancelling...' : `Cancel Order (${formatTimeLeft(timeLeft)})`}
                </button>
            )}
            <button
                onClick={fetchWalletDetails}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center shadow-md"
            >
                <Wallet size={20} className="mr-2" />
                View Wallet
            </button>
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border-2 border-teal-600 text-teal-600 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                    Call Support
                </button>
                <button className="bg-white border-2 border-teal-600 text-teal-600 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                    Help Center
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;