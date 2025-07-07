import { HeartCrack, X } from "lucide-react";
import { RejectionPopupProps } from "../../../../interfaces/restaurant/authentication/login/rejection-popup.types";

const RejectionPopup: React.FC<RejectionPopupProps> = ({
  showRejectionPopup,
  setShowRejectionPopup,
  setShowResubmitModal,
}) => {
  if (!showRejectionPopup) return null;

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
        <HeartCrack className="w-7 h-7 text-white animate-pulse" />
        <div className="flex-1">
          <p className="font-extrabold text-lg">Document Verification Failed!</p>
          <p className="text-sm opacity-90">
            Your document verification failed. Please resubmit your documents.<br />
            <button
              onClick={() => setShowResubmitModal(true)}
              className="text-orange-300 hover:underline mt-2 inline-block"
            >
              Resubmit Now
            </button>
          </p>
        </div>
        <X
          className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
          onClick={() => setShowRejectionPopup(false)}
        />
      </div>
    </div>
  );
};

export default RejectionPopup;