import { formatCurrency, formatDate } from "../../../utils/formatDate";
import { AnalyticsCardsProps } from "../../../interfaces/restaurant/transaction/analytics-card.types";

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ transactions }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-5 border border-gray-100 card-hover">
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(transactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0), "INR")}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{transactions.length} transactions</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-100 card-hover">
                <p className="text-sm font-medium text-gray-500">Current Plan</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">Premium Plan</h3>
                <p className="text-xs text-gray-400 mt-1">
                    Next billing: {formatDate(new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString())}
                </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-100 card-hover">
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <div className="flex flex-wrap gap-3 mt-2">
                    {[
                        { status: "paid", color: "bg-green-500", count: transactions.filter((t) => t.status === "paid").length },
                        { status: "pending", color: "bg-blue-500", count: transactions.filter((t) => t.status === "created").length },
                        { status: "failed", color: "bg-red-500", count: transactions.filter((t) => t.status === "failed").length },
                    ].map(({ status, color, count }) => (
                        <div key={status} className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${color}`} />
                            <span className="text-xs text-gray-600 capitalize">{status} ({count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCards;