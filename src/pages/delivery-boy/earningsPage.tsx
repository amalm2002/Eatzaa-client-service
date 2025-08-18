import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    ChevronDown,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    RefreshCw
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyLogout } from '../../service/redux/slices/deliveryBoySlice';
import Cookies from 'js-cookie';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { toast } from 'sonner';
import Sidebar from '../../components/delivery-boy/Sidebar';
import Header from '../../components/delivery-boy/Header';
import { PartnerData } from '../../interfaces/delivery-boy/dashboard/partner-data.types';
import { RootState } from '../../interfaces/delivery-boy/dashboard/root-state.types';
import { deliveryBoyApi } from '../../api/endpoints/deliveryBoyApi';

const DeliveryPartnerEarnings = () => {
    const [showBalance, setShowBalance] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('This Week');
    const [activeTab, setActiveTab] = useState('earnings');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [partnerData, setPartnerData] = useState<PartnerData>({
        name: '',
        rating: 0,
        email: '',
        mobile: '',
        earnings: { today: 0, week: 0, history: [] },
        loginHours: '00:00:00',
        ordersCompleted: 0,
        pendingOrders: 0,
        inHandCash: 0,
        amountToPayDeliveryBoy: 0,
        location: { latitude: 0, longitude: 0 },
        zone: { id: { _id: '', name: '', coordinates: [] }, name: '' },
        isOnline: false,
        paymentHistory: [],
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deliveryBoyId = useSelector((store: RootState) => store.deliveryBoyAuth.delivery_boy_id);
    const deliveryBoyRole = useSelector((store: RootState) => store.deliveryBoyAuth.role);
    const deliveryCompletedTrigger = useSelector((store: RootState) => store.deliveryBoyAuth.deliveryCompletedTrigger);

    const hashSensitiveData = (data: string): string => {
        return HmacSHA256(data, `${import.meta.env.VITE_COOKIES_SECRET}`).toString();
    };

    const sensitiveFields: (keyof Pick<PartnerData, 'name' | 'email' | 'mobile'>)[] = ['name', 'email', 'mobile'];

    const storeInCookies = (data: PartnerData, timerValue: number) => {
        const cookieData: PartnerData = {
            ...data,
            location: data.location || { latitude: 0, longitude: 0 },
            zone: data.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
        };
        sensitiveFields.forEach((field) => {
            const value = cookieData[field];
            if (value && typeof value === 'string') {
                cookieData[field] = hashSensitiveData(value) as any;
            }
        });
        Cookies.set('deliveryBoyData', JSON.stringify(cookieData), { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('timerSeconds', timerValue.toString(), { expires: 1, secure: true, sameSite: 'strict' });
    };

    const loadFromCookies = (): { partnerData: PartnerData | null; timerSeconds: number } => {
        const cookieData = Cookies.get('deliveryBoyData');
        const timerData = Cookies.get('timerSeconds');
        let parsedData: PartnerData | null = null;
        let timerValue = 0;
        if (cookieData) {
            try {
                parsedData = JSON.parse(cookieData);
            } catch (error) {
                console.error('Error parsing cookie data:', error);
            }
        }
        if (timerData) {
            timerValue = parseInt(timerData, 10) || 0;
        }
        return { partnerData: parsedData, timerSeconds: timerValue };
    };

    const formatTimer = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!deliveryBoyId || !deliveryBoyRole) {
                console.log('Missing deliveryBoyId or deliveryBoyRole, skipping fetch');
                return;
            }

            try {
                const { partnerData: cookieData, timerSeconds: savedTimerSeconds } = loadFromCookies();
                if (cookieData && cookieData.name && cookieData.mobile) {
                    setPartnerData((prev) => ({
                        ...prev,
                        rating: cookieData.rating || 0,
                        isOnline: cookieData.isOnline || false,
                        earnings: cookieData.earnings || { today: 0, week: 0, history: [] },
                        loginHours: formatTimer(savedTimerSeconds),
                        ordersCompleted: cookieData.ordersCompleted || 0,
                        pendingOrders: cookieData.pendingOrders || 0,
                        inHandCash: cookieData.inHandCash || 0,
                        amountToPayDeliveryBoy: cookieData.amountToPayDeliveryBoy || 0,
                        location: cookieData.location || { latitude: 0, longitude: 0 },
                        zone: cookieData.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                        paymentHistory: cookieData.paymentHistory || [],
                    }));
                }

                const [deliveryBoyData, paymentHistoryResponse] = await Promise.all([
                    deliveryBoyApi.getDeliveryBoyData(dispatch, deliveryBoyId),
                    deliveryBoyApi.getDeliveryBoyInHandPaymentHistory(dispatch, {
                        deliveryBoyId,
                        role: deliveryBoyRole,
                    }),
                ]);

                const updatedData: PartnerData = {
                    name: deliveryBoyData?.name || '',
                    rating: deliveryBoyData.rating || 4.8,
                    email: deliveryBoyData.email || '',
                    mobile: deliveryBoyData.mobile || '',
                    isOnline: deliveryBoyData.isOnline || false,
                    earnings: {
                        today: deliveryBoyData.earnings?.today || 0,
                        week: deliveryBoyData.earnings?.week || 0,
                        history: deliveryBoyData.earnings?.history || [],
                    },
                    loginHours: formatTimer(savedTimerSeconds),
                    ordersCompleted: deliveryBoyData.ordersCompleted || 0,
                    pendingOrders: deliveryBoyData.pendingOrders || 0,
                    inHandCash: deliveryBoyData.inHandCash || 0,
                    amountToPayDeliveryBoy: deliveryBoyData.amountToPayDeliveryBoy || 0,
                    location: deliveryBoyData?.location || { latitude: 0, longitude: 0 },
                    zone: deliveryBoyData?.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                    paymentHistory: paymentHistoryResponse.success
                        ? paymentHistoryResponse.payments.map((payment: any) => ({
                            _id: payment.id,
                            amount: payment.amount,
                            createdAt: payment.createdAt,
                            razorpayPaymentId: payment.razorpayPaymentId,
                            status: payment.status,
                            deliveryBoyId: payment.deliveryBoyId,
                            razorpayOrderId: payment.razorpayOrderId,
                            role: payment.role,
                            amountToPayDeliveryBoy: payment.amountToPayDeliveryBoy,
                            completeAmount: payment.completeAmount,
                            inHandCash: payment.inHandCash,
                            monthlyAmount: payment.monthlyAmount,
                        }))
                        : [],
                };

                setPartnerData(updatedData);
                storeInCookies(updatedData, savedTimerSeconds);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data.');
            }
        };

        fetchData();
    }, [deliveryBoyId, deliveryBoyRole, deliveryCompletedTrigger, dispatch]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        if (partnerData.isOnline) {
            toast.warning('Please turn off your online status before logging out.');
            return;
        }
        Cookies.remove('timerSeconds');
        dispatch(deliveryBoyLogout());
        localStorage.removeItem('deliveryBoyToken');
        localStorage.removeItem('deliveryBoyRefreshToken');
        Cookies.remove('deliveryBoyData');
        navigate('/deliveryBoy-login');

    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}`;
        } else {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                partnerData={partnerData}
                handleLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentTime={currentTime} partnerData={partnerData} />
                <main className="flex-1 overflow-y-auto p-6 bg-orange-50">
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center">
                                <button onClick={() => navigate('/deliveryBoy-home')} className="p-2 mr-2">
                                    <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" />
                                </button>
                                <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            <button className="flex items-center justify-between w-full">
                                <span className="text-gray-900 font-semibold">{selectedPeriod}</span>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-500 text-sm font-medium">Total Earnings</span>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="text-gray-400 hover:text-orange-500 transition-colors"
                                >
                                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {showBalance ? formatCurrency(partnerData.earnings.week) : '••••••'}
                            </div>
                            <div className="text-sm text-gray-500">
                                Today: {showBalance ? formatCurrency(partnerData.earnings.today) : '••••'}
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-2">Unpaid Amount</div>
                                    <div className="text-lg font-semibold text-orange-600">
                                        {showBalance ? formatCurrency(partnerData.amountToPayDeliveryBoy ?? 0) : '••••'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-2">Cash in Hand</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {showBalance ? formatCurrency(partnerData.inHandCash ?? 0) : '••••'}
                                    </div>
                                </div>
                            </div>

                            {(partnerData.inHandCash ?? 0) > 0 && (
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-5 mb-6 rounded-r-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-orange-800">
                                                You have {formatCurrency(partnerData.inHandCash ?? 0)} cash to settle
                                            </div>
                                            <div className="text-xs text-orange-600 mt-1">
                                                Please settle your cash regularly
                                            </div>
                                        </div>
                                        {/* <button className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                                            Settle
                                        </button> */}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-md mt-6 overflow-hidden">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab('earnings')}
                                    className={`flex-1 py-3 px-6 text-sm font-semibold ${activeTab === 'earnings'
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 transition-colors'
                                        }`}
                                >
                                    Earnings
                                </button>
                                <button
                                    onClick={() => setActiveTab('cash')}
                                    className={`flex-1 py-3 px-6 text-sm font-semibold ${activeTab === 'cash'
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 transition-colors'
                                        }`}
                                >
                                    Cash
                                </button>
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    className={`flex-1 py-3 px-6 text-sm font-semibold ${activeTab === 'payments'
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 transition-colors'
                                        }`}
                                >
                                    Payments
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'earnings' && (
                                    <div className="space-y-4">
                                        {(partnerData.earnings?.history?.length ?? 0) > 0 && partnerData.earnings?.history ? (
                                            partnerData.earnings.history.map((earning) => (
                                                <div key={earning._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${earning.paid ? 'bg-green-50' : 'bg-orange-50'}`}>
                                                                {earning.paid ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                                ) : (
                                                                    <Clock className="w-5 h-5 text-orange-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">
                                                                    Order #{earning.orderId.slice(-6).toUpperCase()}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatDate(earning.date)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-gray-900">
                                                                {formatCurrency(earning.amount)}
                                                            </div>
                                                            <div className={`text-xs ${earning.paid ? 'text-green-600' : 'text-orange-600'}`}>
                                                                {earning.paid ? 'Paid' : 'Pending'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-500">
                                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <div className="text-sm font-medium">No earnings history available</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'cash' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-lg font-semibold text-gray-900 mb-4">Cash Summary</div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Current cash in hand</span>
                                                    <span className="font-semibold">{formatCurrency(partnerData.inHandCash ?? 0)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">Pay For admin</span>
                                                    <span className="font-semibold text-orange-600">
                                                        {formatCurrency(partnerData.amountToPayDeliveryBoy ?? 0)}
                                                    </span>
                                                </div>
                                                <hr className="my-4 border-gray-100" />
                                                {/* <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                                    Settle Cash
                                                </button> */}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-lg font-semibold text-gray-900 mb-4">Recent Cash Activity</div>
                                            <div className="text-center py-10 text-gray-500">
                                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <div className="text-sm font-medium">No recent cash activity</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'payments' && (
                                    <div className="space-y-4">
                                        {(partnerData.paymentHistory?.length ?? 0) > 0 && partnerData.paymentHistory ? (
                                            partnerData.paymentHistory.map((payment) => (
                                                <div key={payment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'COMPLETED' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                                                {payment.status === 'COMPLETED' ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                                ) : (
                                                                    <Clock className="w-5 h-5 text-orange-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">
                                                                    Payment #{payment.razorpayPaymentId.slice(-6).toUpperCase()}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatDate(payment.createdAt)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-gray-900">
                                                                {formatCurrency(payment.amount)}
                                                            </div>
                                                            <div className={`text-xs ${payment.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                                                                {payment.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-500">
                                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <div className="text-sm font-medium">No payment history available</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {activeTab === 'earnings' && (partnerData.earnings?.history?.length ?? 0) > 0 && (
                                <div className="p-6 border-t border-gray-100">
                                    <button className="w-full py-3 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                                        Load more
                                    </button>
                                </div>
                            )}

                            {activeTab === 'payments' && (partnerData.paymentHistory?.length ?? 0) > 0 && (
                                <div className="p-6 border-t border-gray-100">
                                    <button className="w-full py-3 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                                        Load more
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-md mt-6 p-6">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 font-medium mb-2">This week's total</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {showBalance ? formatCurrency(partnerData.earnings.week) : '••••••'}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryPartnerEarnings;