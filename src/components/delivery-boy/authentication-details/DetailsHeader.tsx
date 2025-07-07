import { DetailsHeaderProps } from "../../../interfaces/delivery-boy/authentication/details-form.types";

const DetailsHeader = ({ activeSection, setActiveSection, handleNavigation }: DetailsHeaderProps) => {
  return (
    <>
      <button
        onClick={() => handleNavigation('location')}
        className="mb-4 flex items-center text-orange-500 hover:text-orange-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Profile</h2>

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

export default DetailsHeader;