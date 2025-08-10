import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyLogout } from '../../service/redux/slices/deliveryBoySlice';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Search, Calendar, User, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/delivery-boy/Sidebar';
import Header from '../../components/delivery-boy/Header';
import { PartnerData } from '../../interfaces/delivery-boy/dashboard/partner-data.types';
import { RootState } from '../../interfaces/delivery-boy/dashboard/root-state.types';
import { deliveryBoyApi } from '../../api/endpoints/deliveryBoyApi';

interface Concern {
    id: string; // Changed to string to match _id
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedBy: string;
    submittedDate: string;
    category: string;
}

const ConcernsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [concerns, setConcerns] = useState<Concern[]>([]);
    const [partnerData, setPartnerData] = useState<PartnerData>({
        name: '',
        rating: 0,
        email: '',
        mobile: '',
        earnings: { today: 0, week: 0 },
        loginHours: '00:00:00',
        ordersCompleted: 0,
        pendingOrders: 0,
        location: { latitude: 0, longitude: 0 },
        zone: { id: { _id: '', name: '', coordinates: [] }, name: '' },
        isOnline: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deliveryBoyId = useSelector((store: RootState) => store.deliveryBoyAuth.delivery_boy_id);

    // Load partner data from cookies or API
    useEffect(() => {
        const fetchDeliveryBoyData = async () => {
            try {
                const cookieData = Cookies.get('deliveryBoyData');
                let parsedData: PartnerData | null = null;
                if (cookieData) {
                    try {
                        parsedData = JSON.parse(cookieData);
                        setPartnerData((prev) => ({
                            ...prev,
                            rating: parsedData?.rating || 0,
                            isOnline: parsedData?.isOnline || false,
                            earnings: parsedData?.earnings || { today: 0, week: 0 },
                            loginHours: parsedData?.loginHours || '00:00:00',
                            ordersCompleted: parsedData?.ordersCompleted || 0,
                            pendingOrders: parsedData?.pendingOrders || 0,
                            location: parsedData?.location || { latitude: 0, longitude: 0 },
                            zone: parsedData?.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                        }));
                    } catch (error) {
                        console.error('Error parsing cookie data:', error);
                    }
                }
                const data = await deliveryBoyApi.getDeliveryBoyData(dispatch, deliveryBoyId);
                const updatedData: PartnerData = {
                    name: data?.name || '',
                    rating: data.rating || 4.8,
                    email: data.email || '',
                    mobile: data.mobile || '',
                    isOnline: data.isOnline || false,
                    earnings: { today: data.earnings?.today || 0, week: data.earnings?.week || 0 },
                    loginHours: parsedData?.loginHours || '00:00:00',
                    ordersCompleted: data.ordersCompleted || 0,
                    pendingOrders: data.pendingOrders || 0,
                    inHandCash: data.inHandCash || 0,
                    amountToPayDeliveryBoy: data.amountToPayDeliveryBoy || 0,
                    location: data?.location || { latitude: 0, longitude: 0 },
                    zone: data?.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                };
                setPartnerData(updatedData);
                Cookies.set('deliveryBoyData', JSON.stringify(updatedData), { expires: 1, secure: true, sameSite: 'strict' });
            } catch (error) {
                console.error('Error fetching delivery boy data:', error);
                toast.error('Failed to fetch delivery boy data.');
            }
        };
        fetchDeliveryBoyData();
    }, [deliveryBoyId, dispatch]);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch concerns from backend
    useEffect(() => {
        const fetchConcernResults = async () => {
            try {
                const response = await deliveryBoyApi.getConcerns(dispatch, deliveryBoyId);
                if (response.success) {
                    const formattedConcerns: Concern[] = response.data.map((item: any) => ({
                        id: item._id,
                        title: item.reason || item.selectedOption.title,
                        description: item.description,
                        status: item.status as 'pending' | 'approved' | 'rejected',
                        submittedBy: partnerData.name || 'Unknown', // Fallback to partnerData.name
                        submittedDate: new Date(item.createdAt).toISOString().split('T')[0], // Format date as YYYY-MM-DD
                        category: item.selectedOption.category,
                    }));
                    setConcerns(formattedConcerns);
                } else {
                    toast.error('Failed to fetch concerns: ' + response.message);
                }
            } catch (error) {
                console.error('Error fetching concerns:', error);
                toast.error((error as Error).message || 'Something went wrong');
            }
        };
        fetchConcernResults();
    }, [dispatch, deliveryBoyId, partnerData.name]);

    // Logout handler
    const handleLogout = async () => {
        try {
            if (partnerData.isOnline) {
                toast.warning('Please turn off your online status before logging out.');
                return;
            }
            dispatch(deliveryBoyLogout());
            localStorage.removeItem('deliveryBoyToken');
            localStorage.removeItem('deliveryBoyRefreshToken');
            Cookies.remove('deliveryBoyData');
            Cookies.remove('timerSeconds');
            navigate('/deliveryBoy-login');
            toast.success('Logged out successfully.');
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Failed to log out. Please try again.');
        }
    };

    const filteredConcerns = concerns.filter(concern => {
        const matchesSearch = concern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            concern.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || concern.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="flex h-screen bg-orange-50 text-gray-800 font-sans">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                partnerData={partnerData}
                handleLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentTime={currentTime} partnerData={partnerData} />
                <main className="flex-1 overflow-y-auto p-6 bg-orange-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search concerns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full rounded-lg border border-orange-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Summary */}
                        <div className="mb-6">
                            <p className="text-orange-600 font-medium">
                                Showing {filteredConcerns.length} of {concerns.length} concerns
                            </p>
                        </div>

                        {/* Concerns Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredConcerns.map((concern) => (
                                <div key={concern.id} className="bg-white rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-orange-600">#{concern.id.slice(-4)}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(concern.status)}`}>
                                                {concern.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Title and Description */}
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {concern.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {concern.description}
                                        </p>

                                        {/* Category */}
                                        <div className="mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {concern.category}
                                            </span>
                                        </div>

                                        {/* Footer */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{concern.submittedBy}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{concern.submittedDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {/* <div className="px-6 pb-4">
                                        <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                            View Details
                                        </button>
                                    </div> */}
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredConcerns.length === 0 && (
                            <div className="text-center py-12">
                                <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No concerns found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ConcernsPage;