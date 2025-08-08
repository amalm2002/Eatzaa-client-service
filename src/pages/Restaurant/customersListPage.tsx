import React, { useEffect, useState } from 'react';
import { Search, Phone, MapPin } from 'lucide-react';
import Sidebar from './navbar/sidebar';
import Header from './navbar/header';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { restaurantApi } from '../../api/endpoints/restaurantApi';
import { Order } from '../../interfaces/restaurant/order/order.types';

interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
}

// interface Order {
//   _id: string;
//   userId: string;
//   userName: string;
//   phoneNumber: string;
//   address: { address: string }[]; 
//   orderId: string;
//   orderNumber: number;
//   orderStatus: string;
//   totalAmount: number;
//   createdAt: string;
// }

const CustomerListUI: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Customers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const dispatch = useDispatch();
  const restaurantId = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );
  useEffect(() => {
    const fetchCustomersFromOrders = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);

        const orders: Order[] = await restaurantApi.fetchOrders(dispatch, restaurantId);
        console.log('orderssssssss :', orders);

        const customerMap = new Map<string, Customer>();
        orders.forEach((order) => {
          if (!customerMap.has(order.userId)) {
            const addressString = order.address[0]
              ? `${order.address[0].street}, ${order.address[0].city}, ${order.address[0].state}, ${order.address[0].pinCode}`
              : 'N/A';

            customerMap.set(order.userId, {
              id: order.userId,
              name: order.userName || 'Unknown',
              mobile: order.phoneNumber || 'N/A',
              address: addressString,
            });
          }
        });

        const uniqueCustomers = Array.from(customerMap.values());

        setCustomers(uniqueCustomers);
        setLoading(false);

        if (uniqueCustomers.length === 0) {
          toast.info('No customers found in orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch customer data.');
        setLoading(false);
      }
    };

    fetchCustomersFromOrders();
  }, [restaurantId, dispatch]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />
      <Header
        isOnline={isOnline}
        handleToggleOnline={handleToggleOnline}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#6589f6] mb-2">Customer List</h1>
              <p className="text-gray-600">View all customer information</p>
            </div>

            {/* Search Section */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6589f6] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#6589f6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6589f6] focus:ring-opacity-20 text-[#6589f6] placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Loading Customers...</h3>
                <p className="text-gray-600 mt-2">Fetching customer data for your restaurant.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border border-[#6589f6] rounded-lg overflow-hidden bg-white shadow-sm">
                    <thead className="bg-[#6589f6] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Mobile</th>
                        <th className="px-6 py-4 text-left font-semibold">Address</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {filteredCustomers.map((customer, index) => (
                        <tr
                          key={customer.id}
                          className={`border-b border-[#6589f6] border-opacity-20 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            } hover:bg-[#6589f6] hover:bg-opacity-10 transition-colors`}
                        >
                          <td className="px-6 py-4 text-[#6589f6] font-medium">{customer.name}</td>
                          <td className="px-6 py-4 text-gray-700">{customer.mobile}</td>
                          <td className="px-6 py-4 text-gray-700">{customer.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="bg-white border border-[#6589f6] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-[#6589f6]">{customer.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-[#6589f6]" />
                          <span className="text-sm">{customer.mobile}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-[#6589f6] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border border-[#6589f6] border-opacity-20">
                    <div className="text-[#6589f6] mb-4">
                      <Search className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#6589f6] mb-2">No customers found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search terms' : 'No customers available'}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-8 text-center">
                  <div className="bg-white rounded-lg border border-[#6589f6] border-opacity-20 p-4 shadow-sm">
                    <p className="text-[#6589f6]">
                      Total Customers: <span className="font-semibold">{customers.length}</span>
                      {searchTerm && (
                        <span className="ml-4">
                          Showing: <span className="font-semibold">{filteredCustomers.length}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default CustomerListUI;