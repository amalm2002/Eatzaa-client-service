import { useState, useEffect } from "react";
import {
    Calendar,
    ChevronDown,
    Download,
    Filter,
    RefreshCw,
    Search,
} from "lucide-react";
import Header from "./navbar/header";
import Sidebar from "./navbar/sidebar";
import useRestaurantStatus from "../../hooks/useRestaurantStatus";
import { toast } from "sonner";
import createAxios from "../../service/axiousServices/restaurantAxious";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    subscriptionPlan?: {
        name: string;
        period: string;
    };
    expireAt: string
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
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
    let badgeColor = "";

    switch (status) {
        case "paid":
            badgeColor = "bg-green-100 text-green-800";
            break;
        case "created":
            badgeColor = "bg-blue-100 text-blue-800";
            break;
        case "failed":
            badgeColor = "bg-red-100 text-red-800";
            break;
    }

    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${badgeColor}`}
        >
            {status}
        </span>
    );
};

export default function TransactionHistory() {
    const [activeMenu, setActiveMenu] = useState("PaymentHistory");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isOnline, handleToggleOnline } = useRestaurantStatus();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
        "all"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        from: "",
        to: "",
    });
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const restaurantId = useSelector(
        (store: { restaurantAuth: { restaurant_id: string } }) =>
            store.restaurantAuth.restaurant_id
    );

    const fetchTransactionHistory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/payment/history/${restaurantId}`);

            // console.log('tarnsaction response :', response);

            const fetchedTransactions: Transaction[] = response.data.map(
                (item: any) => ({
                    _id: item._id,
                    restaurantId: item.restaurantId,
                    subscriptionId: item.subscriptionPlanId._id,
                    amount: item.amount,
                    currency: item.currency,
                    razorpayOrderId: item.razorpayOrderId,
                    razorpayPaymentId: item.razorpayPaymentId || undefined,
                    razorpaySignature: item.razorpaySignature || undefined,
                    status: item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    subscriptionPlan: item.subscriptionPlanId || {
                        name: "Unknown Plan",
                        period: "unknown",
                    },
                    expireAt: item.expireAt                    
                })
            );     
            setTransactions(fetchedTransactions);
        } catch (error: any) {
            console.error("Error fetching transaction history:", error);
            setError(error.response?.data?.message || "Failed to fetch transactions");
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory();
    }, [restaurantId]);

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.razorpayOrderId
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (transaction.razorpayPaymentId &&
                transaction.razorpayPaymentId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (transaction.subscriptionPlan?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" || transaction.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const refreshData = () => {
        fetchTransactionHistory();
    };

    const handilenavigation = (id: string) => {
        console.log(id,'idddddddddd is traaaaaaaaaaaa');
        
        navigate(`/restaurant-payment-details/${id}`)
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {/* Sidebar */}
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isOnline={isOnline}
            />

            <div className="flex-1 ml-64">
                {/* Header */}
                <Header
                    isOnline={isOnline}
                    handleToggleOnline={handleToggleOnline}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main body */}
                <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Transaction History
                        </h1>
                        <p className="text-gray-500 mt-1">
                            View and manage your subscription payments
                        </p>
                    </div>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm font-medium text-gray-500">Total Spent</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(
                                    transactions
                                        .filter((t) => t.status === "paid")
                                        .reduce((sum, t) => sum + t.amount, 0),
                                    "INR"
                                )}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">
                                From {transactions.length} transactions
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm font-medium text-gray-500">Current Plan</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">
                                Premium Plan
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">
                                Next billing:{" "}
                                {formatDate(
                                    new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
                                )}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm font-medium text-gray-500">
                                Payment Status
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                                    <span className="text-xs">
                                        Paid (
                                        {transactions.filter((t) => t.status === "paid").length})
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                                    <span className="text-xs">
                                        Pending (
                                        {transactions.filter((t) => t.status === "created").length})
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                                    <span className="text-xs">
                                        Failed (
                                        {transactions.filter((t) => t.status === "failed").length})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Actions */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="w-full md:w-72 relative">
                                    <input
                                        type="text"
                                        placeholder="Search by order ID or plan..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="relative">
                                        <button
                                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            onClick={() =>
                                                setIsStatusDropdownOpen(!isStatusDropdownOpen)
                                            }
                                        >
                                            <Filter className="h-4 w-4" />
                                            <span>Status</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        <div
                                            className={`absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg ${isStatusDropdownOpen ? "block" : "hidden"
                                                }`}
                                        >
                                            <div className="py-1">
                                                <button
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => {
                                                        setStatusFilter("all");
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => {
                                                        setStatusFilter("paid");
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                >
                                                    Paid
                                                </button>
                                                <button
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => {
                                                        setStatusFilter("created");
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                >
                                                    Created
                                                </button>
                                                <button
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => {
                                                        setStatusFilter("failed");
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                >
                                                    Failed
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                        <Calendar className="h-4 w-4" />
                                        <span>Date Range</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    <button
                                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        onClick={refreshData}
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                                        />
                                        <span>Refresh</span>
                                    </button>

                                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                        <Download className="h-4 w-4" />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Transaction Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Order ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Payment ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Subscription Plan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Expire
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                Loading transactions...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-10 text-center text-sm text-red-500"
                                            >
                                                {error}
                                            </td>
                                        </tr>
                                    ) : filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((transaction) => (
                                            <tr
                                                key={transaction._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(transaction.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.razorpayOrderId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.razorpayPaymentId || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {transaction.subscriptionPlan ? (
                                                        <>
                                                            {transaction.subscriptionPlan.name}
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                ({transaction.subscriptionPlan.period})
                                                            </span>
                                                        </>
                                                    ) : (
                                                        "Unknown Plan"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(
                                                        transaction.amount,
                                                        transaction.currency
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                                    {new Date(transaction.expireAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={transaction.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        onClick={() => handilenavigation(transaction._id)}
                                                    >
                                                        View
                                                    </button>
                                                    {/* {transaction.status === "paid" && (
                                                        <button className="text-blue-600 hover:text-blue-900 ml-4">
                                                            Invoice
                                                        </button>
                                                    )} */}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">1</span> to{" "}
                                        <span className="font-medium">
                                            {filteredTransactions.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {filteredTransactions.length}
                                        </span>{" "}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav
                                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                        aria-label="Pagination"
                                    >
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Previous</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            1
                                        </button>
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Next</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}