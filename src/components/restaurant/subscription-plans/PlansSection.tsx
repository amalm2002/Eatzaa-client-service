import React from 'react';
import { Check, ShoppingBag, Star, Crown, Award, Sparkles } from 'lucide-react';
import { PlansSectionProps } from '../../../interfaces/restaurant/subscription/plan.types';

const PlansSection: React.FC<PlansSectionProps> = ({
  plans,
  loading,
  selectedPlan,
  handleRazorpayCheckout,
}) => {
  const getPlanIcon = (index: number) => {
    const icons = [
      <Crown className="h-6 w-6" />,
      <Award className="h-6 w-6" />,
      <Sparkles className="h-6 w-6" />,
    ];
    return icons[index % icons.length];
  };

  const getPlanGradient = (index: number, isPopular: boolean) => {
    if (isPopular) {
      return 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700';
    }
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-cyan-600',
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Plans</h3>
          <p className="text-gray-500">Please wait while we fetch the latest subscription options...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Available</h3>
          <p className="text-gray-500">Please check back later for available subscription plans.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={plan.id} className="relative group">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span>RECOMMENDED</span>
                  </div>
                </div>
              )}
              <div
                className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 ${
                  plan.popular ? 'ring-4 ring-purple-200 scale-105' : ''
                }`}
              >
                <div className={`${getPlanGradient(index, plan.popular)} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      {getPlanIcon(index)}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-6 min-h-[40px]">{plan.description}</p>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-black">{plan.price}</span>
                      <span className="text-white/80 ml-2 text-lg">/{plan.period}</span>
                    </div>
                    <div className="text-white/80 text-sm">Billed {plan.period}ly</div>
                  </div>
                </div>
                <div className="bg-white p-8">
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-green-600 font-bold" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleRazorpayCheckout(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : `${getPlanGradient(index, false)} text-white hover:shadow-xl`
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Get Started</span>
                  </button>
                  {plan.popular && (
                    <div className="text-center mt-4">
                      <span className="text-sm text-purple-600 font-semibold">⚡ Most popular choice</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansSection;