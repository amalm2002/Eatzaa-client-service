import { FiEdit2, FiLock, FiUnlock, FiTruck } from 'react-icons/fi';
import { RulesTableProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types";

export const RulesTable: React.FC<RulesTableProps> = ({
    filteredRules,
    handleEditRule,
    handleBlockRule,
    handleUnblockRule,
    handleToggleStatus }) => {
    const getVehicleIcon = (type: string) => {
        switch (type) {
            case 'bike':
                return '🏍️';
            case 'scooter':
                return '🛵';
            case 'cycle':
                return '🚲';
            default:
                return '🏍️';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Vehicle & Distance
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Rate per KM
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Last Updated
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRules.length > 0 ? (
                            filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{getVehicleIcon(rule.vehicleType)}</span>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 capitalize">
                                                    {rule.vehicleType}
                                                </div>
                                                <div className="text-sm text-gray-600">{rule.KM} KM</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-lg font-bold text-gray-600">₹{rule.ratePerKm}</div>
                                        <div className="text-xs text-gray-500">per kilometer</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(rule.id)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${rule.isActive
                                                    ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                                                }`}
                                        >
                                            {rule.isActive ? 'Active' : 'Blocked'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {rule.lastUpdated || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditRule(rule)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            {rule.isActive ? (
                                                <button
                                                    onClick={() => handleBlockRule(rule.id, rule.vehicleType)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                                    title="Block"
                                                >
                                                    <FiLock className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnblockRule(rule.id)}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                                    title="Unblock"
                                                >
                                                    <FiUnlock className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <FiTruck className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-lg">No payment rules found</p>
                                        <p className="text-sm">Create your first payment rule to get started</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

