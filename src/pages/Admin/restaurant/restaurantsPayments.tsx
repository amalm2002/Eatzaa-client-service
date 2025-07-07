import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'sonner';
import PaymentListHeader from '../../../components/admin/restaurant/payments/PaymentListHeader';
import PaymentListFilters from '../../../components/admin/restaurant/payments/PaymentListFilters';
import PaymentListTable from '../../../components/admin/restaurant/payments/PaymentListTable';
import PaymentListPagination from '../../../components/admin/restaurant/payments/PaymentListPagination';
import { Payment } from '../../../interfaces/admin/restaurants/restaurant-payments.types';
import { adminApi } from '../../../api/endpoints/adminApi';

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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await adminApi.fetchPayments(dispatch);
        const mappedPayments: Payment[] = data.response.map((item: any) => ({
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
          isActive: item.isActive,
        }));
        setPayments(mappedPayments);
        const total = mappedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalAmount(total);
        const paid = mappedPayments
          .filter((payment) => payment.status === 'paid')
          .reduce((sum, payment) => sum + payment.amount, 0);
        setPaidAmount(paid);
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
    switch (dateFilter) {
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
    return payments.filter((payment) => payment.createdAt >= cutoffDate);
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
        return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
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
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });

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
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          <PaymentListHeader totalAmount={totalAmount} paidAmount={paidAmount} />
          <PaymentListFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <PaymentListTable
            paginatedPayments={paginatedPayments}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleView={handleView}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
          <PaymentListPagination
            filteredPayments={filteredPayments}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default PaymentListPage;