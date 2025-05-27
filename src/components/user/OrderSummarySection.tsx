import { CartItemType } from "../../pages/User/userCart";

interface OrderSummarySectionProps {
    cartItems: CartItemType[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
    cartItems,
    subtotal,
    deliveryFee,
    tax,
    total,
}) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h3>
            <ul className="space-y-2">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <li key={item.id} className="flex justify-between text-gray-700 text-sm">
                            <span>
                                {item.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                            </span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-700 text-sm">No items in cart</li>
                )}
                <li className="flex justify-between text-gray-700 pt-2 border-t border-gray-200 text-sm">
                    <span>Item Total</span>
                    <span className="font-medium">₹{subtotal}</span>
                </li>
                <li className="flex justify-between text-gray-700 text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-medium">₹{deliveryFee}</span>
                </li>
                <li className="flex justify-between text-gray-700 text-sm">
                    <span>Taxes & Charges</span>
                    <span className="font-medium">₹{tax}</span>
                </li>
                <li className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200 text-sm">
                    <span>Total</span>
                    <span>₹{total}</span>
                </li>
            </ul>
        </div>
    );
};

export default OrderSummarySection;