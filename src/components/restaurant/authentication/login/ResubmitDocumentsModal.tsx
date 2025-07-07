import { Upload, X } from "lucide-react";
import { ResubmitDocumentsModalProps } from "../../../../interfaces/restaurant/authentication/login/resubmit-documents-modal.types";

const ResubmitDocumentsModal: React.FC<ResubmitDocumentsModalProps> = ({
  showResubmitModal,
  setShowResubmitModal,
  resubmitData,
  previewImages,
  handleFileChange,
  handleRemoveImage,
  handleResubmitChange,
  handleResubmitDocuments,
  idProofRef,
  fssaiLicenseRef,
  businessCertificateRef,
}) => {
  if (!showResubmitModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-100/50 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Resubmit Documents
          </h3>
          <X
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => setShowResubmitModal(false)}
          />
        </div>

        <form onSubmit={handleResubmitDocuments} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">ID Proof</label>
            <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
              <Upload className="text-indigo-500 mr-3" />
              <input
                ref={idProofRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "idProof")}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {previewImages.idProof && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("idProof")}
                  className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {previewImages.idProof && (
              <div className="mt-4">
                <img
                  src={
                    previewImages.idProof.startsWith("blob:")
                      ? previewImages.idProof
                      : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${
                          previewImages.idProof
                        }`
                  }
                  alt="ID Proof Preview"
                  className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">FSSAI License</label>
            <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
              <Upload className="text-indigo-500 mr-3" />
              <input
                ref={fssaiLicenseRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "fssaiLicense")}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {previewImages.fssaiLicense && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("fssaiLicense")}
                  className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {previewImages.fssaiLicense && (
              <div className="mt-4">
                <img
                  src={
                    previewImages.fssaiLicense.startsWith("blob:")
                      ? previewImages.fssaiLicense
                      : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${
                          previewImages.fssaiLicense
                        }`
                  }
                  alt="FSSAI License Preview"
                  className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Business Certificate</label>
            <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
              <Upload className="text-indigo-500 mr-3" />
              <input
                ref={businessCertificateRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "businessCertificate")}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {previewImages.businessCertificate && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("businessCertificate")}
                  className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {previewImages.businessCertificate && (
              <div className="mt-4">
                <img
                  src={
                    previewImages.businessCertificate.startsWith("blob:")
                      ? previewImages.businessCertificate
                      : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${
                          previewImages.businessCertificate
                        }`
                  }
                  alt="Business Certificate Preview"
                  className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bank Account Number</label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
              <input
                type="text"
                name="bankAccountNumber"
                value={resubmitData.bankAccountNumber}
                onChange={handleResubmitChange}
                placeholder="Bank Account Number"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">IFSC Code</label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
              <input
                type="text"
                name="ifscCode"
                value={resubmitData.ifscCode}
                onChange={handleResubmitChange}
                placeholder="IFSC Code"
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-600 transition duration-300 shadow-lg"
            >
              Submit Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResubmitDocumentsModal;