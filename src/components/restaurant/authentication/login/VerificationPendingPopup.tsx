import { Clock, X } from "lucide-react";
import { VerificationPendingPopupProps } from "../../../../interfaces/restaurant/authentication/login/verification-pending-popup.types";

const VerificationPendingPopup: React.FC<VerificationPendingPopupProps> = ({
  showVerificationPopup,
  setShowVerificationPopup,
}) => {
  if (!showVerificationPopup) return null;

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
        <Clock className="w-7 h-7 text-white animate-pulse" />
        <div className="flex-1">
          <p className="font-extrabold text-lg">Verification Pending!</p>
          <p className="text-sm opacity-90">
            Your request is under review. Please wait for admin verification.<br />
            Check your email for approval updates.
          </p>
        </div>
        <X
          className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
          onClick={() => setShowVerificationPopup(false)}
        />
      </div>
    </div>
  );
};

export default VerificationPendingPopup;