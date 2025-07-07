import React from 'react';

const HeaderSection: React.FC = () => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of your restaurant with our comprehensive subscription plans
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;