import { AlertCircle } from "lucide-react";
import { ErrorStateProps } from "../../../interfaces/restaurant/transaction/error-state.types";

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
      <p className="text-red-600">{error}</p>
    </div>
  );
};

export default ErrorState;