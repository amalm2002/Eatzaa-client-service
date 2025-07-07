import { ResubmitPersonalInfoFormProps } from "../../../interfaces/delivery-boy/authentication/resubmit-details.types";

const ResubmitPersonalInfoForm = ({
  userDetails,
  handleInputChange,
  handleSingleFileChange,
  errors,
  existingProfileImage,
}: ResubmitPersonalInfoFormProps) => {
  return (
    <>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">Profile Photo</label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {userDetails.profileImage ? (
              <img
                src={URL.createObjectURL(userDetails.profileImage)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : existingProfileImage ? (
              <img
                src={existingProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => console.error('Failed to load profile image:', existingProfileImage)}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
          <div>
            <label
              htmlFor="profileImage"
              className="bg-orange-50 text-orange-600 py-2 px-4 rounded-lg text-sm font-medium cursor-pointer hover:bg-orange-100 transition"
            >
              Upload Photo
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSingleFileChange(e, 'profileImage')}
              className="hidden"
            />
          </div>
        </div>
        {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
      </div>
    </>
  );
};

export default ResubmitPersonalInfoForm;