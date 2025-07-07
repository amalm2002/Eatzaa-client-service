import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

const TransactionHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md">
        <Download className="h-4 w-4" />
        <span>Download Receipt</span>
      </button>
    </div>
  );
};

export default TransactionHeader;