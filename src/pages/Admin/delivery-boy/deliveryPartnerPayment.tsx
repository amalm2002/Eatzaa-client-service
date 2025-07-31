import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';
import { adminApi } from '../../../api/endpoints/adminApi';
import { DeliveryBoy, VerifyPaymentResponse } from '../../../interfaces/admin/delivery-boys/delivery-boy-payment.types';
import HeaderSection from '../../../components/admin/delivery-boy/payment/HeaderSection';
import FiltersSection from '../../../components/admin/delivery-boy/payment/FilterSection';
import DeliveryBoysTable from '../../../components/admin/delivery-boy/payment/DeliveryBoyTable';;
import DeliveryBoyDetailsModal from '../../../components/admin/delivery-boy/payment/DeliveryBoyDetails';
import PaginationControls from '../../../components/admin/delivery-boy/payment/PginationController';
import { toast } from 'sonner';


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
        console.log('fetch deliveryBoy details :', data);

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
            status: earning.paid ? 'paid' : 'pending',
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

  console.log('deliveryBoy :', deliveryBoys);

  const totalEarnings = deliveryBoys.reduce((sum, boy) => sum + boy.totalCash, 0);
  const totalPendingPayments = deliveryBoys
    .filter((boy) => boy.status === 'pending')
    .reduce((sum, boy) => sum + boy.totalCash, 0);
  const totalCompletedPayments = deliveryBoys.reduce((sum, boy) => sum + boy.completeAmount, 0);
  const totalDeliveryBoys = deliveryBoys.length;
  const totalOrders = deliveryBoys.reduce((sum, boy) => sum + boy.ordersCompleted, 0);

  const filteredDeliveryBoys = deliveryBoys.filter((boy) => {
    const matchesSearch =
      boy.name.toLowerCase().includes(searchTerm.toLowerCase()) || boy.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || boy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedDeliveryBoys = [...filteredDeliveryBoys].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveryBoys = sortedDeliveryBoys.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof DeliveryBoy) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  const handlePayDeliveryBoy = async (deliveryBoyId: string, totalCash: number) => {
    try {
      if (totalCash <= 0) {
        toast.error('Invalid payment amount');
        return;
      }

      setProcessingPayment(deliveryBoyId);
      const orderResponse = await adminApi.createRazorpayOrder(dispatch, {
        deliveryBoyId,
        amount: totalCash * 100,
      });
      console.log('orderResponse :', orderResponse);
      if (!orderResponse || !orderResponse.orderId) {
        throw new Error(orderResponse?.error || 'Invalid Razorpay order response');
      }

      const options = {
        key: orderResponse.razorpayKey,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Delivery Payment',
        description: `Payment for delivery boy ${deliveryBoyId}`,
        order_id: orderResponse.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verificationResponse: AxiosResponse<VerifyPaymentResponse> = await adminApi.verifyPayment(
              dispatch,
              {
                deliveryBoyId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            if (verificationResponse.data.success) {
              const { data } = verificationResponse;
              const paidAmount = data.data.earnings.reduce((sum: number, earning: any) => sum + earning.amount, 0);
              const currentMonth = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });

              setDeliveryBoys((prev) =>
                prev.map((boy) =>
                  boy.id === deliveryBoyId
                    ? {
                      ...boy,
                      status: 'paid',
                      lastPaymentDate: new Date().toISOString(),
                      completeAmount: data.data.completeAmount + paidAmount,
                      inHandCash: data.data.inHandCash + paidAmount,
                      totalCash: data.data.monthlyAmount + paidAmount,
                      amountToPayDeliveryBoy: 0,
                      monthlyEarnings: boy.monthlyEarnings.map((earning) =>
                        earning.month === currentMonth
                          ? { ...earning, status: 'paid', amount: earning.amount + paidAmount }
                          : earning
                      ),
                    }
                    : boy
                )
              );
              toast.success('Payment processed and earnings updated successfully!');
              if (selectedDeliveryBoy?.id === deliveryBoyId) {
                setSelectedDeliveryBoy(null);
              }
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error: any) {
            toast.error('Payment verification failed: ' + (error.message || 'Unknown error'));
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: deliveryBoys.find((boy) => boy.id === deliveryBoyId)?.name || '',
          contact: deliveryBoys.find((boy) => boy.id === deliveryBoyId)?.phone || '',
        },
        theme: {
          color: '#4B5563',
        },
        modal: {
          ondismiss: async () => {
            setProcessingPayment(null);
            toast.info('Payment cancelled. You can try again after a few minutes.');
            try {
              await adminApi.cancelPayment(dispatch, { deliveryBoyId, orderId: orderResponse.orderId });
            } catch (error) {
              console.error('Error cancelling payment:', error);
            }
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setProcessingPayment(null);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      console.log('Triggering toast.error with message:', errorMessage); // Debug toast
      toast.error(errorMessage);
      console.error('Payment initiation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          <HeaderSection
            totalDeliveryBoys={totalDeliveryBoys}
            totalOrders={totalOrders}
            totalPendingPayments={totalPendingPayments}
            totalCompletedPayments={totalCompletedPayments}
            totalEarnings={totalEarnings}
          />
          <FiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
          <DeliveryBoysTable
            deliveryBoys={deliveryBoys}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            loading={loading}
            processingPayment={processingPayment}
            paginatedDeliveryBoys={paginatedDeliveryBoys}
            setSelectedDeliveryBoy={setSelectedDeliveryBoy}
            handlePayDeliveryBoy={handlePayDeliveryBoy}
          />
          <PaginationControls
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={sortedDeliveryBoys.length}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
          {selectedDeliveryBoy && (
            <DeliveryBoyDetailsModal
              selectedDeliveryBoy={selectedDeliveryBoy}
              processingPayment={processingPayment}
              setSelectedDeliveryBoy={setSelectedDeliveryBoy}
              handlePayDeliveryBoy={handlePayDeliveryBoy}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DeliveryPaymentManagement;