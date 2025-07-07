import { AddressListProps } from "../../../interfaces/user/profile/address-form.types";

const AddressList = ({ profile, handleEditAddress, handleDeleteAddress, setIsEditingAddress, tealColor }: AddressListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Addresses</h3>
        {!profile.address.length || profile.address.length < 3 && (
          <button
            onClick={() => setIsEditingAddress(true)}
            className="flex items-center px-4 py-2 rounded-lg border hover:bg-teal-50 transition-colors duration-200"
            style={{ borderColor: tealColor, color: tealColor }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </button>
        )}
      </div>
      <div className="space-y-4">
        {profile.address.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">No addresses saved yet.</p>
            <p className="text-gray-400 text-sm mt-2">Add an address to make ordering easier!</p>
          </div>
        ) : (
          profile.address.map((address, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex justify-between items-center hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: tealColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  {address.houseName}, {address.street}, {address.city}, {address.state}, {address.pinCode}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(index)}
                  className="p-2 hover:bg-teal-50 rounded-full"
                  style={{ color: tealColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteAddress(index)}
                  className="p-2 hover:bg-teal-50 rounded-full"
                  style={{ color: tealColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressList;