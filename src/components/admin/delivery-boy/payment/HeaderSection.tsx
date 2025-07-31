interface HeaderSectionProps {
  totalDeliveryBoys: number;
  totalOrders: number;
  totalPendingPayments: number;
  totalCompletedPayments: number;
  totalEarnings: number;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  totalDeliveryBoys,
  totalOrders,
  totalPendingPayments,
  totalCompletedPayments,
  totalEarnings,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 animate-in fade-in duration-300">
          Delivery Boy Payments
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Manage weekly earnings and monthly payments for delivery partners
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-200 rounded-2xl shadow-md p-4 border border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Total Delivery Boys</p>
          <p className="text-2xl font-bold text-gray-900">{totalDeliveryBoys}</p>
        </div>
        <div className="bg-gray-200 rounded-2xl shadow-md p-4 border border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-gray-200 rounded-2xl shadow-md p-4 border border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Pending Payments</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalPendingPayments.toLocaleString()}</p>
        </div>
        <div className="bg-gray-200 rounded-2xl shadow-md p-4 border border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Completed Payments</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalCompletedPayments.toLocaleString()}</p>
        </div>
        <div className="bg-gray-200 rounded-2xl shadow-md p-4 border border-gray-300">
          <p className="text-sm text-gray-700 font-medium">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;