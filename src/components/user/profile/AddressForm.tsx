import { AddressFormProps } from "../../../interfaces/user/profile/address-form.types";

const AddressForm = ({
  newAddress,
  setNewAddress,
  handleAddressSubmit,
  setIsEditingAddress,
  editingAddressIndex,
  tealColor,
}: AddressFormProps) => {
  return (
    <form onSubmit={handleAddressSubmit} className="mb-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="houseName" className="block text-sm font-medium text-gray-700">
            House Name
          </label>
          <input
            type="text"
            id="houseName"
            value={newAddress.houseName}
            onChange={(e) => setNewAddress({ ...newAddress, houseName: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street
          </label>
          <input
            type="text"
            id="street"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
            Pin Code
          </label>
          <input
            type="text"
            id="pinCode"
            value={newAddress.pinCode}
            onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          style={{ backgroundColor: tealColor }}
        >
          {editingAddressIndex !== null ? 'Update Address' : 'Add Address'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditingAddress(false);
            setNewAddress({
              houseName: '',
              street: '',
              city: '',
              state: '',
              pinCode: '',
            });
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;