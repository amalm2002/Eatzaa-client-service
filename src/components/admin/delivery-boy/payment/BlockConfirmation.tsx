import { FiLock } from 'react-icons/fi';
import { BlockConfirmationModalProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types";

export const BlockConfirmationModal: React.FC<BlockConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, vehicleType }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <FiLock className="w-6 h-6 text-gray-600 mr-2" />
                        Confirm Block
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to block the payment rule for {vehicleType}?
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all flex items-center justify-center"
                        >
                            <FiLock className="w-4 h-4 mr-2" />
                            Block
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};