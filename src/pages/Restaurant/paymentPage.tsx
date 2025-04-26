import { useEffect, useState } from 'react';
import { Check, ShoppingBag, Shield, ChevronRight } from 'lucide-react';
import Header from './navbar/header';
import Sidebar from './navbar/sidebar';
import useRestaurantStatus from '../../hooks/useRestaurantStatus';
import createAxios from '../../service/axiousServices/restaurantAxious';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('Payment');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isOnline, handleToggleOnline } = useRestaurantStatus();

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/get-all-plans');
        if (response.data.message === 'success') {
          const fetchedPlans: Plan[] = response.data.response.map((plan: any) => ({
            id: plan._id,
            name: plan.name,
            price: `₹${plan.price}`,
            period: plan.period,
            description: plan.description,
            features: plan.features || [],
            popular: plan.popular || false,
          }));
          setPlans(fetchedPlans);
        } else {
          toast.error('Failed to load subscription plans');
        }
      } catch (error: any) {
        console.error('Error fetching subscription plans:', error);
        toast.error(error.message || 'Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptionPlans();
  }, []);

  const handleRazorpayCheckout = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find((p) => p.id === planId);
    alert(`Razorpay checkout would open for ${plan?.name} - ${plan?.price}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isOnline={isOnline}
      />

      <div className="md:ml-64">
        {/* Header */}
        <Header
          isOnline={isOnline}
          handleToggleOnline={handleToggleOnline}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in">
              Savor Every Bite with Your Plan
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-90">
              Choose a subscription that fits your taste and enjoy delicious meals delivered to your door.
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 font-medium">No subscription plans available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${plan.popular ? 'border-4 border-blue-400 ring-4 ring-blue-100' : 'border border-gray-200'}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 w-full bg-blue-400 text-white text-center py-2 font-semibold text-sm">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-8 pt-12">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                    <div className="mt-6 mb-8">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 ml-2 text-lg">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleRazorpayCheckout(plan.id)}
                      className={`
                        w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center
                        ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}
                        transition-all duration-200 transform hover:scale-105
                      `}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Pay with Razorpay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-4">
                <Shield className="h-10 w-10 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">Protected by Razorpay's secure gateway</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Instant Activation</h3>
                  <p className="text-gray-600 text-sm">Start your subscription instantly</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">Always here to assist you</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'How does the subscription work?',
                answer: 'After selecting a plan and completing payment via Razorpay, your subscription activates instantly, allowing you to order food through our app or website.',
              },
              {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel anytime. Refunds are processed based on the remaining subscription period per our refund policy.',
              },
              {
                question: 'Are there any hidden fees?',
                answer: 'No hidden fees. The displayed price is all-inclusive, with no additional charges.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <ChevronRight className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}