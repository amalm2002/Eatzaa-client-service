import { ZoneListDeleteModalProps } from "../../../../interfaces/admin/delivery-boys/zone.types";

const ZoneListDeleteModal = ({ isModalOpen, closeDeleteModal, handleDelete }: ZoneListDeleteModalProps) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
        </div>
        <div className="border-t border-b border-gray-100 py-4 mb-4">
          <p className="text-gray-600">
            Are you sure you want to delete this zone? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeDeleteModal}
            className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transform hover:scale-102 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md transform hover:scale-102 transition-all duration-200 relative overflow-hidden group font-medium"
          >
            <span className="relative z-10">Delete Zone</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneListDeleteModal;