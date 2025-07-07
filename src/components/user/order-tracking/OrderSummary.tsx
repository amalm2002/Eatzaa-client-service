import { OrderSummaryProps } from "../../../interfaces/user/profile/order-tracking.types";

const OrderSummary = ({ order }: OrderSummaryProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🛒 Order Summary</h2>
            <div className="space-y-4 mb-6">
                {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <img
                                src={item.images[0] || '/api/placeholder/150/150'}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <div className="font-medium text-gray-800">{item.name}</div>
                                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                <div className="text-sm text-gray-600 flex items-center">
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full mr-1 ${item.category.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    />
                                    {item.category}
                                </div>
                            </div>
                        </div>
                        <div className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</div>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-teal-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <span>Payment Method</span>
                    <span className="text-teal-600 capitalize">{order.paymentMethod}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;