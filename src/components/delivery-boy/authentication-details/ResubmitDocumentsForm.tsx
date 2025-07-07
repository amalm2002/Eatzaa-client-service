import { ResubmitDocumentsFormProps } from "../../../interfaces/delivery-boy/authentication/resubmit-details.types";

const ResubmitDocumentsForm = ({
  userDetails,
  handleInputChange,
  handleFileChange,
  errors,
  existingPanCardImages,
  existingLicenseImages,
}: ResubmitDocumentsFormProps) => {
  return (
    <>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="panCard">
          PAN Card Number
        </label>
        <input
          type="text"
          id="panCard"
          name="panCard"
          value={userDetails.panCard}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          placeholder="Enter PAN card number"
        />
        {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">PAN Card Images</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <label htmlFor="panFront" className="block cursor-pointer">
              {userDetails.panCardImages[0] ? (
                <img
                  src={URL.createObjectURL(userDetails.panCardImages[0])}
                  alt="PAN Front"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : existingPanCardImages[0] ? (
                <img
                  src={existingPanCardImages[0]}
                  alt="PAN Front"
                  className="w-full h-20 object-cover rounded-lg"
                  onError={() => console.error('Failed to load PAN front image:', existingPanCardImages[0])}
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Front Side</span>
                </>
              )}
            </label>
            <input
              id="panFront"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panCardImages', 0)}
              className="hidden"
            />
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <label htmlFor="panBack" className="block cursor-pointer">
              {userDetails.panCardImages[1] ? (
                <img
                  src={URL.createObjectURL(userDetails.panCardImages[1])}
                  alt="PAN Back"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : existingPanCardImages[1] ? (
                <img
                  src={existingPanCardImages[1]}
                  alt="PAN Back"
                  className="w-full h-20 object-cover rounded-lg"
                  onError={() => console.error('Failed to load PAN back image:', existingPanCardImages[1])}
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Back Side</span>
                </>
              )}
            </label>
            <input
              id="panBack"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panCardImages', 1)}
              className="hidden"
            />
          </div>
        </div>
        {errors.panCardImages && <p className="text-red-500 text-xs mt-1">{errors.panCardImages}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="license">
          License Number
        </label>
        <input
          type="text"
          id="license"
          name="license"
          value={userDetails.license}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          placeholder="Enter license number"
        />
        {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">License Images</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <label htmlFor="licenseFront" className="block cursor-pointer">
              {userDetails.licenseImages[0] ? (
                <img
                  src={URL.createObjectURL(userDetails.licenseImages[0])}
                  alt="License Front"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : existingLicenseImages[0] ? (
                <img
                  src={existingLicenseImages[0]}
                  alt="License Front"
                  className="w-full h-20 object-cover rounded-lg"
                  onError={() => console.error('Failed to load license front image:', existingLicenseImages[0])}
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Front Side</span>
                </>
              )}
            </label>
            <input
              id="licenseFront"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'licenseImages', 0)}
              className="hidden"
            />
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <label htmlFor="licenseBack" className="block cursor-pointer">
              {userDetails.licenseImages[1] ? (
                <img
                  src={URL.createObjectURL(userDetails.licenseImages[1])}
                  alt="License Back"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : existingLicenseImages[1] ? (
                <img
                  src={existingLicenseImages[1]}
                  alt="License Back"
                  className="w-full h-20 object-cover rounded-lg"
                  onError={() => console.error('Failed to load license back image:', existingLicenseImages[1])}
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Back Side</span>
                </>
              )}
            </label>
            <input
              id="licenseBack"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'licenseImages', 1)}
              className="hidden"
            />
          </div>
        </div>
        {errors.licenseImages && <p className="text-red-500 text-xs mt-1">{errors.licenseImages}</p>}
      </div>
    </>
  );
};

export default ResubmitDocumentsForm;