import React from 'react';
import { PricingSummaryProps } from '../../../interfaces/user/cart/pricing-summary.types';

const PricingSummary: React.FC<PricingSummaryProps> = ({
  subtotal,
  deliveryFee,
  tax,
  total
}) => {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Bill Details</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Item Total</span>
          <span className="text-gray-800">₹{subtotal}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="text-gray-800">₹{deliveryFee}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes & Charges</span>
          <span className="text-gray-800">₹{tax}</span>
        </div>
        
        <div className="border-t border-gray-300 pt-2 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-800">Total</span>
            <span className="text-teal-600">₹{total}</span>
          </div>
        </div>
      </div>
      
      {/* Savings Badge */}
      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-green-700 font-medium">
          🎉 You saved ₹25 on this order
        </p>
      </div>
    </div>
  );
};

export default PricingSummary;