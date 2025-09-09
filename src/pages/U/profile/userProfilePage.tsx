import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { userApi } from '../../../api/endpoints/userApi';
import { validateProfileEdit } from '../../../utils/validation';
import Navbar from '../../../components/user/layouts/Navbar';
import Sidebar from '../../../components/user/profile/ProfileSidebar';
import OrderHistory from './orderHistoryPage';
import ProfileEditForm from '../../../components/user/profile/ProfileEditForm';
import ProfileDetails from '../../../components/user/profile/ProfileDetails';
import AddressForm from '../../../components/user/profile/AddressForm';
import AddressList from '../../../components/user/profile/AddressList';
import { UserProfile, Address } from '../../../interfaces/user/profile/user-profile.types';

type TabType = 'profile' | 'orders' | 'favorites' | 'addresses';

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
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

    const location = useLocation();
    const dispatch = useDispatch();
    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);

    const tealColor = 'rgb(44,147,140)';
    // const tealColorLight = 'rgba(44,147,140,0.1)';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userApi.getUserProfile(dispatch, userId);
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
    }, [userId, dispatch]);

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab as TabType);
        }
    }, [location.state]);

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
            const updatedUser = await userApi.updateUserProfile(dispatch, userId, userData);
            setProfile({
                ...profile!,
                name: updatedUser.name,
                phone: updatedUser.phone,
            });
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setErrors({ phone: error.message || 'Failed to update profile.' });
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
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
                await userApi.updateUserAddress(dispatch, userId, addressData, editingAddressIndex !== null ? editingAddressIndex : -1);
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
                toast.error(error.message || 'Failed to update address.');
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
                await userApi.deleteUserAddress(dispatch, userId, index);
                const updatedAddresses = profile.address.filter((_, i) => i !== index);
                setProfile({ ...profile, address: updatedAddresses });
                toast.success('Address deleted successfully');
            } catch (error: any) {
                console.error('Error deleting address:', error);
                toast.error(error.message || 'Failed to delete address.');
            }
        }
    };

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
                                <ProfileEditForm
                                    editForm={editForm}
                                    errors={errors}
                                    setEditForm={setEditForm}
                                    handleEditSubmit={handleEditSubmit}
                                    setIsEditing={setIsEditing}
                                    setErrors={setErrors}
                                    tealColor={tealColor}
                                />
                            ) : (
                                <ProfileDetails profile={profile} setIsEditing={setIsEditing} tealColor={tealColor} />
                            )}
                        </div>
                    )}
                    {activeTab === 'orders' && <OrderHistory tealColor={tealColor} />}
                    {activeTab === 'favorites' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Favorite Restaurants</h3>
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center">
                                <p className="text-gray-500 text-sm">Favorite restaurants feature is coming soon!</p>
                                <p className="text-gray-400 text-sm mt-2">You'll be able to save and manage your favorite restaurants here.</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'addresses' && (
                        <div>
                            {isEditingAddress && (
                                <AddressForm
                                    newAddress={newAddress}
                                    setNewAddress={setNewAddress}
                                    handleAddressSubmit={handleAddressSubmit}
                                    setIsEditingAddress={setIsEditingAddress}
                                    editingAddressIndex={editingAddressIndex}
                                    tealColor={tealColor}
                                />
                            )}
                            <AddressList
                                profile={profile}
                                handleEditAddress={handleEditAddress}
                                handleDeleteAddress={handleDeleteAddress}
                                setIsEditingAddress={setIsEditingAddress}
                                tealColor={tealColor}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;