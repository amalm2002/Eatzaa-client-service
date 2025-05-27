import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AddressSection from '../../components/user/AddressSection';
import PaymentSection from '../../components/user/PaymentSection';
import OrderSummarySection from '../../components/user/OrderSummarySection';
import Navbar from '../../components/user/Navbar';

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

const Checkout = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);
    const { state } = useLocation(); 
    const { cartItems = [], subtotal = 0, deliveryFee = 0, tax = 0, total = 0 } = state || {};

    const handleLocationSelect = (lat: number, lng: number) => {
        setLocation({ lat, lng });
    };

    const handlePlaceOrder = () => {
        if (!location) return alert('Please select a location first');
        alert(`Order placed! Latitude: ${location.lat}, Longitude: ${location.lng}`);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <AddressSection userId={userId} onLocationSelect={handleLocationSelect} />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <OrderSummarySection
                            cartItems={cartItems}
                            subtotal={subtotal}
                            deliveryFee={deliveryFee}
                            tax={tax}
                            total={total}
                        />
                        <PaymentSection />
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-sm"
                        >
                            Place Order ₹{total}
                        </button>
                        <p className="text-center text-xs text-gray-500">
                            By placing this order, you agree to our Terms & Conditions
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;