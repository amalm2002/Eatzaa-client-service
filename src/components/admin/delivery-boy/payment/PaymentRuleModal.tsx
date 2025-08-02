import { FiDollarSign, FiSave, FiX, } from 'react-icons/fi';
import { ModalProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-payment.types';


export const PaymentRuleModal: React.FC<ModalProps> = ({
    isOpen,
    editingRule,
    formData,
    errors,
    setFormData,
    setEditingRule,
    setIsModalOpen,
    handleSaveRule,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <FiDollarSign className="w-6 h-6 text-gray-600 mr-2" />
                            {editingRule ? 'Edit Payment Rule' : 'Add Payment Rule'}
                        </h2>
                        <button
                            onClick={() => {
                                setFormData({
                                    KM: 0,
                                    ratePerKm: 0,
                                    vehicleType: 'bike',
                                    isActive: true,
                                });
                                setEditingRule(null);
                                setIsModalOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kilometer
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={formData.KM}
                            onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue = value === '' ? 0 : parseInt(value, 10);
                                if (!isNaN(parsedValue)) {
                                    setFormData({ ...formData, KM: parsedValue });
                                }
                            }}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent border-gray-300"
                            placeholder="0"
                        />
                        {errors.KM && <p className="text-red-500 text-xs mt-1">{errors.KM}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rate per KM (₹)
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={formData.ratePerKm}
                            onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue = value === '' ? 0 : parseInt(value, 10);
                                if (!isNaN(parsedValue)) {
                                    setFormData({ ...formData, ratePerKm: parsedValue });
                                }
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                                errors.ratePerKm ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="5"
                        />
                        {errors.ratePerKm && <p className="text-red-500 text-xs mt-1">{errors.ratePerKm}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type
                        </label>
                        <select
                            value={formData.vehicleType}
                            onChange={(e) =>
                                setFormData({ ...formData, vehicleType: e.target.value as 'bike' | 'scooter' | 'cycle' })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        >
                            <option value="bike">🏍️ Bike</option>
                            <option value="scooter">🛵 Scooter</option>
                            <option value="cycle">🚲 Bicycle</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active Rule</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    KM: 0,
                                    ratePerKm: 0,
                                    vehicleType: 'bike',
                                    isActive: true,
                                });
                                setEditingRule(null);
                                setIsModalOpen(false);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveRule}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all flex items-center justify-center"
                        >
                            <FiSave className="w-4 h-4 mr-2" />
                            {editingRule ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};