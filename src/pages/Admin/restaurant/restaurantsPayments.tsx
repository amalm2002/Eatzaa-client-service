
import React, { useEffect, useState } from 'react';
import { Header } from '../header/header';
import { FiSearch, FiFilter, FiEye, FiDownload, FiChevronDown, FiChevronUp, FiCalendar } from 'react-icons/fi';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Payment {
  id: string;
  restaurantId: string;
  restaurantName: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: Date;
  expireAt?: Date;
  isActive: boolean;
}

const PaymentListPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Payment>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'created' | 'failed'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/getAllPayments');
        // console.log('get all response from the getAllPayments:', response);

        if (response.data.message === 'success') {
          const mappedPayments: Payment[] = response.data.response.map((item: any) => ({
            id: item._id,
            restaurantId: item.restaurantId?._id || item.restaurantId,
            restaurantName: item.restaurantId?.restaurantName || 'Unknown Restaurant',
            subscriptionName: item.subscriptionId?.name || 'Standard Plan',
            amount: item.amount || 0,
            currency: item.currency || 'INR',
            razorpayOrderId: item.razorpayOrderId,
            razorpayPaymentId: item.razorpayPaymentId,
            status: item.status || 'created',
            createdAt: new Date(item.createdAt),
            expireAt: item.expireAt ? new Date(item.expireAt) : undefined,
            isActive: item.isActive
          }));
          
          setPayments(mappedPayments);
          
          const total = mappedPayments.reduce((sum, payment) => sum + payment.amount, 0);
          setTotalAmount(total);
          
          const paid = mappedPayments
            .filter(payment => payment.status === 'paid')
            .reduce((sum, payment) => sum + payment.amount, 0);
          setPaidAmount(paid);
        } else {
          toast.error('Failed to load payments');
        }
      } catch (error: any) {
        toast.error('Internal error');
        console.log('Error on payment list page side', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleView = (id: string) => {
    // Navigate to payment details page
    // navigate(`/admin/payments/${id}`);
    console.log('View payment', id);
  };

  const handleSort = (field: keyof Payment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getDateFilteredPayments = (payments: Payment[]) => {
    if (dateFilter === 'all') return payments;
    
    const now = new Date();
    let daysAgo = 0;
    
    switch(dateFilter) {
      case '7days':
        daysAgo = 7;
        break;
      case '30days':
        daysAgo = 30;
        break;
      case '90days':
        daysAgo = 90;
        break;
    }
    
    const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
    return payments.filter(payment => payment.createdAt >= cutoffDate);
  };

  const filteredPayments = getDateFilteredPayments(payments)
    .filter((payment) => {

      const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
      
      let activeMatch = true;
      if (activeFilter === 'active') {
        activeMatch = payment.isActive;
      } else if (activeFilter === 'expired') {
        activeMatch = !payment.isActive;
      }
      
      const searchMatch = 
        payment.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
      return statusMatch && activeMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortField === 'amount') {
        return sortDirection === 'asc'
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else if (sortField === 'createdAt' || sortField === 'expireAt') {
        const aDate = a[sortField] as Date;
        const bDate = b[sortField] as Date;
        
        if (!aDate) return sortDirection === 'asc' ? 1 : -1;
        if (!bDate) return sortDirection === 'asc' ? -1 : 1;
        
        return sortDirection === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      } else {
        const aValue = String(a[sortField]).toLowerCase();
        const bValue = String(b[sortField]).toLowerCase();
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return format(date, 'dd MMM yyyy, h:mm a');
  };

  const getStatusColor = (status: 'created' | 'paid' | 'failed') => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <Header />
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          {/* Header Section */}
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

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by restaurant or order ID..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-gray-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'created' | 'failed')}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="created">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-gray-700"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | '7days' | '30days' | '90days')}
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-gray-700"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'expired')}
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="mt-4 flex gap-3 justify-end">
              <button className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2">
                <FiDownload size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Payment List */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      { field: 'restaurantName', label: 'Restaurant' },
                      { field: 'amount', label: 'Amount' },
                      { field: 'status', label: 'Status' },
                      { field: 'subscriptionName', label: 'Plan' },
                      { field: 'createdAt', label: 'Payment Date' },
                      { field: 'expireAt', label: 'Expiry Date' },
                    ].map((header) => (
                      <th
                        key={header.field}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => handleSort(header.field as keyof Payment)}
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
                <tbody className="divide-y divide-gray-100">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{payment.restaurantName}</div>
                          <div className="text-xs text-gray-600 mt-1">Order: {payment.razorpayOrderId.slice(0, 10)}...</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{payment.currency} {payment.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(payment.status)}`}
                          >
                            {payment.status === 'created' ? 'Pending' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{payment.subscriptionName}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(payment.createdAt)}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className={payment.isActive ? 'text-gray-700' : 'text-red-600 font-medium'}>
                            {formatDate(payment.expireAt)}
                            {!payment.isActive && <span className="block text-xs mt-1">(Expired)</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleView(payment.id)}
                              className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                            >
                              <FiEye size={20} />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full shadow-sm transform hover:scale-110 transition-all">
                              <FiDownload size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No payment records found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-5 border-b border-gray-100 hover:bg-orange-50/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-gray-900">{payment.restaurantName}</div>
                        <div className="text-xs text-gray-600 mt-1">{payment.subscriptionName}</div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(payment.status)}`}
                      >
                        {payment.status === 'created' ? 'Pending' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <div className="text-gray-500 text-xs font-medium">Amount</div>
                        <div className="font-semibold text-gray-900">{payment.currency} {payment.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs font-medium">Payment Date</div>
                        <div className="text-gray-700">{formatDate(payment.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs font-medium">Order ID</div>
                        <div className="text-gray-700 text-xs">{payment.razorpayOrderId.slice(0, 15)}...</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs font-medium">Expiry Date</div>
                        <div className={payment.isActive ? 'text-gray-700' : 'text-red-600 font-medium'}>
                          {formatDate(payment.expireAt)}
                          {!payment.isActive && <span className="text-xs">(Expired)</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleView(payment.id)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-sm transform hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <FiEye size={16} />
                        <span>Details</span>
                      </button>
                      <button className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transform hover:scale-105 transition-all">
                        <FiDownload size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No payment records found matching your filters
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-orange-50 to-gray-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <select
                  className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 shadow-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
                
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50 transform hover:scale-105 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentListPage;