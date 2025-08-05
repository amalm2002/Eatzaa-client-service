import React, { useState, useEffect, useRef } from 'react';
import { Send, HelpCircle, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyLogout } from '../../service/redux/slices/deliveryBoySlice';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import Sidebar from '../../components/delivery-boy/Sidebar';
import Header from '../../components/delivery-boy/Header';
import { PartnerData } from '../../interfaces/delivery-boy/dashboard/partner-data.types';
import { deliveryBoyApi } from '../../api/endpoints/deliveryBoyApi';
import { RootState } from '../../interfaces/delivery-boy/dashboard/root-state.types';
import HmacSHA256 from 'crypto-js/hmac-sha256';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: string;
    options?: string[];
    showForm?: boolean;
    showZoneSelection?: boolean;
}

export interface HelpOption {
    _id?: string;
    title: string;
    description?: string;
    category?: string;
    isActive?: boolean;
    responseMessage?: string;
}

interface Zone {
    _id: string;
    name: string;
}

interface ConcernForm {
    reason: string;
    description: string;
}

const DeliveryHelpChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState<'welcome' | 'menu' | 'concern' | 'zones' | 'completed'>('welcome');
    const [selectedOption, setSelectedOption] = useState<HelpOption | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [concernForm, setConcernForm] = useState<ConcernForm>({ reason: '', description: '' });
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [concernId, setConcernId] = useState<string | null>(null); // New state for concernId
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
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
    const [helpOptions, setHelpOptions] = useState<HelpOption[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [isChatStateLoaded, setIsChatStateLoaded] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deliveryBoyId = useSelector((state: RootState) => state.deliveryBoyAuth.delivery_boy_id);

    const sensitiveFields: (keyof Pick<PartnerData, 'name' | 'email' | 'mobile'>)[] = ['name', 'email', 'mobile'];

    const getWelcomeMessage = (): Message => ({
        id: '1',
        text: 'Hello! Welcome to Delivery Boy Help Support 👋\n\nI\'m here to assist you with any issues you might have. To get started, please type "/start" to see available help options.',
        isBot: true,
        timestamp: new Date().toISOString(),
    });

    const fetchChatStateFromApi = async () => {
        if (!deliveryBoyId) {
            console.log('No deliveryBoyId, skipping fetchChatStateFromApi');
            return null;
        }
        try {
            const response = await deliveryBoyApi.getChatState(dispatch, deliveryBoyId);
            if (response.success && response.data) {
                return {
                    messages: response.data.messages.map((msg: Message) => ({
                        ...msg,
                        timestamp: msg.timestamp,
                    })),
                    currentStep: response.data.currentStep,
                    selectedOption: response.data.selectedOption,
                    concernForm: response.data.concernForm,
                    selectedZone: response.data.selectedZone,
                    concernId: response.data.concernId, 
                };
            }
            return null;
        } catch (error: any) {
            console.error('Error fetching chat state from API:', error);
        }
    };

    const saveChatStateToApi = debounce(async (stateToSave: any) => {
        if (!deliveryBoyId || !isChatStateLoaded) {
            console.log('No deliveryBoyId or chat state not loaded, skipping saveChatStateToApi');
            return;
        }
        try {
            await deliveryBoyApi.saveChatState(dispatch, deliveryBoyId, stateToSave);
        } catch (error: any) {
            console.error('Error saving chat state to API:', error);
        }
    }, 500);

    const clearChatStateFromApi = async () => {
        if (!deliveryBoyId) {
            console.log('No deliveryBoyId, skipping clearChatStateFromApi');
            return;
        }
        try {
            await deliveryBoyApi.clearChatState(dispatch, deliveryBoyId);
        } catch (error: any) {
            console.error('Error clearing chat state from API:', error);
        }
    };

    const loadOptionsAndZonesFromCookies = () => {
        const helpOptionsData = Cookies.get('helpOptions');
        const zonesData = Cookies.get('zones');
        let parsedHelpOptions: HelpOption[] = [];
        let parsedZones: Zone[] = [];

        if (helpOptionsData) {
            try {
                parsedHelpOptions = JSON.parse(helpOptionsData);
            } catch (error) {
                console.error('Error parsing help options from cookies:', error);
            }
        }

        if (zonesData) {
            try {
                parsedZones = JSON.parse(zonesData);
            } catch (error) {
                console.error('Error parsing zones from cookies:', error);
            }
        }

        return { helpOptions: parsedHelpOptions, zones: parsedZones };
    };

    const storeOptionsAndZonesInCookies = (helpOptions: HelpOption[], zones: Zone[]) => {
        Cookies.set('helpOptions', JSON.stringify(helpOptions), { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('zones', JSON.stringify(zones), { expires: 1, secure: true, sameSite: 'strict' });
    };

    useEffect(() => {
        const fetchHelpOptionsAndZones = async () => {
            const { helpOptions: cachedHelpOptions, zones: cachedZones } = loadOptionsAndZonesFromCookies();
            if (cachedHelpOptions.length > 0 && cachedZones.length > 0) {
                setHelpOptions(cachedHelpOptions);
                setZones(cachedZones);
                return;
            }

            try {
                const helpResponse = await deliveryBoyApi.getAllDeliverBoyHelpOptions(dispatch);
                if (helpResponse.success) {
                    const activeOptions = helpResponse.data
                        .filter((option: any) => option.isActive)
                        .map((option: any) => ({
                            _id: option._id,
                            title: option.title.trim(),
                            description: option.description,
                            category: option.category,
                            isActive: option.isActive,
                            responseMessage: 'Your concern has been submitted and is awaiting verification.',
                        }));
                    setHelpOptions(activeOptions);

                    const zonesResponse = await deliveryBoyApi.fetchZones(dispatch);
                    if (zonesResponse.message === 'Fetch data success') {
                        const zoneList = zonesResponse.fetchZones.map((zone: any) => ({
                            _id: zone._id,
                            name: zone.name,
                        }));
                        setZones(zoneList);
                        storeOptionsAndZonesInCookies(activeOptions, zoneList);
                    } else {
                        toast.error(zonesResponse.message || 'Something went wrong');
                    }
                } else {
                    toast.error(helpResponse.message || 'Failed to fetch help options.');
                }
            } catch (error: any) {
                console.error('Error fetching help options or zones:', error);
            }
        };
        fetchHelpOptionsAndZones();
    }, [dispatch, navigate]);

    const hashSensitiveData = (data: string): string => {
        return HmacSHA256(data, `${import.meta.env.VITE_COOKIES_SECRET}`).toString();
    };

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

    useEffect(() => {
        const fetchDeliveryBoyData = async () => {
            try {
                const { partnerData: cookieData } = loadFromCookies();
                if (cookieData && cookieData.name && cookieData.mobile) {
                    setPartnerData((prev) => ({
                        ...prev,
                        rating: cookieData.rating || 0,
                        isOnline: cookieData.isOnline || false,
                        earnings: cookieData.earnings || { today: 0, week: 0 },
                        loginHours: '00:00:00',
                        ordersCompleted: cookieData.ordersCompleted || 0,
                        pendingOrders: cookieData.pendingOrders || 0,
                        location: cookieData.location || { latitude: 0, longitude: 0 },
                        zone: cookieData.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                    }));
                }
                const data = await deliveryBoyApi.getDeliveryBoyData(dispatch, deliveryBoyId);
                const updatedData: PartnerData = {
                    name: data?.name || '',
                    rating: data.rating || 4.8,
                    email: data.email || '',
                    mobile: data.mobile || '',
                    isOnline: data.isOnline || false,
                    earnings: { today: data.earnings?.today || 0, week: data.earnings?.week || 0 },
                    loginHours: '00:00:00',
                    ordersCompleted: data.ordersCompleted || 0,
                    pendingOrders: data.pendingOrders || 0,
                    inHandCash: data.inHandCash || 0,
                    amountToPayDeliveryBoy: data.amountToPayDeliveryBoy || 0,
                    location: data?.location || { latitude: 0, longitude: 0 },
                    zone: data?.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
                };
                setPartnerData(updatedData);
                storeInCookies(updatedData, 0);
            } catch (error: any) {
                console.error('Error fetching delivery boy data:', error);
            }
        };
        if (deliveryBoyId) fetchDeliveryBoyData();
    }, [deliveryBoyId, dispatch, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const initChatState = async () => {
            if (!deliveryBoyId) {
                const welcomeMessage = getWelcomeMessage();
                setMessages([welcomeMessage]);
                setIsChatStateLoaded(true);
                return;
            }
            const savedState = await fetchChatStateFromApi();
            const welcomeMessage = getWelcomeMessage();

            if (savedState && savedState.messages && savedState.messages.length > 0) {
                setMessages(savedState.messages);
                setCurrentStep(savedState.currentStep || 'welcome');
                setSelectedOption(savedState.selectedOption || null);
                setConcernForm(savedState.concernForm || { reason: '', description: '' });
                setSelectedZone(savedState.selectedZone || '');
                setConcernId(savedState.concernId || null); 
            } else {
                setMessages([welcomeMessage]);
                setCurrentStep('welcome');
                setSelectedOption(null);
                setConcernForm({ reason: '', description: '' });
                setSelectedZone('');
                setConcernId(null);
                await saveChatStateToApi({
                    messages: [welcomeMessage],
                    currentStep: 'welcome',
                    selectedOption: null,
                    concernForm: { reason: '', description: '' },
                    selectedZone: '',
                    concernId: null,
                });
            }
            setIsChatStateLoaded(true);
        };
        initChatState();
    }, [deliveryBoyId, dispatch, navigate]);

    const saveChatState = async () => {
        const stateToSave = {
            messages: messages.map((msg) => ({
                ...msg,
                timestamp: msg.timestamp,
            })),
            currentStep,
            selectedOption,
            concernForm,
            selectedZone,
            concernId,
        };
        await saveChatStateToApi.flush();
        await saveChatStateToApi(stateToSave);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            saveChatState();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            saveChatState();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [messages, currentStep, selectedOption, concernForm, selectedZone, concernId, isChatStateLoaded]);

    const addMessage = (text: string, isBot: boolean, options?: string[], showForm?: boolean, showZoneSelection?: boolean) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            isBot,
            timestamp: new Date().toISOString(),
            options,
            showForm,
            showZoneSelection,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleSendMessage = () => {
        if (!userMessage.trim()) return;

        addMessage(userMessage, false);

        if (userMessage.toLowerCase() === '/start') {
            setCurrentStep('menu');
            setTimeout(() => {
                const optionTexts = helpOptions.map((option) => option.title);
                addMessage('Please select one of the following options:', true, optionTexts);
            }, 500);
        } else {
            setTimeout(() => {
                addMessage('I didn\'t understand that. Please type "/start" to see available options.', true);
            }, 500);
        }

        setUserMessage('');
    };

    const handleOptionSelect = (optionTitle: string) => {
        const option = helpOptions.find((opt) => opt.title === optionTitle);
        if (option) {
            setSelectedOption(option);
            setCurrentStep('concern');
            setConcernForm({ reason: '', description: '' });
            setConcernId(null); 
            addMessage(optionTitle, false);
            setTimeout(() => {
                addMessage(`You've selected: ${optionTitle}\n\nPlease provide more details about your concern so we can assist you better.`, true, undefined, true);
            }, 500);
        }
    };

    const handleConcernSubmit = async () => {
        if (!concernForm.reason.trim() || !concernForm.description.trim()) {
            toast.error('Please fill in both reason and description fields.');
            return;
        }

        addMessage(`Reason: ${concernForm.reason}\nDescription: ${concernForm.description}`, false);

        try {
            const response = await deliveryBoyApi.submitConcern(dispatch, {
                deliveryBoyId,
                selectedOption,
                reason: concernForm.reason,
                description: concernForm.description,
            });

            if (response.success) {
                setConcernId(response.concernId); 
                await saveChatState();
                if (selectedOption?.title === 'Zone Change Request') {
                    setCurrentStep('zones');
                    setTimeout(() => {
                        addMessage('Thank you for providing the details. Please select your preferred zone from the options below:', true, undefined, false, true);
                    }, 500);
                } else {
                    setCurrentStep('completed');
                    setTimeout(() => {
                        addMessage('Your concern has been submitted and is awaiting verification.', true);
                    }, 500);
                    setTimeout(() => {
                        addMessage('Is there anything else I can help you with? Type "/start" to see options again.', true);
                    }, 1500);
                    setConcernForm({ reason: '', description: '' });
                    setConcernId(null);
                }
            } else {
                throw new Error(response.message || 'Failed to submit concern.');
            }
        } catch (error: any) {
            console.error('Error submitting concern:', error);
            addMessage('Failed to submit your concern. Please try again.', true);
        }
    };

    const handleZoneSelect = async (zoneName: string) => {
        const selectedZoneObj = zones.find((zone) => zone.name === zoneName);
        if (!selectedZoneObj) return;

        if (!concernId) {
            addMessage('Error: No concern ID found. Please submit the concern again.', true);
            return;
        }

        setSelectedZone(zoneName);
        addMessage(`Selected Zone: ${zoneName}`, false);

        try {
            const response = await deliveryBoyApi.submitZoneChangeRequest(dispatch, {
                deliveryBoyId,
                concernId,
                zoneId: selectedZoneObj._id,
                zoneName: selectedZoneObj.name,
                reason: concernForm.reason,
                description: concernForm.description,
            });

            if (response.success) {
                setCurrentStep('completed');
                setTimeout(() => {
                    addMessage('Your zone change request has been submitted and is awaiting verification.', true);
                }, 500);
                setTimeout(() => {
                    addMessage('Is there anything else I can help you with? Type "/start" to see options again.', true);
                }, 1500);
                setConcernForm({ reason: '', description: '' });
                setConcernId(null);
                await saveChatState();
            } else {
                throw new Error(response.message || 'Failed to submit zone change request.');
            }
        } catch (error: any) {
            console.error('Error submitting zone change request:', error);
            addMessage('Failed to submit your zone change request. Please try again.', true);
        }
    };

    // const handleBack = async () => {
    //     console.log('Back clicked: Resetting to welcome');
    //     setCurrentStep('welcome');
    //     setSelectedOption(null);
    //     setConcernForm({ reason: '', description: '' });
    //     setSelectedZone('');
    //     setConcernId(null);
    //     const welcomeMessage = getWelcomeMessage();
    //     setMessages([welcomeMessage]);
    //     await saveChatStateToApi.flush();
    //     await clearChatStateFromApi();
    // };

    const handleLogout = async () => {
        if (partnerData.isOnline) {
            toast.warning('Please turn off your online status before logging out.');
            return;
        }
        Cookies.remove('timerSeconds');
        Cookies.remove('helpOptions');
        Cookies.remove('zones');
        await saveChatStateToApi.flush();
        await clearChatStateFromApi();
        dispatch(deliveryBoyLogout());
        localStorage.removeItem('deliveryBoyToken');
        localStorage.removeItem('deliveryBoyRefreshToken');
        Cookies.remove('deliveryBoyData');
        navigate('/deliveryBoy-login');
    };

    const formatTime = (date: string) => {
        try {
            return new Date(date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid time';
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
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div
                                        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${message.isBot ? 'bg-white border border-orange-100' : 'bg-orange-600 text-white'
                                            } rounded-2xl p-4 shadow-sm`}
                                    >
                                        {message.isBot && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <HelpCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-orange-600">Support Bot</span>
                                            </div>
                                        )}

                                        <p className={`text-sm leading-relaxed whitespace-pre-line ${message.isBot ? 'text-gray-800' : 'text-white'}`}>
                                            {message.text}
                                        </p>

                                        {message.options && (
                                            <div className="mt-4 space-y-2">
                                                {message.options.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleOptionSelect(option)}
                                                        className="w-full text-left p-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-orange-800 text-sm font-medium"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {message.showForm && (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for request *</label>
                                                    <input
                                                        type="text"
                                                        value={concernForm.reason}
                                                        onChange={(e) => setConcernForm({ ...concernForm, reason: e.target.value })}
                                                        placeholder="Brief reason for your request"
                                                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed description *</label>
                                                    <textarea
                                                        value={concernForm.description}
                                                        onChange={(e) => setConcernForm({ ...concernForm, description: e.target.value })}
                                                        placeholder="Please explain your situation in detail..."
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleConcernSubmit}
                                                    disabled={!concernForm.reason.trim() || !concernForm.description.trim()}
                                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    Submit Details
                                                </button>
                                            </div>
                                        )}

                                        {message.showZoneSelection && (
                                            <div className="mt-4 space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {zones.map((zone) => (
                                                        <button
                                                            key={zone._id}
                                                            onClick={() => handleZoneSelect(zone.name)}
                                                            className="p-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-orange-800 text-sm font-medium text-center"
                                                        >
                                                            {zone.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`flex items-center justify-between mt-2 text-xs ${message.isBot ? 'text-gray-500' : 'text-orange-100'}`}>
                                            <span>{formatTime(message.timestamp)}</span>
                                            {!message.isBot && <CheckCircle className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </main>
                <div className="bg-white border-t border-orange-100 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50 text-gray-800 placeholder-gray-500"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!userMessage.trim()}
                                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={() => setUserMessage('/start')}
                                className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full text-sm font-medium transition-colors"
                            >
                                /start
                            </button>
                            <span className="px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-full">Tip: Type /start to see help options</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryHelpChat;