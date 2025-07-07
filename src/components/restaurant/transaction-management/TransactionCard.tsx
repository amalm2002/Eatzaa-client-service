import StatusBadge from "./StatusBadge";
import RetryPaymentButton from "./RetryPaymentButton";
import { formatDate, formatCurrency } from "../../../utils/formatDate";
import { TransactionCardProps } from "../../../interfaces/restaurant/transaction/transaction-card.types";

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, axiosInstance, navigate }) => {
    return (
        <div className="gradient-border">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {transaction.subscriptionPlan?.name || "Unknown Plan"}
                        </h2>
                        <p className="text-sm text-gray-500">{transaction.subscriptionPlan?.period || "Unknown period"}</p>
                    </div>
                    <StatusBadge status={transaction.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <p className="mt-1 text-gray-900">{transaction.razorpayPaymentId || "-"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                        <p className="mt-1 text-gray-900 font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
                        <p className="mt-1 text-gray-900">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                        <p className="mt-1 text-gray-900">{transaction.expireAt ? formatDate(transaction.expireAt) : "-"}</p>
                    </div>
                    {transaction.status === "failed" && (
                        <>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Error Code</h3>
                                <p className="mt-1 text-gray-900">{transaction.errorCode || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Error Description</h3>
                                <p className="mt-1 text-gray-900">{transaction.errorDescription || "-"}</p>
                            </div>
                        </>
                    )}
                </div>
                {transaction.status === "failed" && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <RetryPaymentButton transaction={transaction} axiosInstance={axiosInstance} navigate={navigate} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;