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
        console.log('orders :',orders)
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
    <div className="min-h-screen bg-gray-100">
      <style>
        {`
          /* Custom styles for the customer list page */
          .table-row-hover {
            transition: all 0.3s ease;
          }
          .table-row-hover:hover {
            background-color: #e0f2fe; /* Soft teal for hover */
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .search-input {
            transition: all 0.3s ease;
          }
          .search-input:focus {
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            border-color: #4f46e5;
          }
          .card-gradient {
            background: linear-gradient(to right, #4f46e5, #06b6d4);
            padding: 2px;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
          }
          .card-gradient:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }
          .card-inner {
            background: white;
            border-radius: 0.625rem;
            padding: 1rem;
          }
          .loading-spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .empty-state {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
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
      <Header
        isOnline={isOnline}
        handleToggleOnline={handleToggleOnline}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="md:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">Customer Directory</h1>
            <p className="text-gray-500 text-sm">Explore and manage your customer information with ease.</p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, mobile, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 bg-white text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full loading-spinner"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Loading Customers...</h3>
              <p className="text-gray-500 mt-2 text-sm">Fetching your customer data, please wait.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full bg-white">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-sm rounded-tl-xl">Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm">Mobile</th>
                      <th className="px-6 py-4 text-left font-semibold text-sm rounded-tr-xl">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={`table-row-hover border-t border-gray-200 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4 text-indigo-600 font-medium text-sm">{customer.name}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{customer.mobile}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{customer.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="card-gradient">
                    <div className="card-inner">
                      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{customer.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm">{customer.mobile}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredCustomers.length === 0 && (
                <div className="empty-state text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                  <Search className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">No Customers Found</h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No customer data available.'}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-8 text-center">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="text-indigo-600 text-sm">
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