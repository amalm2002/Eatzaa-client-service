import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/UserProfileSidebar';
import { useDispatch, useSelector } from 'react-redux';
import createAxios from '../../../service/axiousServices/userAxious';
import { validateProfileEdit } from '../../../utils/validation';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Address[];
    favoriteRestaurants: FavoriteRestaurant[];
    recentOrders: Order[];
}

interface FavoriteRestaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    imageUrl: string;
}

interface Order {
    id: string;
    restaurantName: string;
    date: string;
    status: 'delivered' | 'processing' | 'cancelled';
    total: number;
    items: OrderItem[];
}

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Address {
    houseName: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
}

type TabType = 'profile' | 'orders' | 'favorites' | 'addresses';

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
    const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
    const [newAddress, setNewAddress] = useState<Address>({
        houseName: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
    });
    const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(`/get-user/${userId}`);

                const userData = response.data.response.user;

                const fetchedProfile: UserProfile = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone || '',
                    address: Array.isArray(userData.address)
                        ? userData.address.map((addr: any) => ({
                            houseName: addr.street?.split(',')[0]?.trim() || '',
                            street: addr.street?.split(',')[1]?.trim() || '',
                            city: addr.city || '',
                            state: addr.state || '',
                            pinCode: addr.pinCode?.toString() || '',
                        }))
                        : [],
                    favoriteRestaurants: [],
                    recentOrders: [],
                };

                // console.log('Fetched profile:', fetchedProfile);
                setProfile(fetchedProfile);
                setEditForm({
                    name: fetchedProfile.name,
                    email: fetchedProfile.email,
                    phone: fetchedProfile.phone,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = validateProfileEdit({
            name: editForm.name,
            phone: editForm.phone,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const userData = {
                name: editForm.name,
                phone: editForm.phone,
            };
            const response = await axiosInstance.put(`/edit-profile/${userId}`, userData);

            const updatedUser = response.data.response.user;
            setProfile({
                ...profile!,
                name: updatedUser.name,
                phone: updatedUser.phone,
            });
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setErrors({ phone: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {

            if (
                !newAddress.houseName ||
                !newAddress.street ||
                !newAddress.city ||
                !newAddress.state ||
                !newAddress.pinCode
            ) {
                alert('All address fields are required.');
                return;
            }

            const addressData = {
                street: `${newAddress.houseName}, ${newAddress.street}`,
                city: newAddress.city,
                state: newAddress.state,
                pinCode: parseInt(newAddress.pinCode),
            };

            try {
                const response = await axiosInstance.put(`/update-address/${userId}`, {
                    address: addressData,
                    index: editingAddressIndex !== null ? editingAddressIndex : -1,
                });

                if (editingAddressIndex !== null) {
                    const updatedAddresses = [...profile.address];
                    updatedAddresses[editingAddressIndex] = { ...newAddress };
                    setProfile({ ...profile, address: updatedAddresses });
                } else {
                    setProfile({ ...profile, address: [...profile.address, { ...newAddress }] });
                }

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
                toast.error(error.response.data.message || 'Failed to update address.');
            }
        }
    };

    const handleEditAddress = (index: number) => {
        if (profile) {
            setNewAddress({ ...profile.address[index] });
            setEditingAddressIndex(index);
            setIsEditingAddress(true);
        }
    };

    const handleDeleteAddress = async (index: number) => {
        if (profile) {
            try {
                await axiosInstance.delete(`/delete-address/${userId}/${index}`);
                const updatedAddresses = profile.address.filter((_, i) => i !== index);
                setProfile({ ...profile, address: updatedAddresses });
                toast.success('Address deleted successfully')
            } catch (error: any) {
                console.error('Error deleting address:', error);
                toast.error(error.response.data.message || 'Failed to delete address.');
            }
        }
    };

    const tealColor = 'rgb(44,147,140)';
    const tealColorLight = 'rgba(44,147,140,0.1)';

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: tealColor }}></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">Could not load profile data.</p>
                    <button
                        className="mt-4 px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: tealColor }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row">
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center px-4 py-2 rounded-lg border"
                        style={{ borderColor: tealColor, color: tealColor }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Menu
                    </button>
                </div>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    name={profile.name}
                    email={profile.email}
                    tealColor={tealColor}
                />
                <main className="flex-1 lg:ml-8 p-6 bg-white rounded-xl shadow-sm">
                    {activeTab === 'profile' && (
                        <div>
                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="space-y-6 max-w-lg">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.phone ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                            style={{ backgroundColor: tealColor }}
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setErrors({});
                                            }}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Account Details</h3>
                                        <div className="mt-4 space-y-4">
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
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-gray-500">Full Name</p>
                                                    <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                                                </div>
                                            </div>
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
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                                                </div>
                                            </div>
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
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 flex items-center px-4 py-2 rounded-lg border hover:bg-teal-50 transition-colors duration-200"
                                            style={{ borderColor: tealColor, color: tealColor }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2"
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
                                            Edit Profile
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Receive emails about your orders and account</p>
                                                </div>
                                                <div
                                                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                    style={{ backgroundColor: tealColor }}
                                                >
                                                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                                                    <p className="text-sm text-gray-500">Receive text messages about your orders</p>
                                                </div>
                                                <div className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-500">Add extra security to your account</p>
                                                </div>
                                                <div className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Orders</h3>
                            <div className="space-y-6">
                                {profile.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                                    {order.restaurantName}
                                                    {order.status === 'delivered' && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 ml-2 text-green-500"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    )}
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {/* {formatDate(order.date)} • Order #{order.id} */}
                                                </p>
                                            </div>
                                            {/* <StatusBadge status={order.status} /> */}
                                        </div>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-semibold" style={{ color: tealColor }}>
                                                            {item.quantity} ×
                                                        </span>{' '}
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <p className="text-sm font-medium text-gray-500">Total</p>
                                            <p className="text-lg font-semibold" style={{ color: tealColor }}>
                                                ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex space-x-3">
                                            <button
                                                className="flex-1 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm font-medium"
                                                style={{ backgroundColor: tealColor }}
                                            >
                                                Reorder
                                            </button>
                                            <button className="flex-1 bg-white text-gray-700 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Favorite Restaurants</h3>
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center">
                                <p className="text-gray-500 text-sm">Favorite restaurants feature is coming soon!</p>
                                <p className="text-gray-400 text-sm mt-2">You'll be able to save and manage your favorite restaurants here.</p>
                            </div>
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Your Addresses</h3>
                                {!isEditingAddress && (
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
                                                setEditingAddressIndex(null);
                                            }}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

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
                                                    {address.houseName}, {address.street}, {address.city}, {address.state}, {address.pinCode},
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
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;