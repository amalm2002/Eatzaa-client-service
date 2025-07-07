import { ResubmitHeaderProps } from "../../../interfaces/delivery-boy/authentication/resubmit-details.types";

const ResubmitHeader = ({ activeSection, setActiveSection, rejectionReason }: ResubmitHeaderProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resubmit Your Profile</h2>
      {rejectionReason && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="text-sm font-medium">Rejection Reason: {rejectionReason}</p>
        </div>
      )}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'personal'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveSection('personal')}
        >
          Personal Info
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'documents'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveSection('documents')}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeSection === 'bank'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveSection('bank')}
        >
          Bank Details
        </button>
      </div>
    </>
  );
};

export default ResubmitHeader;