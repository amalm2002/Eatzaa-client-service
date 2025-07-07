import { DollarSign, Package, Clock } from 'lucide-react';
import { StatsCardsProps } from '../../../interfaces/delivery-boy/dashboard/stats-cards.types';

const StatsCards = ({ partnerData }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Today's Earnings</h3>
                    <DollarSign size={20} className="text-orange-600" />
                </div>
                <p className="text-2xl font-bold">₹{partnerData.earnings.today}</p>
            </div>

            <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Orders Completed</h3>
                    <Package size={20} className="text-orange-600" />
                </div>
                <p className="text-2xl font-bold">{partnerData.ordersCompleted}</p>
            </div>

            <div className="bg-orange-100 rounded-lg shadow-sm p-4 text-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Online Hours</h3>
                    <Clock size={20} className="text-orange-600" />
                </div>
                <p className="text-2xl font-bold">{partnerData.loginHours}</p>
            </div>
        </div>
    );
};

export default StatsCards;