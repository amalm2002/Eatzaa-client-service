import { useEffect, useState } from 'react';
import RegisterMap from '../map/map';
import { toast } from 'sonner';
import { useFormik } from "formik";
import * as Yup from "yup";
import createAxios from '../../service/axiousServices/userAxious';
import { useDispatch, useSelector } from 'react-redux';
import { validateProfileEdit } from '../../utils/validation';
import { RootState } from '../../service/redux/store';

interface Address {
  houseName: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address[];
}

interface AddressSectionProps {
  onLocationSelect: (lat: number, lng: number) => void;
  userId: string;
}

const AddressSection: React.FC<AddressSectionProps> = ({ onLocationSelect, userId }) => {
  const [locationStatus, setLocationStatus] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number>(23.226390067116835);
  const [longitude, setLongitude] = useState<number>(79.17271614074708);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isAddingPhone, setIsAddingPhone] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<UserProfile | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Address>({
    houseName: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);
  const { user } = useSelector((state: RootState) => state.userAuth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/get-user/${userId}`);
        const userData = response.data.response.user;

        const fetchedProfile: UserProfile = {
          id: userData.id || '',
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: Array.isArray(userData.address)
            ? userData.address.map((addr: any) => ({
              houseName: addr.houseName || addr.street?.split(',')[0]?.trim() || '',
              street: addr.street?.split(',')[1]?.trim() || addr.street || '',
              city: addr.city || '',
              state: addr.state || '',
              pinCode: addr.pinCode?.toString() || '',
            }))
            : [],
        };

        setAddresses(fetchedProfile);
        setPhoneNumber(fetchedProfile.phone || '');
        if (fetchedProfile.address.length > 0) {
          setSelectedAddress(fetchedProfile.address[0].houseName);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleGeolocation = (lat: number, lng: number, status: boolean) => {
    setLocationStatus(status);
    setLongitude(lng);
    setLatitude(lat);
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
  };

  const formik = useFormik({
    initialValues: {
      latitude: latitude,
      longitude: longitude,
    },
    validationSchema: Yup.object({
      latitude: Yup.number()
        .min(8.4, "Choose a valid location in India")
        .max(37.6, "Choose a valid location in India"),
      longitude: Yup.number()
        .min(68.7, "Choose a valid location in India")
        .max(97.25, "Choose a valid location in India"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {

        console.log(values, 'vaaaaaaaaaaaaa');

        const { data } = await axiosInstance.post(
          `/user/location?userId=${userId}`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log('loccccccccccccc data :', data);

        if (data?.success === true) {
          toast.success("Location updated successfully!");
          setTimeout(() => {
          }, 2000);
        } else {
          toast.error(data?.message || "Something went wrong, please try again.");
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const successCallback = async (position: GeolocationPosition) => {
      const newLat = position.coords.latitude;
      const newLng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      console.log("Current Location:", { newLat, newLng, accuracy });

      formik.setFieldValue("latitude", newLat);
      formik.setFieldValue("longitude", newLng);
      setLatitude(newLat);
      setLongitude(newLng);

      await formik.validateForm();
      if (!Object.keys(formik.errors).length) {
        await formik.submitForm();
      } else {
        toast.error("Invalid location coordinates");
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error("Please allow location access to use this feature");
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error("Location information is unavailable");
          break;
        case error.TIMEOUT:
          toast.error("The request to get location timed out");
          break;
        default:
          toast.error("An error occurred while getting location");
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
    }, 15000);
  };

  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.post(`/user/location?userId=${userId}`, {
  //       latitude,
  //       longitude,
  //     });

  //     if (response.data?.success) {
  //       toast.success('Location updated successfully!');
  //     } else {
  //       toast.error(response.data?.message || 'Update failed.');
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || 'Something went wrong.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addresses) return;

    const trimmedAddress = {
      houseName: newAddress.houseName.trim(),
      street: newAddress.street.trim(),
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      pinCode: newAddress.pinCode.trim(),
    };

    if (
      !trimmedAddress.houseName ||
      !trimmedAddress.street ||
      !trimmedAddress.city ||
      !trimmedAddress.state ||
      !trimmedAddress.pinCode
    ) {
      toast.warning('All address fields are required.');
      return;
    }

    if (!/^\d{6}$/.test(trimmedAddress.pinCode)) {
      toast.warning('Pin code must be a 6-digit number.');
      return;
    }

    const addressData = {
      street: `${newAddress.houseName}, ${newAddress.street}`,
      city: newAddress.city,
      state: newAddress.state,
      pinCode: parseInt(newAddress.pinCode),
    };

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/update-address/${userId}`, {
        address: addressData,
        index: editingAddressIndex !== null ? editingAddressIndex : -1,
      });

      let updatedAddresses = [...addresses.address];
      if (editingAddressIndex !== null) {
        updatedAddresses[editingAddressIndex] = { ...newAddress };
      } else {
        updatedAddresses = [...updatedAddresses, { ...newAddress }];
      }

      setAddresses({ ...addresses, address: updatedAddresses });
      setSelectedAddress(newAddress.houseName);
      setNewAddress({
        houseName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
      });
      setIsEditingAddress(false);
      setEditingAddressIndex(null);
      toast.success('Address updated successfully!');
    } catch (error: any) {
      console.error('Error updating address:', error);
      toast.error(error.response?.data?.message || 'Failed to update address.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (index: number) => {
    if (addresses) {
      setNewAddress({ ...addresses.address[index] });
      setEditingAddressIndex(index);
      setIsEditingAddress(true);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!addresses) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/delete-address/${userId}/${index}`);
      const updatedAddresses = addresses.address.filter((_, i) => i !== index);
      setAddresses({ ...addresses, address: updatedAddresses });
      if (updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0].houseName);
      } else {
        setSelectedAddress('');
      }
      toast.success('Address deleted successfully');
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error(error.response?.data?.message || 'Failed to delete address.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    const validationErrors = validateProfileEdit({
      name: user,
      phone: phoneNumber,
    });

    if (validationErrors.phone) {
      setPhoneError(validationErrors.phone);
      return;
    }
    const userData = {
      name: user,
      phone: phoneNumber
    }
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/edit-profile/${userId}`, userData);
      console.log('response form the edit-profile :', response);

      if (response.data?.response?.message === "Success") {
        setAddresses((prev) => (prev ? { ...prev, phone: phoneNumber } : prev));
        toast.success('Phone number updated!');
        setIsAddingPhone(false);
        setPhoneNumber(phoneNumber);
      } else {
        toast.error(response.data?.message || 'Failed to update phone number.');
      }
    } catch (error: any) {
      console.error('Error updating phone number:', error);
      setPhoneError(error.response?.data?.message || 'Failed to update phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Delivery Address</h2>
      <div className="mb-3">
        <RegisterMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleGeolocation}
        />
      </div>

      {isEditingAddress && (
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
              style={{ backgroundColor: 'rgb(44,147,140)' }}
              disabled={loading}
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
                setEditingAddressIndex(null);
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-gray-600">Loading addresses...</p>
        ) : addresses && addresses.address.length > 0 ? (
          addresses.address.map((address, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex justify-between items-center"
            >
              <label className="flex items-center gap-2 flex-1">
                <input
                  type="radio"
                  name="address"
                  value={address.houseName}
                  checked={selectedAddress === address.houseName}
                  onChange={() => setSelectedAddress(address.houseName)}
                  className="h-4 w-4 text-teal-500 focus:ring-teal-500"
                />
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {address.houseName}{' '}
                    {index === 0 && (
                      <span className="text-teal-500 text-xs">(Default)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    {address.street}, {address.city}, {address.state}, {address.pinCode}
                  </p>
                </div>
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAddress(index)}
                  className="p-2 hover:bg-teal-50 rounded-full"
                  style={{ color: 'rgb(44,147,140)' }}
                  disabled={loading}
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
                  style={{ color: 'rgb(44,147,140)' }}
                  disabled={loading}
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
        ) : (
          <p className="text-sm text-gray-600">No addresses found.</p>
        )}
        {!isEditingAddress && addresses && addresses.address.length < 3 && (
          <button
            onClick={() => setIsEditingAddress(true)}
            className="mt-2 text-teal-500 hover:text-teal-600 font-medium text-sm flex items-center gap-1 border border-teal-500 rounded-lg py-1 px-2"
            disabled={loading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </button>
        )}
      </div>

      <div className="mt-3">
        {isAddingPhone ? (
          <form onSubmit={handleAddPhoneNumber} className="flex gap-2">
            <div className="flex-1">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneError('');
                }}
                placeholder="Enter phone number"
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${phoneError ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>
            <button
              type="submit"
              className="py-1 px-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg text-sm"
              disabled={loading}
            >
              Save
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              Phone: {addresses?.phone || 'Not set'}
            </p>

            {!addresses?.phone && (
              <button
                onClick={() => setIsAddingPhone(true)}
                className="text-teal-500 hover:text-teal-600 font-medium text-sm flex items-center gap-1 border border-teal-500 rounded-lg py-1 px-2"
                disabled={loading}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Phone Number
              </button>
            )}
          </div>

        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex-1 py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg text-sm"
          disabled={loading}
        >
          📍 Get Current Location
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex-1 py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg text-sm"
        >
          ✅ Choose This Location
        </button>
      </div>
    </div>
  );
};

export default AddressSection;