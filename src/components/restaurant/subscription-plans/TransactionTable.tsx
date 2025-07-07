import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/formatDate";
import StatusBadge from "../transaction-management/StatusBadge";
import { TransactionTableProps } from "../../../interfaces/restaurant/transaction/transaction-table.types";

const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    currentPage,
    totalPages,
    setCurrentPage,
    navigateToDetails,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-100">
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Date", "Order ID", "Payment ID", "Plan", "Amount", "Expires", "Status", ""].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50 transition-all duration-200">
                                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(transaction.createdAt)}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{transaction.razorpayOrderId}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{transaction.razorpayPaymentId || "-"}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {transaction.subscriptionPlan?.name || "Unknown Plan"} <span className="text-xs text-gray-400">({transaction.subscriptionPlan?.period || "unknown"})</span>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {new Date(transaction.expireAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={transaction.status} />
                                </td>
                                <td className="px-4 py-3 text-right text-sm">
                                    <button
                                        className="text-indigo-500 hover:text-indigo-700 font-medium transition-all duration-200"
                                        onClick={() => navigateToDetails(transaction._id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden p-4 space-y-3">
                {transactions.map((transaction) => (
                    <div key={transaction._id} className="bg-white rounded-md p-4 border border-gray-100 card-hover">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">{formatDate(transaction.createdAt)}</span>
                            <StatusBadge status={transaction.status} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-500">
                            <p><span className="font-medium text-gray-900">Order:</span> {transaction.razorpayOrderId}</p>
                            <p><span className="font-medium text-gray-900">Payment:</span> {transaction.razorpayPaymentId || "-"}</p>
                            <p><span className="font-medium text-gray-900">Plan:</span> {transaction.subscriptionPlan?.name || "Unknown Plan"} ({transaction.subscriptionPlan?.period || "unknown"})</p>
                            <p><span className="font-medium text-gray-900">Amount:</span> {formatCurrency(transaction.amount, transaction.currency)}</p>
                            <p><span className="font-medium text-gray-900">Expires:</span> {new Date(transaction.expireAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                        </div>
                        <button
                            className="mt-2 text-indigo-500 hover:text-indigo-700 text-sm font-medium transition-all duration-200"
                            onClick={() => navigateToDetails(transaction._id)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionTable;