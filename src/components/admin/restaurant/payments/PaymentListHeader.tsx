import { Header } from "../../../../pages/A/header/header";
import { PaymentListHeaderProps } from "../../../../interfaces/admin/restaurants/restaurant-payments.types";

const PaymentListHeader = ({ totalAmount, paidAmount }: PaymentListHeaderProps) => {
    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
                        Payment History
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-2">
                        Monitor all restaurant subscription payments and transactions
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-md p-4 border border-green-200">
                        <p className="text-sm text-green-700 font-medium">Total Paid Amount</p>
                        <p className="text-2xl font-bold text-green-800">₹{paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-md p-4 border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-800">₹{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentListHeader;