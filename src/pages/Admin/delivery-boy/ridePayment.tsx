// import React, { useState, useEffect, useMemo } from 'react';
// import { FiPlus, FiEdit2, FiLock, FiUnlock, FiDollarSign, FiTruck, FiMapPin, FiSave, FiX, FiCheck } from 'react-icons/fi';
// import { adminApi } from '../../../api/endpoints/adminApi';
// import { useDispatch } from 'react-redux';
// import { toast } from 'sonner';

import { PaymentRuleModal } from "../../../components/admin/delivery-boy/payment/PaymentRuleModal";
import { HeaderSection } from "../../../components/admin/delivery-boy/payment/RidePaymentHeaderSection";
import { RulesTable } from "../../../components/admin/delivery-boy/payment/RulesTable";

// interface RidePaymentRule {
//     id: string;
//     KM: number;
//     ratePerKm: number;
//     vehicleType: 'bike' | 'scooter' | 'cycle';
//     isActive: boolean;
//     lastUpdated?: string;
// }

// const RidePaymentManagement: React.FC = () => {
//     const [paymentRules, setPaymentRules] = useState<RidePaymentRule[]>([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingRule, setEditingRule] = useState<RidePaymentRule | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterVehicle, setFilterVehicle] = useState<string>('all');
//     const [filterStatus, setFilterStatus] = useState<string>('all');
//     const [formData, setFormData] = useState<{
//         KM: number;
//         ratePerKm: number;
//         vehicleType: 'bike' | 'scooter' | 'cycle';
//         isActive: boolean;
//     }>({
//         KM: 0,
//         ratePerKm: 0,
//         vehicleType: 'bike',
//         isActive: true,
//     });
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const fetchRules = async () => {
//             try {
//                 const response = await adminApi.getRidePaymentRules(dispatch);                
//                 if (response.data.success) {
//                     setPaymentRules(
//                         response.data.data.map((rule: any) => ({
//                             id: rule._id,
//                             KM: rule.minKm,
//                             ratePerKm: rule.ratePerKm,
//                             vehicleType: rule.vehicleType,
//                             isActive: rule.isActive,
//                             lastUpdated: rule.updatedAt ? new Date(rule.updatedAt).toISOString().split('T')[0] : undefined,
//                         }))
//                     );
//                 } else {
//                     toast.error(response.data.message || 'Failed to fetch payment rules');
//                 }
//             } catch (error) {
//                 console.error('Error fetching rules:', error);
//                 toast.error('Failed to load payment rules.');
//             }
//         };
//         fetchRules();
//     }, [dispatch]);

//     useEffect(() => {
//         console.log('Component rendered', { paymentRules, isModalOpen, formData, searchTerm, filterVehicle, filterStatus });
//     }, [paymentRules, isModalOpen, formData, searchTerm, filterVehicle, filterStatus]);

//     const validateForm = () => {
//         const newErrors: { [key: string]: string } = {};
//         if (formData.KM <= 0) newErrors.KM = 'Kilometer must be greater than 0';
//         if (formData.ratePerKm <= 0) newErrors.ratePerKm = 'Rate per KM must be positive';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleAddRule = () => {
//         setEditingRule(null);
//         setFormData({
//             KM: 0,
//             ratePerKm: 0,
//             vehicleType: 'bike',
//             isActive: true,
//         });
//         setErrors({});
//         setIsModalOpen(true);
//     };

//     const handleEditRule = (rule: RidePaymentRule) => {
//         setEditingRule(rule);
//         setFormData({
//             KM: rule.KM,
//             ratePerKm: rule.ratePerKm,
//             vehicleType: rule.vehicleType,
//             isActive: rule.isActive,
//         });
//         setErrors({});
//         setIsModalOpen(true);
//     };

//     const handleSaveRule = async () => {
//         if (!validateForm()) return;

//         const payload = {
//             KM: Number(formData.KM),
//             ratePerKm: Number(formData.ratePerKm),
//             vehicleType: formData.vehicleType,
//             isActive: formData.isActive,
//         };

//         try {
//             let response;
//             if (editingRule) {
//                 response = await adminApi.updateRidePayment(dispatch, { id: editingRule.id, ...payload });
//                 if (response.data.success) {
//                     setPaymentRules(rules =>
//                         rules.map(rule =>
//                             rule.id === editingRule.id
//                                 ? { ...rule, ...payload, lastUpdated: new Date().toISOString().split('T')[0] }
//                                 : rule
//                         )
//                     );
//                     toast.success('Payment rule updated successfully');
//                 } else {
//                     console.error('Update API error:', response.data.message);
//                     toast.error(response.data.message || 'Failed to update payment rule');
//                     return;
//                 }
//             } else {
//                 response = await adminApi.addRidePayment(dispatch, payload);

//                 if (response.data.success) {
//                     const newRule: RidePaymentRule = {
//                         id: response.data.data?._id || Date.now().toString(),
//                         KM: response.data.data?.minKm || payload.KM,
//                         ratePerKm: response.data.data?.ratePerKm || payload.ratePerKm,
//                         vehicleType: response.data.data?.vehicleType || payload.vehicleType,
//                         isActive: response.data.data?.isActive ?? payload.isActive,
//                         lastUpdated: new Date().toISOString().split('T')[0],
//                     };
//                     setPaymentRules(rules => [...rules, newRule]);
//                     toast.success('Payment rule created successfully');
//                 } else {
//                     console.error('Add API error:', response.data.message);
//                     toast.error(response.data.message || 'Failed to create payment rule');
//                     return;
//                 }
//             }

//             setFormData({
//                 KM: 0,
//                 ratePerKm: 0,
//                 vehicleType: 'bike',
//                 isActive: true,
//             });
//             setEditingRule(null);
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error('Error saving rule:', error);
//             toast.error('An error occurred while saving the rule.');
//         }
//     };

//     const handleBlockRule = async (id: string, vehicleType: string) => {
//         if (window.confirm('Are you sure you want to block this payment rule?')) {
//             try {
//                 const response = await adminApi.blockRidePayment(dispatch, { id, vehicleType });
//                 if (response.data.success) {
//                     setPaymentRules(rules =>
//                         rules.map(rule =>
//                             rule.id === id
//                                 ? { ...rule, isActive: false, lastUpdated: new Date().toISOString().split('T')[0] }
//                                 : rule
//                         )
//                     );
//                     toast.success('Payment rule blocked successfully');
//                 } else {
//                     console.error('Block API error:', response.data.message);
//                     toast.error(response.data.message || 'Failed to block payment rule');
//                 }
//             } catch (error) {
//                 console.error('Error blocking rule:', error);
//                 toast.error('An error occurred while blocking the rule.');
//             }
//         }
//     };

//     const handleUnblockRule = async (id: string) => {
//         if (window.confirm('Are you sure you want to unblock this payment rule?')) {
//             try {
//                 const response = await adminApi.unblockRidePayment(dispatch, { id });
//                 if (response.data.success) {
//                     setPaymentRules(rules =>
//                         rules.map(rule =>
//                             rule.id === id
//                                 ? { ...rule, isActive: true, lastUpdated: new Date().toISOString().split('T')[0] }
//                                 : rule
//                         )
//                     );
//                     toast.success('Payment rule unblocked successfully');
//                 } else {
//                     console.error('Unblock API error:', response.data.message);
//                     toast.error(response.data.message || 'Failed to unblock payment rule');
//                 }
//             } catch (error) {
//                 console.error('Error unblocking rule:', error);
//                 toast.error('An error occurred while unblocking the rule.');
//             }
//         }
//     };

//     const handleToggleStatus = (id: string) => {
//         setPaymentRules(rules =>
//             rules.map(rule =>
//                 rule.id === id
//                     ? { ...rule, isActive: !rule.isActive, lastUpdated: new Date().toISOString().split('T')[0] }
//                     : rule
//             )
//         );
//         toast.success('Payment rule status updated');
//     };

//     const getVehicleIcon = (type: string) => {
//         switch (type) {
//             case 'bike':
//                 return '🏍️';
//             case 'scooter':
//                 return '🛵';
//             case 'cycle':
//                 return '🚲';
//             default:
//                 return '🏍️';
//         }
//     };

//     const filteredRules = useMemo(() => {
//         return paymentRules.filter(rule => {
//             const matchesSearch = rule.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 rule.ratePerKm.toString().includes(searchTerm);
//             const matchesVehicle = filterVehicle === 'all' || rule.vehicleType === filterVehicle;
//             const matchesStatus = filterStatus === 'all' ||
//                 (filterStatus === 'active' && rule.isActive) ||
//                 (filterStatus === 'blocked' && !rule.isActive);
//             return matchesSearch && matchesVehicle && matchesStatus;
//         });
//     }, [paymentRules, searchTerm, filterVehicle, filterStatus]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 flex flex-col">
//             <div className="bg-white shadow-sm border-b border-gray-100"></div>

//             <main className="max-w-[90rem] mx-auto p-4 sm:p-6 space-y-6">
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">Total Rules</p>
//                                 <p className="text-2xl font-bold text-gray-900">{paymentRules.length}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                                 <FiMapPin className="w-6 h-6 text-blue-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">Active Rules</p>
//                                 <p className="text-2xl font-bold text-green-600">{paymentRules.filter(r => r.isActive).length}</p>
//                             </div>
//                             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                                 <FiCheck className="w-6 h-6 text-green-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600">Avg Rate/KM</p>
//                                 <p className="text-2xl font-bold text-orange-600">
//                                     ₹{paymentRules.length > 0 ? (paymentRules.reduce((sum, rule) => sum + rule.ratePerKm, 0) / paymentRules.length).toFixed(1) : '0'}
//                                 </p>
//                             </div>
//                             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
//                                 <FiDollarSign className="w-6 h-6 text-orange-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
//                                 <FiTruck className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="ml-3">
//                                 <h1 className="text-2xl font-bold text-gray-900">Ride Payment Management</h1>
//                                 <p className="text-sm text-gray-600">Configure delivery partner earnings based on distance</p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={handleAddRule}
//                             className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center shadow-sm"
//                         >
//                             <FiPlus className="w-4 h-4 mr-2" />
//                             Add Payment Rule
//                         </button>
//                     </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1">
//                             <input
//                                 type="text"
//                                 placeholder="Search by vehicle type or rate..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div className="flex gap-2">
//                             <select
//                                 value={filterVehicle}
//                                 onChange={(e) => setFilterVehicle(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             >
//                                 <option value="all">All Vehicles</option>
//                                 <option value="bike">Bike</option>
//                                 <option value="scooter">Scooter</option>
//                                 <option value="cycle">Bicycle</option>
//                             </select>
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             >
//                                 <option value="all">All Status</option>
//                                 <option value="active">Active</option>
//                                 <option value="blocked">Blocked</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Payment Rules Table */}
//                 <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-100">
//                             <thead className="bg-gradient-to-r from-orange-50 to-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                         Vehicle & Distance
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                         Rate per KM
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                         Last Updated
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {filteredRules.length > 0 ? (
//                                     filteredRules.map((rule) => (
//                                         <tr key={rule.id} className="hover:bg-orange-50/50 transition-colors">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <span className="text-2xl mr-3">{getVehicleIcon(rule.vehicleType)}</span>
//                                                     <div>
//                                                         <div className="text-sm font-semibold text-gray-900 capitalize">
//                                                             {rule.vehicleType}
//                                                         </div>
//                                                         <div className="text-sm text-gray-600">{rule.KM} KM</div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-lg font-bold text-orange-600">₹{rule.ratePerKm}</div>
//                                                 <div className="text-xs text-gray-500">per kilometer</div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <button
//                                                     onClick={() => handleToggleStatus(rule.id)}
//                                                     className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
//                                                         rule.isActive
//                                                             ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
//                                                             : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
//                                                     }`}
//                                                 >
//                                                     {rule.isActive ? 'Active' : 'Blocked'}
//                                                 </button>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                                 {rule.lastUpdated || '-'}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center space-x-2">
//                                                     <button
//                                                         onClick={() => handleEditRule(rule)}
//                                                         className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
//                                                         title="Edit"
//                                                     >
//                                                         <FiEdit2 className="w-4 h-4" />
//                                                     </button>
//                                                     {rule.isActive ? (
//                                                         <button
//                                                             onClick={() => handleBlockRule(rule.id, rule.vehicleType)}
//                                                             className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
//                                                             title="Block"
//                                                         >
//                                                             <FiLock className="w-4 h-4" />
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             onClick={() => handleUnblockRule(rule.id)}
//                                                             className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
//                                                             title="Unblock"
//                                                         >
//                                                             <FiUnlock className="w-4 h-4" />
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
//                                             <div className="flex flex-col items-center">
//                                                 <FiTruck className="w-12 h-12 text-gray-300 mb-3" />
//                                                 <p className="text-lg">No payment rules found</p>
//                                                 <p className="text-sm">Create your first payment rule to get started</p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </main>

//             {/* Add/Edit Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//                         <div className="p-6 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <h2 className="text-xl font-bold text-gray-900 flex items-center">
//                                     <FiDollarSign className="w-6 h-6 text-orange-500 mr-2" />
//                                     {editingRule ? 'Edit Payment Rule' : 'Add Payment Rule'}
//                                 </h2>
//                                 <button
//                                     onClick={() => {
//                                         setFormData({
//                                             KM: 0,
//                                             ratePerKm: 0,
//                                             vehicleType: 'bike',
//                                             isActive: true,
//                                         });
//                                         setEditingRule(null);
//                                         setIsModalOpen(false);
//                                     }}
//                                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                                 >
//                                     <FiX className="w-5 h-5 text-gray-500" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="p-6 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Kilometer
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="1"
//                                     value={formData.KM}
//                                     onChange={(e) => {
//                                         const value = e.target.value;
//                                         console.log('KM input:', value, 'Parsed:', parseInt(value, 10));
//                                         const parsedValue = value === '' ? 0 : parseInt(value, 10);
//                                         if (!isNaN(parsedValue)) {
//                                             setFormData({ ...formData, KM: parsedValue });
//                                         }
//                                     }}
//                                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300"
//                                     placeholder="0"
//                                 />
//                                 {errors.KM && <p className="text-red-500 text-xs mt-1">{errors.KM}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Rate per KM (₹)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="1"
//                                     value={formData.ratePerKm}
//                                     onChange={(e) => {
//                                         const value = e.target.value;
//                                         console.log('Rate input:', value, 'Parsed:', parseInt(value, 10));
//                                         const parsedValue = value === '' ? 0 : parseInt(value, 10);
//                                         if (!isNaN(parsedValue)) {
//                                             setFormData({ ...formData, ratePerKm: parsedValue });
//                                         }
//                                     }}
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
//                                         errors.ratePerKm ? 'border-red-300' : 'border-gray-300'
//                                     }`}
//                                     placeholder="5"
//                                 />
//                                 {errors.ratePerKm && <p className="text-red-500 text-xs mt-1">{errors.ratePerKm}</p>}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Vehicle Type
//                                 </label>
//                                 <select
//                                     value={formData.vehicleType}
//                                     onChange={(e) =>
//                                         setFormData({ ...formData, vehicleType: e.target.value as 'bike' | 'scooter' | 'cycle' })
//                                     }
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                 >
//                                     <option value="bike">🏍️ Bike</option>
//                                     <option value="scooter">🛵 Scooter</option>
//                                     <option value="cycle">🚲 Bicycle</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         checked={formData.isActive}
//                                         onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                                         className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//                                     />
//                                     <span className="ml-2 text-sm text-gray-700">Active Rule</span>
//                                 </label>
//                             </div>

//                             <div className="flex gap-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setFormData({
//                                             KM: 0,
//                                             ratePerKm: 0,
//                                             vehicleType: 'bike',
//                                             isActive: true,
//                                         });
//                                         setEditingRule(null);
//                                         setIsModalOpen(false);
//                                     }}
//                                     className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleSaveRule}
//                                     className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center"
//                                 >
//                                     <FiSave className="w-4 h-4 mr-2" />
//                                     {editingRule ? 'Update' : 'Create'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RidePaymentManagement;







import React, { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../../api/endpoints/adminApi';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { RidePaymentRule } from "../../../interfaces/admin/delivery-boys/delivery-boy-payment.types";


const RidePaymentManagement: React.FC = () => {
    const [paymentRules, setPaymentRules] = useState<RidePaymentRule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RidePaymentRule | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterVehicle, setFilterVehicle] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [formData, setFormData] = useState<{
        KM: number;
        ratePerKm: number;
        vehicleType: 'bike' | 'scooter' | 'cycle';
        isActive: boolean;
    }>({
        KM: 0,
        ratePerKm: 0,
        vehicleType: 'bike',
        isActive: true,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await adminApi.getRidePaymentRules(dispatch);
                if (response.data.success) {
                    setPaymentRules(
                        response.data.data.map((rule: any) => ({
                            id: rule._id,
                            KM: rule.minKm,
                            ratePerKm: rule.ratePerKm,
                            vehicleType: rule.vehicleType,
                            isActive: rule.isActive,
                            lastUpdated: rule.updatedAt ? new Date(rule.updatedAt).toISOString().split('T')[0] : undefined,
                        }))
                    );
                } else {
                    toast.error(response.data.message || 'Failed to fetch payment rules');
                }
            } catch (error) {
                console.error('Error fetching rules:', error);
                toast.error('Failed to load payment rules.');
            }
        };
        fetchRules();
    }, [dispatch]);

    useEffect(() => {
        console.log('Component rendered', { paymentRules, isModalOpen, formData, searchTerm, filterVehicle, filterStatus });
    }, [paymentRules, isModalOpen, formData, searchTerm, filterVehicle, filterStatus]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (formData.KM <= 0) newErrors.KM = 'Kilometer must be greater than 0';
        if (formData.ratePerKm <= 0) newErrors.ratePerKm = 'Rate per KM must be positive';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddRule = () => {
        setEditingRule(null);
        setFormData({
            KM: 0,
            ratePerKm: 0,
            vehicleType: 'bike',
            isActive: true,
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEditRule = (rule: RidePaymentRule) => {
        setEditingRule(rule);
        setFormData({
            KM: rule.KM,
            ratePerKm: rule.ratePerKm,
            vehicleType: rule.vehicleType,
            isActive: rule.isActive,
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSaveRule = async () => {
        if (!validateForm()) return;

        const payload = {
            KM: Number(formData.KM),
            ratePerKm: Number(formData.ratePerKm),
            vehicleType: formData.vehicleType,
            isActive: formData.isActive,
        };

        try {
            let response;
            if (editingRule) {
                response = await adminApi.updateRidePayment(dispatch, { id: editingRule.id, ...payload });
                if (response.data.success) {
                    setPaymentRules(rules =>
                        rules.map(rule =>
                            rule.id === editingRule.id
                                ? { ...rule, ...payload, lastUpdated: new Date().toISOString().split('T')[0] }
                                : rule
                        )
                    );
                    toast.success('Payment rule updated successfully');
                } else {
                    console.error('Update API error:', response.data.message);
                    toast.error(response.data.message || 'Failed to update payment rule');
                    return;
                }
            } else {
                response = await adminApi.addRidePayment(dispatch, payload);

                if (response.data.success) {
                    const newRule: RidePaymentRule = {
                        id: response.data.data?._id || Date.now().toString(),
                        KM: response.data.data?.minKm || payload.KM,
                        ratePerKm: response.data.data?.ratePerKm || payload.ratePerKm,
                        vehicleType: response.data.data?.vehicleType || payload.vehicleType,
                        isActive: response.data.data?.isActive ?? payload.isActive,
                        lastUpdated: new Date().toISOString().split('T')[0],
                    };
                    setPaymentRules(rules => [...rules, newRule]);
                    toast.success('Payment rule created successfully');
                } else {
                    console.error('Add API error:', response.data.message);
                    toast.error(response.data.message || 'Failed to create payment rule');
                    return;
                }
            }

            setFormData({
                KM: 0,
                ratePerKm: 0,
                vehicleType: 'bike',
                isActive: true,
            });
            setEditingRule(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving rule:', error);
            toast.error('An error occurred while saving the rule.');
        }
    };

    const handleBlockRule = async (id: string, vehicleType: string) => {
        if (window.confirm('Are you sure you want to block this payment rule?')) {
            try {
                const response = await adminApi.blockRidePayment(dispatch, { id, vehicleType });
                if (response.data.success) {
                    setPaymentRules(rules =>
                        rules.map(rule =>
                            rule.id === id
                                ? { ...rule, isActive: false, lastUpdated: new Date().toISOString().split('T')[0] }
                                : rule
                        )
                    );
                    toast.success('Payment rule blocked successfully');
                } else {
                    console.error('Block API error:', response.data.message);
                    toast.error(response.data.message || 'Failed to block payment rule');
                }
            } catch (error) {
                console.error('Error blocking rule:', error);
                toast.error('An error occurred while blocking the rule.');
            }
        }
    };

    const handleUnblockRule = async (id: string) => {
        if (window.confirm('Are you sure you want to unblock this payment rule?')) {
            try {
                const response = await adminApi.unblockRidePayment(dispatch, { id });
                if (response.data.success) {
                    setPaymentRules(rules =>
                        rules.map(rule =>
                            rule.id === id
                                ? { ...rule, isActive: true, lastUpdated: new Date().toISOString().split('T')[0] }
                                : rule
                        )
                    );
                    toast.success('Payment rule unblocked successfully');
                } else {
                    console.error('Unblock API error:', response.data.message);
                    toast.error(response.data.message || 'Failed to unblock payment rule');
                }
            } catch (error) {
                console.error('Error unblocking rule:', error);
                toast.error('An error occurred while unblocking the rule.');
            }
        }
    };

    const handleToggleStatus = (id: string) => {
        setPaymentRules(rules =>
            rules.map(rule =>
                rule.id === id
                    ? { ...rule, isActive: !rule.isActive, lastUpdated: new Date().toISOString().split('T')[0] }
                    : rule
            )
        );
        toast.success('Payment rule status updated');
    };

    const filteredRules = useMemo(() => {
        return paymentRules.filter(rule => {
            const matchesSearch = rule.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.ratePerKm.toString().includes(searchTerm);
            const matchesVehicle = filterVehicle === 'all' || rule.vehicleType === filterVehicle;
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && rule.isActive) ||
                (filterStatus === 'blocked' && !rule.isActive);
            return matchesSearch && matchesVehicle && matchesStatus;
        });
    }, [paymentRules, searchTerm, filterVehicle, filterStatus]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <main className="max-w-[100rem] mx-auto p-4 sm:p-6 space-y-6 w-full">
                <HeaderSection paymentRules={paymentRules} handleAddRule={handleAddRule} />
                <RulesTable
                    filteredRules={filteredRules}
                    handleEditRule={handleEditRule}
                    handleBlockRule={handleBlockRule}
                    handleUnblockRule={handleUnblockRule}
                    handleToggleStatus={handleToggleStatus}
                />
                <PaymentRuleModal
                    isOpen={isModalOpen}
                    editingRule={editingRule}
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    setEditingRule={setEditingRule}
                    setIsModalOpen={setIsModalOpen}
                    handleSaveRule={handleSaveRule}
                />
            </main>
        </div>
    );
};

export default RidePaymentManagement;