import { DeliveryPartnerCardProps } from '../../../interfaces/user/profile/order-tracking.types';
import { Phone, MessageCircle, Star } from 'lucide-react';

const DeliveryPartnerCard = ({ order }: DeliveryPartnerCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">🏍️ Your Delivery Partner</h2>
            {order.currentStatus !== 'pending' && order.currentStatus !== 'cancelled' && order.deliveryBoy ? (
                <div>
                    <div className="text-center mb-6">
                        <img
                            src={order.deliveryBoy.profileImage}
                            alt={order.deliveryBoy.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-4 border-teal-100"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{order.deliveryBoy.name}</h3>
                        <div className="flex items-center justify-center mt-2">
                            <Star className="text-yellow-500 fill-current" size={16} />
                            <span className="ml-1 text-gray-600">{order.deliveryBoy.rating || 'N/A'}</span>
                            <span className="ml-2 text-sm text-gray-500">({order.deliveryBoy.totalDeliveries || 0} deliveries)</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-3">
                            <button className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center">
                                <Phone size={16} className="mr-2" />
                                Call
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                                <MessageCircle size={16} className="mr-2" />
                                Chat
                            </button>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Contact Number</div>
                            <div className="font-mono text-gray-800 font-semibold">{order.deliveryBoy.mobile}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600">No delivery partner assigned yet.</div>
            )}
        </div>
    );
};

export default DeliveryPartnerCard;