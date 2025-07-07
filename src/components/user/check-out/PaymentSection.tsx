import { useState } from 'react';
import { PaymentSectionProps } from '../../../interfaces/user/checkOut/payment-section.types';

const PaymentSection: React.FC<PaymentSectionProps> = ({ onPaymentSelect }) => {
    const [paymentMethod, setPaymentMethod] = useState<string>('cod');

    const handlePaymentChange = (method: string) => {
        setPaymentMethod(method);
        onPaymentSelect(method);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Method</h3>
            <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => handlePaymentChange('upi')}
                        className="h-4 w-4 text-teal-500 focus:ring-teal-500"
                    />
                    <span>📱</span>
                    <span className="text-gray-700 text-sm">UPI</span>
                </label>
                <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => handlePaymentChange('cod')}
                        className="h-4 w-4 text-teal-500 focus:ring-teal-500"
                    />
                    <span>💰</span>
                    <span className="text-gray-700 text-sm">Cash on Delivery</span>
                </label>
            </div>
        </div>
    );
};

export default PaymentSection;