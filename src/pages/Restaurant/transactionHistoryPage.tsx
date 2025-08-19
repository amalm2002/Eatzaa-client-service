import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useRestaurantStatus from "../../hooks/useRestaurantStatus";
import { toast } from "sonner";
import Header from "./navbar/header";
import Sidebar from "./navbar/sidebar";
import TransactionHeader from "../../components/restaurant/subscription-plans/TransactionHeader";
import AnalyticsCards from "../../components/restaurant/subscription-plans/AnalyticsCards";
import TransactionFilters from "../../components/restaurant/subscription-plans/TransactionFilters";
import TransactionTable from "../../components/restaurant/subscription-plans/TransactionTable";
import LoadingState from "../../components/restaurant/transaction-management/LoadingState";
import ErrorState from "../../components/restaurant/transaction-management/ErrorState";
import EmptyState from "../../components/restaurant/order-management/EmptyState";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../interfaces/restaurant/transaction/transaction.types";
import { restaurantApi } from "../../api/endpoints/restaurantApi";
import { createAxiosInstance } from "../../service/axious-services/axiosInstance";

const TransactionHistory: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("PaymentHistory");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Transaction["status"] | "all">("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance('Restaurant', dispatch);
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTransactions = await restaurantApi.fetchTransactionHistory(dispatch, restaurantId);
        setTransactions(fetchedTransactions);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch transactions");
        toast.error(error.response?.data?.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionHistory();
  }, [restaurantId]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (transaction.subscriptionPlan?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesDate =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(transaction.createdAt) >= new Date(dateRange.from) &&
        new Date(transaction.createdAt) <= new Date(dateRange.to));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <style>
        {`
          .gradient-button {
            background: linear-gradient(to right, #4f46e5, #3b82f6);
            transition: all 0.2s ease;
          }
          .gradient-button:hover {
            background: linear-gradient(to right, #4338ca, #2563eb);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          .card-hover {
            transition: all 0.2s ease;
          }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }
          .input-focus {
            transition: all 0.2s ease;
          }
          .input-focus:focus {
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
          }
        `}
      </style>
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
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <TransactionHeader />
          <AnalyticsCards transactions={transactions} />
          <TransactionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            refreshData={() => setTransactions([...transactions])}
          />
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : paginatedTransactions.length > 0 ? (
            <TransactionTable
              transactions={paginatedTransactions}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
              setCurrentPage={setCurrentPage}
              navigateToDetails={(id) => navigate(`/restaurant/payments/${id}`)}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;