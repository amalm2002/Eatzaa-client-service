import { useEffect, useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiChevronDown,
  FiCalendar,
  FiPhone,
  FiTruck,
  FiDollarSign,
  FiCreditCard,
  FiEye,
  FiChevronUp,
  FiCheck,
  FiClock
} from 'react-icons/fi';
import { adminApi } from '../../../api/endpoints/adminApi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Types
interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  weeklyEarnings: number;
  inHandCash: number;
  totalCash: number;
  ordersCompleted: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
  status: 'pending' | 'paid' | 'overdue';
  completeAmount: number;
  amountToPayDeliveryBoy: number;
  monthlyEarnings: {
    month: string;
    amount: number;
    orders: number;
    status: 'pending' | 'paid';
  }[];
}

const DeliveryPaymentManagement = () => {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [sortField, setSortField] = useState<keyof DeliveryBoy>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<DeliveryBoy | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        setLoading(true);
        const data = await adminApi.fetchDeliveryBoys(dispatch);
        const mappedDeliveryBoys: DeliveryBoy[] = data.fetchDeliveryBoys.map((item: any) => ({
          id: item._id,
          name: item.name,
          phone: item.mobile || 'N/A',
          joinDate: item.createdAt || new Date().toISOString(),
          weeklyEarnings: item.earnings?.week || 0,
          inHandCash: item.inHandCash || 0,
          totalCash: item.monthlyAmount || 0,
          ordersCompleted: item.ordersCompleted || 0,
          lastPaymentDate: item.lastPaidAt || new Date().toISOString(),
          nextPaymentDate: item.nextPaidAt || new Date().toISOString(),
          status: item.status || 'pending',
          completeAmount: item.completeAmount || 0,
          amountToPayDeliveryBoy: item.amountToPayDeliveryBoy || 0,
          monthlyEarnings: (item.earnings?.history || []).map((earning: any) => ({
            month: new Date(earning.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
            amount: earning.amount,
            orders: 1,
            status: item.status === 'paid' ? 'paid' : 'pending',
          })),
        }));
        setDeliveryBoys(mappedDeliveryBoys);
      } catch (error: any) {
        toast.error('Failed to fetch delivery boys');
        console.error('Error fetching delivery boys:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryBoys();
  }, [dispatch]);

  const totalEarnings = deliveryBoys.reduce((sum, boy) => sum + boy.totalCash, 0);
  const totalPendingPayments = deliveryBoys
    .filter(boy => boy.status === 'pending')
    .reduce((sum, boy) => sum + boy.totalCash, 0);
  const totalCompletedPayments = deliveryBoys.reduce((sum, boy) => sum + boy.completeAmount, 0);
  const totalDeliveryBoys = deliveryBoys.length;
  const totalOrders = deliveryBoys.reduce((sum, boy) => sum + boy.ordersCompleted, 0);

  const filteredDeliveryBoys = deliveryBoys.filter(boy => {
    const matchesSearch = boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boy.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || boy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedDeliveryBoys = [...filteredDeliveryBoys].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveryBoys = sortedDeliveryBoys.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedDeliveryBoys.length / itemsPerPage);

  const handleSort = (field: keyof DeliveryBoy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-gray-200 text-gray-800 border border-gray-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'overdue':
        return 'bg-gray-300 text-gray-900 border border-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePayDeliveryBoy = async (deliveryBoyId: string, completeAmount: number) => {
    try {
      if (completeAmount <= 0) {
        toast.error('Invalid payment amount');
        return;
      }

      setProcessingPayment(deliveryBoyId);
      const orderResponse = await adminApi.createRazorpayOrder(dispatch, {
        deliveryBoyId,
        amount: completeAmount * 100,
      });
      console.log('createRazorpayOrder response:', orderResponse);

      if (!orderResponse || !orderResponse.orderId ) {
        throw new Error('Invalid Razorpay order response: missing orderId, amount, or currency');
      }

      const options = {
        key: orderResponse.razorpayKey,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Delivery Payment',
        description: `Payment for delivery boy ${deliveryBoyId}`,
        order_id: orderResponse.orderId,
        handler: async (response: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) => {
          try {
            console.log('Razorpay payment response:', response);
            const verificationResponse = await adminApi.verifyPayment(dispatch, {
              deliveryBoyId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log('verifyPayment response:', verificationResponse);

            setDeliveryBoys(prev =>
              prev.map(boy =>
                boy.id === deliveryBoyId
                  ? {
                    ...boy,
                    status: 'paid',
                    lastPaymentDate: new Date().toISOString(),
                    completeAmount: boy.completeAmount + completeAmount,
                    monthlyEarnings: [
                      ...boy.monthlyEarnings,
                      {
                        month: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
                        amount: completeAmount,
                        orders: 1,
                        status: 'paid',
                      },
                    ],
                  }
                  : boy
              )
            );

            toast.success('Payment processed successfully!');
            if (selectedDeliveryBoy?.id === deliveryBoyId) {
              setSelectedDeliveryBoy(null);
            }
          } catch (error: any) {
            toast.error('Payment verification failed: ' + (error.message || 'Unknown error'));
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: deliveryBoys.find(boy => boy.id === deliveryBoyId)?.name || '',
          contact: deliveryBoys.find(boy => boy.id === deliveryBoyId)?.phone || '',
        },
        theme: {
          color: '#4B5563',
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(null);
            toast.info('Payment cancelled');
          },
        },
      };

      console.log('Razorpay options:', options);
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error('Failed to initiate payment: ' + (error.message || 'Unknown error'));
      console.error('Payment initiation error:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          {/* Header Section */}
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

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none text-gray-900"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid' | 'overdue')}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
              </div>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none text-gray-900"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | '7days' | '30days' | '90days')}
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
              </div>
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              <button className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2">
                <FiDownload size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {[
                      { field: 'name', label: 'Delivery Boy' },
                      { field: 'weeklyEarnings', label: 'Weekly Earnings' },
                      { field: 'inHandCash', label: 'In-Hand Cash' },
                      { field: 'totalCash', label: 'Total Cash' },
                      { field: 'amountToPayDeliveryBoy', label: 'Owed to Admin' },
                      { field: 'ordersCompleted', label: 'Orders' },
                      { field: 'nextPaymentDate', label: 'Next Payment' },
                      { field: 'status', label: 'Status' },
                    ].map((header) => (
                      <th
                        key={header.field}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                        onClick={() => handleSort(header.field as keyof DeliveryBoy)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{header.label}</span>
                          {sortField === header.field && (
                            sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-600">
                        Loading...
                      </td>
                    </tr>
                  ) : paginatedDeliveryBoys.length > 0 ? (
                    paginatedDeliveryBoys.map((deliveryBoy) => (
                      <tr
                        key={deliveryBoy.id}
                        className="hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                              {deliveryBoy.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{deliveryBoy.name}</div>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <FiPhone size={12} />
                                {deliveryBoy.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">₹{deliveryBoy.weeklyEarnings.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-700">₹{deliveryBoy.inHandCash.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">₹{deliveryBoy.completeAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-700">₹{deliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiTruck className="text-gray-600" size={16} />
                            <span className="font-semibold text-gray-900">{deliveryBoy.ordersCompleted}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">{formatDate(deliveryBoy.nextPaymentDate)}</div>
                          <div className="text-xs text-gray-600">Monthly payout</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(deliveryBoy.status)}`}
                          >
                            {deliveryBoy.status.charAt(0).toUpperCase() + deliveryBoy.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full shadow-sm transform hover:scale-110 transition-all"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => handlePayDeliveryBoy(deliveryBoy.id, deliveryBoy.completeAmount)}
                              disabled={deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id}
                              className={`px-3 py-1 rounded-lg shadow-sm transform transition-all flex items-center gap-1 text-sm
                                ${(deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id)
                                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                  : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                                }`}
                            >
                              <FiDollarSign size={14} />
                              <span>{processingPayment === deliveryBoy.id ? 'Processing...' : 'Pay'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-600">
                        No delivery boys found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-600">
                  Loading...
                </div>
              ) : paginatedDeliveryBoys.length > 0 ? (
                paginatedDeliveryBoys.map((deliveryBoy) => (
                  <div
                    key={deliveryBoy.id}
                    className="p-5 border-b border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                          {deliveryBoy.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{deliveryBoy.name}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <FiPhone size={12} />
                            {deliveryBoy.phone}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(deliveryBoy.status)}`}
                      >
                        {deliveryBoy.status.charAt(0).toUpperCase() + deliveryBoy.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <div className="text-gray-600 text-xs font-medium">Weekly Earnings</div>
                        <div className="font-semibold text-gray-900">₹{deliveryBoy.weeklyEarnings.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs font-medium">In-Hand Cash</div>
                        <div className="font-semibold text-gray-700">₹{deliveryBoy.inHandCash.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs font-medium">Total Cash</div>
                        <div className="font-semibold text-gray-900">₹{deliveryBoy.completeAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs font-medium">Owed to Admin</div>
                        <div className="font-semibold text-gray-700">₹{deliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs font-medium">Orders Completed</div>
                        <div className="flex items-center gap-1">
                          <FiTruck className="text-gray-600" size={14} />
                          <span className="font-semibold text-gray-900">{deliveryBoy.ordersCompleted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-gray-600 text-xs font-medium">Next Payment Date</div>
                      <div className="text-gray-700">{formatDate(deliveryBoy.nextPaymentDate)}</div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <FiEye size={16} />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => handlePayDeliveryBoy(deliveryBoy.id, deliveryBoy.completeAmount)}
                        disabled={deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id}
                        className={`px-4 py-2 rounded-lg shadow-sm transform transition-all flex items-center gap-2
                          ${(deliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === deliveryBoy.id)
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                          }`}
                      >
                        <FiDollarSign size={16} />
                        <span>{processingPayment === deliveryBoy.id ? 'Processing...' : 'Pay Now'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-600">
                  No delivery boys found matching your filters
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">
                  of {sortedDeliveryBoys.length} delivery boys
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentPage === pageNum
                          ? 'bg-gray-800 text-white'
                          : 'border border-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {selectedDeliveryBoy && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xl">
                        {selectedDeliveryBoy.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedDeliveryBoy.name}</h2>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FiPhone size={16} />
                          {selectedDeliveryBoy.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          Joined: {formatDate(selectedDeliveryBoy.joinDate)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDeliveryBoy(null)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDollarSign className="text-gray-700" size={20} />
                        <span className="text-sm font-medium text-gray-700">Weekly Earnings</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.weeklyEarnings.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FiCreditCard className="text-gray-700" size={20} />
                        <span className="text-sm font-medium text-gray-700">In-Hand Cash</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.inHandCash.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDollarSign className="text-gray-700" size={20} />
                        <span className="text-sm font-medium text-gray-700">Completed Payments</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.completeAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDollarSign className="text-gray-700" size={20} />
                        <span className="text-sm font-medium text-gray-700">Owed to Admin</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedDeliveryBoy.amountToPayDeliveryBoy.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FiTruck className="text-gray-700" size={20} />
                        <span className="text-sm font-medium text-gray-700">Orders Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedDeliveryBoy.ordersCompleted}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings History</h3>
                    <div className="space-y-3">
                      {selectedDeliveryBoy.monthlyEarnings.map((earning, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200">
                          <div>
                            <div className="font-medium text-gray-900">{earning.month}</div>
                            <div className="text-sm text-gray-600">{earning.orders} orders completed</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-gray-900">₹{earning.amount.toLocaleString()}</div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${earning.status === 'paid'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-gray-100 text-gray-700'
                              }`}>
                              {earning.status === 'paid' ? (
                                <span className="flex items-center gap-1">
                                  <FiCheck size={12} />
                                  Paid
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FiClock size={12} />
                                  Pending
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Payment Schedule</h4>
                    <p className="text-sm text-gray-700">
                      Next payment due: <strong>{formatDate(selectedDeliveryBoy.nextPaymentDate)}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Payments are processed monthly on the 1st of each month for the previous month's earnings.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setSelectedDeliveryBoy(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handlePayDeliveryBoy(selectedDeliveryBoy.id, selectedDeliveryBoy.completeAmount);
                        setSelectedDeliveryBoy(null);
                      }}
                      disabled={selectedDeliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === selectedDeliveryBoy.id}
                      className={`px-6 py-3 rounded-lg shadow-sm transform transition-all flex items-center gap-2
                        ${(selectedDeliveryBoy.amountToPayDeliveryBoy > 0 || processingPayment === selectedDeliveryBoy.id)
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                        }`}
                    >
                      <FiDollarSign size={18} />
                      <span>{processingPayment === selectedDeliveryBoy.id ? 'Processing...' : 'Process Payment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeliveryPaymentManagement;