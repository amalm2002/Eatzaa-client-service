import { useEffect, useState } from 'react';
import Header from './navbar/header';
import Sidebar from './navbar/sidebar';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import HeaderSection from '../../components/restaurant/subscription-plans/HeaderSection';
import PlansSection from '../../components/restaurant/subscription-plans/PlansSection';
import FeaturesSection from '../../components/restaurant/subscription-plans/FeaturesSection';
import FAQSection from '../../components/restaurant/subscription-plans/FAQSection';
import { Plan } from '../../interfaces/restaurant/subscription/plan.types';
import { RazorpayOptions, RazorpayInstance } from '../../interfaces/restaurant/subscription/razorpay.types';
import { restaurantApi } from '../../api/endpoints/restaurantApi';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('Payment');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const restaurantId = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);

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
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const fetchedPlans = await restaurantApi.fetchSubscriptionPlans(dispatch);
        setPlans(fetchedPlans);
      } catch (error: any) {
        console.error('Error fetching subscription plans:', error);
        toast.error(error.message || 'Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptionPlans();
  }, []);

  const handleRazorpayCheckout = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      const plan = plans.find((p) => p.id === planId);

      if (!plan) {
        toast.error('Plan not found!');
        return;
      }

      const planExistence = await restaurantApi.checkPlanExistence(dispatch, restaurantId);
      if (!planExistence.allowed) {
        toast.error(planExistence.message);
        return;
      }

      const planPrice = plan.price.replace('₹', '');
      const response = await restaurantApi.initiateSubscriptionPayment(dispatch, {
        amount: planPrice,
        planId: plan.id,
        restaurantId,
      });

      const { orderId, razorpayKey } = response;

      if (!orderId || !razorpayKey) {
        toast.error('Invalid response from server');
        return;
      }

      if (!window.Razorpay) {
        toast.error('Razorpay SDK not loaded. Please try again.');
        return;
      }

      const options = {
        key: razorpayKey,
        amount: parseInt(plan.price.replace('₹', '')) * 100,
        currency: 'INR',
        name: 'Eatzaa Food Hub',
        description: plan.description,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await restaurantApi.verifyPayment(dispatch, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              restaurantId,
            });
            toast.success('Payment verified and subscription activated!');
            navigate(`/restaurant-payment-history`);
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error(error.message);
          }
        },
        prefill: {
          name: 'Eatzaa Food Hub',
          email: 'eatzaafoodhub@gmail.com',
          contact: '+91 0495 56765',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razor = new window.Razorpay(options);
      razor.on('payment.failed', async function (response: any) {
        try {
          await restaurantApi.logPaymentFailure(dispatch, {
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            error_code: response.error.code,
            error_description: response.error.description,
            planId: plan.id,
            restaurantId,
          });
          toast.error('Payment failed. Please try again.');
          navigate('/restaurant-payment-history');
        } catch (error: any) {
          console.error('Failed to log payment failure:', error);
          toast.error(error.message);
        }
      });
      razor.open();
    } catch (error: any) {
      console.error('Error during payment:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />
      <div className="md:ml-64">
        <Header
          isOnline={isOnline}
          handleToggleOnline={handleToggleOnline}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <HeaderSection />
        <PlansSection
          plans={plans}
          loading={loading}
          selectedPlan={selectedPlan}
          handleRazorpayCheckout={handleRazorpayCheckout}
        />
        <FeaturesSection />
        <FAQSection />
      </div>
    </div>
  );
}