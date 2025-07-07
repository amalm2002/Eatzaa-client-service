import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import createAxios from "../../service/axious-services/restaurantAxious";
import useRestaurantStatus from "../../hooks/useRestaurantStatus";
import { toast } from "sonner";
import Header from "./navbar/header";
import Sidebar from "./navbar/sidebar";
import TransactionHeader from "../../components/restaurant/transaction-management/TransactionHeader";
import TransactionCard from "../../components/restaurant/transaction-management/TransactionCard";
import LoadingState from "../../components/restaurant/transaction-management/LoadingState";
import ErrorState from "../../components/restaurant/transaction-management/ErrorState";
import EmptyState from "../../components/restaurant/order-management/EmptyState";
import { Transaction } from "../../interfaces/restaurant/transaction/transaction-details.types";
import { restaurantApi } from "../../api/endpoints/restaurantApi";

const TransactionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState("PaymentHistory");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isOnline, handleToggleOnline } = useRestaurantStatus();
    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const restaurantId = useSelector(
        (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
    );

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!id) {
                setError("Invalid transaction ID");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const transformedData = await restaurantApi.fetchTransactionDetails(dispatch, id);
                setTransaction(transformedData);
            } catch (error: any) {
                setError(error.response?.data?.message || "Failed to fetch transaction details");
                toast.error(error.response?.data?.message || "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactionDetails();
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
            <div className="flex-1 md:ml-64">
                <Header
                    isOnline={isOnline}
                    handleToggleOnline={handleToggleOnline}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <TransactionHeader />
                    {isLoading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : transaction ? (
                        <TransactionCard transaction={transaction} axiosInstance={axiosInstance} navigate={navigate} />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;