import { ChevronRight } from 'lucide-react';
import { WeeklySummaryProps } from '../../../interfaces/delivery-boy/dashboard/weekly-summary.types';

const WeeklySummary = ({ partnerData }: WeeklySummaryProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Weekly Summary</h3>
                <a href="#" className="text-orange-600 text-sm flex items-center hover:text-orange-700">
                    View All <ChevronRight size={16} />
                </a>
            </div>

            <div className="flex items-center mb-4 p-3 bg-orange-100 text-gray-800 rounded-lg">
                <div>
                    <p className="text-3xl font-bold">₹{partnerData.earnings.week}</p>
                    <p className="text-sm">This Week's Earnings</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklySummary;