import { Store, Utensils } from "lucide-react";

const LoginSidebar: React.FC = () => {
  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
        <Utensils className="w-64 h-64 text-blue-900" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-10">
        <Store className="w-64 h-64 text-blue-900" />
      </div>

      <div className="max-w-md text-center z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Your Restaurant With Ease</h2>
        <p className="text-gray-600 mb-6">
          Access your restaurant dashboard, update your menu, check orders, and gain valuable insights
          about your customers' preferences.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Real-time Orders</h3>
            <p className="text-gray-600 text-sm">Receive and manage orders in real-time with instant notifications</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">Menu Management</h3>
            <p className="text-gray-600 text-sm">Update your menu items, prices, and availability with ease</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Customer Insights</h3>
            <p className="text-gray-600 text-sm">Understand your customers better with detailed analytics</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">Table Reservations</h3>
            <p className="text-gray-600 text-sm">Manage bookings and optimize your seating arrangements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSidebar;