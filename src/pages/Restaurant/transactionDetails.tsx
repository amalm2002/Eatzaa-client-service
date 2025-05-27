// components/TransactionDetails.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, Download } from "lucide-react";
import Header from "./navbar/header";
import Sidebar from "./navbar/sidebar";
import useRestaurantStatus from "../../hooks/useRestaurantStatus";
import { toast } from "sonner";
import createAxios from "../../service/axiousServices/restaurantAxious";
import { useDispatch, useSelector } from "react-redux";

type TransactionStatus = "created" | "paid" | "failed";

interface Transaction {
    _id: string;
    restaurantId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: TransactionStatus;
    createdAt: string;
    updatedAt: string;
    expireAt?: string;
    isActive: boolean;
    errorCode?: string;
    errorDescription?: string;
    subscriptionPlan?: {
        name: string;
        period: string;
    };
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);
};

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const badgeStyles = {
        paid: "bg-green-100 text-green-800",
        created: "bg-blue-100 text-blue-800",
        failed: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${badgeStyles[status]
                }`}
        >
            {status}
        </span>
    );
};

export default function TransactionDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRepaying, setIsRepaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState("PaymentHistory");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isOnline, handleToggleOnline } = useRestaurantStatus();

    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const restaurantId = useSelector(
        (store: { restaurantAuth: { restaurant_id: string } }) =>
            store.restaurantAuth.restaurant_id
    );

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchTransactionDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/payment/details/${id}`);
            const transformedData: Transaction = {
                ...response.data,
                subscriptionPlan: {
                    name: response.data.subscriptionPlanId?.name || 'Unknown Plan',
                    period: response.data.subscriptionPlanId?.period || 'Unknown period',
                },
                subscriptionId: response.data.subscriptionPlanId?._id || response.data.subscriptionPlanId,
                restaurantId: response.data.restaurantId,
                amount: response.data.amount,
                status: response.data.status,
            };
            setTransaction(transformedData);
        } catch (error: any) {
            console.error('Error fetching transaction details:', error);
            setError(error.response?.data?.message || 'Failed to fetch transaction details');
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };
    // console.log(transaction?.restaurantId,'resssssssssss',transaction?.subscriptionId,'subbbbbbbb');
    let a: any = transaction?.amount
    // console.log('amountttttttt :', (a * 100));

    const handleRepayment = async () => {
        try {
            setIsRepaying(true);
            console.log("transaction id:", id);
            const response = await axiosInstance.post(`/payment/retry/${id}`);

            if (response.data.error) {
                throw new Error(response.data.message || 'Failed to initiate repayment');
            }

            const { orderId, razorpayKey } = response.data;

            if (!orderId || !razorpayKey) {
                throw new Error('Invalid response from server');
            }

            const plan = transaction?.subscriptionPlan;
            const amount = transaction?.amount;

            if (!transaction || amount === undefined) {
                throw new Error('Transaction details or amount missing');
            }

            if (!window.Razorpay) {
                throw new Error('Razorpay SDK not loaded. Please try again.');
            }

            const options = {
                key: razorpayKey,
                amount: amount * 100,
                currency: 'INR',
                name: 'Eatzaa',
                description: plan?.name,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await axiosInstance.post('/restaurnt-verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: transaction?.subscriptionId,
                            restaurantId: transaction?.restaurantId,
                        });

                        toast.success('Payment verified and subscription activated!');
                        navigate('/restaurant-payment-history');
                    } catch (error: any) {
                        console.error('Payment verification failed:', error);
                        toast.error('Payment verification failed. Contact support.');
                    }
                },
                prefill: {
                    name: 'Eatzaa Food Hub',
                    email: 'eatzaafoodhub@gmail.com',
                    contact: '+91 0495 56765',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razor = new window.Razorpay(options);
            razor.on('payment.failed', async function (response: any) {
                try {
                    await axiosInstance.post('/restaurnt-payment-failed', {
                        razorpay_order_id: response.error.metadata.order_id,
                        razorpay_payment_id: response.error.metadata.payment_id,
                        error_code: response.error.code,
                        error_description: response.error.description,
                        planId: transaction?.subscriptionId,
                        restaurantId: transaction?.restaurantId,
                    });
                    toast.error('Payment failed. Please try again.');
                    navigate('/restaurant-payment-history');
                } catch (error: any) {
                    console.error('Failed to log payment failure:', error);
                    toast.error('Failed to log payment failure. Contact support.');
                }
            });
            razor.open();
        } catch (error: any) {
            console.error('Error initiating repayment:', error);
            toast.error(error.message || 'Failed to initiate repayment');
        } finally {
            setIsRepaying(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTransactionDetails();
        } else {
            setError("Invalid transaction ID");
            setIsLoading(false);
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isOnline={isOnline}
            />
            <div className="flex-1 ml-64">
                <Header
                    isOnline={isOnline}
                    handleToggleOnline={handleToggleOnline}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                            <span>Download Receipt</span>
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading transaction details...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : transaction ? (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {transaction.subscriptionPlan?.name || "Unknown Plan"}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {transaction.subscriptionPlan?.period || "Unknown period"}
                                        </p>
                                    </div>
                                    <StatusBadge status={transaction.status} />
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                                    <p className="mt-1 text-gray-900">{transaction._id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                                    <p className="mt-1 text-gray-900">{transaction.razorpayOrderId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Payment ID</h3>
                                    <p className="mt-1 text-gray-900">
                                        {transaction.razorpayPaymentId || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                                    <p className="mt-1 text-gray-900 font-medium">
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
                                    <p className="mt-1 text-gray-900">{formatDate(transaction.createdAt)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                                    <p className="mt-1 text-gray-900">
                                        {transaction.expireAt ? formatDate(transaction.expireAt) : "-"}
                                    </p>
                                </div>
                                {transaction.status === "failed" && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Error Code</h3>
                                            <p className="mt-1 text-gray-900">{transaction.errorCode || "-"}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Error Description</h3>
                                            <p className="mt-1 text-gray-900">
                                                {transaction.errorDescription || "-"}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {transaction.status === "failed" && (
                                <div className="p-6 border-t border-gray-200">
                                    <button
                                        onClick={handleRepayment}
                                        disabled={isRepaying}
                                        className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors ${isRepaying ? "animate-pulse" : ""
                                            }`}
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isRepaying ? "animate-spin" : ""}`} />
                                        <span>{isRepaying ? "Processing..." : "Retry Payment"}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                            <p className="text-gray-600">No transaction data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}