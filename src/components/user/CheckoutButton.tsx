import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface CartItemType {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    restaurant: string;
    isVeg: boolean;
    maxAvailableQty: number;
}

interface CheckoutButtonProps {
    total: number;
    itemCount: number;
    cartItems: CartItemType[];
    subtotal: number; 
    deliveryFee: number; 
    tax: number; 
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ total, itemCount, cartItems, subtotal, deliveryFee, tax }) => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        console.log('Proceeding to checkout with total:', total, itemCount, cartItems);
        navigate('/user-check-out-page', {
            state: {
                cartItems,
                subtotal,
                deliveryFee,
                tax,
                total,
            },
        });
    };

    return (
        <div className="space-y-3">
            {/* Delivery Info */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm font-medium text-teal-800">Delivering to Home</span>
                </div>
                <p className="text-xs text-teal-600 ml-4">
                    123 Main Street, City Center • 25-30 mins
                </p>
            </div>

            {/* Checkout Button */}
            <button
                onClick={handleCheckout}
                className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg flex items-center justify-between"
            >
                <span>Proceed to Pay</span>
                <div className="text-right leading-tight">
                    <div className="text-white">₹{total}</div>
                    <div className="text-teal-200 text-xs">{itemCount} items</div>
                </div>
            </button>

            {/* Payment Methods Preview */}
            <div className="flex justify-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>💳</span>
                    <span>Card</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>📱</span>
                    <span>UPI</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>💰</span>
                    <span>Wallet</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutButton;