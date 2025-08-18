import { PaymentRuleModal } from "../../../components/admin/delivery-boy/payment/PaymentRuleModal";
import { HeaderSection } from "../../../components/admin/delivery-boy/payment/RidePaymentHeaderSection";
import { RulesTable } from "../../../components/admin/delivery-boy/payment/RulesTable";
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