import { FiPlus, FiDollarSign, FiTruck, FiMapPin, FiCheck } from 'react-icons/fi';
import { HeaderSectionProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types";

export const HeaderSection: React.FC<HeaderSectionProps> = ({ paymentRules, handleAddRule }) => {
    return (
        <div className="space-y-4 pt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Rules</p>
                            <p className="text-2xl font-bold text-gray-900">{paymentRules.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiMapPin className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Rules</p>
                            <p className="text-2xl font-bold text-gray-600">{paymentRules.filter(r => r.isActive).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiCheck className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg Rate/KM</p>
                            <p className="text-2xl font-bold text-gray-600">
                                ₹{paymentRules.length > 0 ? (paymentRules.reduce((sum, rule) => sum + rule.ratePerKm, 0) / paymentRules.length).toFixed(1) : '0'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiDollarSign className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full">
                <div className="md:col-span-3 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            <FiTruck className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-2xl font-bold text-gray-900">Ride Payment Management</h1>
                            <p className="text-sm text-gray-600">Configure delivery partner earnings based on distance</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddRule}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all flex items-center shadow-sm"
                    >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Add Payment Rule
                    </button>
                </div>
            </div>
        </div>
    );
};