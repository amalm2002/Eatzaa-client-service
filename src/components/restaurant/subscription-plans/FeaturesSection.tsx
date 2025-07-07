import React from 'react';
import { Shield, Zap, Users, Clock } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Bank-Grade Security',
      desc: 'Your data is protected with enterprise-level encryption',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Instant Activation',
      desc: 'Start using all features immediately after payment',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: '24/7 Expert Support',
      desc: 'Get help from our dedicated restaurant specialists',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: 'Flexible Plans',
      desc: 'Change or cancel your subscription anytime',
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of restaurants already growing their business with our comprehensive platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;