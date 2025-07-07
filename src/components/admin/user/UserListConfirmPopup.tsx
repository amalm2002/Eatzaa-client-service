import { FiX, FiLock, FiUnlock } from 'react-icons/fi';
import { UserListConfirmPopupProps } from '../../../interfaces/admin/user/user-confirm-popup.types';

const UserListConfirmPopup = ({
    showConfirmPopup,
    pendingAction,
    actionLoading,
    setShowConfirmPopup,
    confirmToggleBlock,
}: UserListConfirmPopupProps) => {
    if (!showConfirmPopup || !pendingAction) return null;

    return (
        <div
            className="fixed inset-0 bg-white/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="confirmPopupTitle"
            aria-modal="true"
        >
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-popup">
                <button
                    onClick={() => setShowConfirmPopup(false)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                    aria-label="Close popup"
                    disabled={actionLoading}
                >
                    <FiX className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div
                        className={`p-4 rounded-full mb-4 animate-bounce ${pendingAction.action === 'block' ? 'bg-red-100' : 'bg-green-100'}`}
                    >
                        {pendingAction.action === 'block' ? (
                            <FiLock className="w-8 h-8 text-red-600" />
                        ) : (
                            <FiUnlock className="w-8 h-8 text-green-600" />
                        )}
                    </div>
                    <h2 id="confirmPopupTitle" className="text-2xl font-bold text-gray-800 mb-3">
                        {pendingAction.action === 'block' ? 'Block User?' : 'Unblock User?'}
                    </h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        {pendingAction.action === 'block'
                            ? 'This user will be blocked and lose access to the platform.'
                            : 'This user will be unblocked and regain access to the platform.'}
                    </p>
                    <div className="flex justify-center gap-4 w-full">
                        <button
                            onClick={() => setShowConfirmPopup(false)}
                            className={`px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all transform hover:scale-105 font-medium ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={actionLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmToggleBlock}
                            className={`px-6 py-2 rounded-full text-white transition-all transform hover:scale-105 font-medium shadow-md ${pendingAction.action === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
                            ) : pendingAction.action === 'block' ? (
                                'Block'
                            ) : (
                                'Unblock'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserListConfirmPopup;