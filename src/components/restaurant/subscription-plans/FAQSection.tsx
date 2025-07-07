import React from 'react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'How does the subscription activation work?',
      answer:
        'Once you complete the payment through our secure Razorpay gateway, your subscription activates instantly. You\'ll get immediate access to all premium features and can start using the platform right away.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer:
        'Yes, you can change your subscription plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle.',
    },
    {
      question: 'What happens if I cancel my subscription?',
      answer:
        'You can cancel anytime without penalties. Your subscription will remain active until the end of your current billing period, and you\'ll retain access to all features until then.',
    },
    {
      question: 'Are there any setup fees or hidden charges?',
      answer:
        'No hidden fees whatsoever. The price displayed is exactly what you pay. We believe in transparent pricing with no surprises or additional charges.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and digital wallets for your convenience.',
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about our subscription plans</p>
        </div>
        <div className="grid gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed pl-6">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;