export interface DeliveryBoy {
    id: string;
    name: string;
    phone: string;
    joinDate: string;
    weeklyEarnings: number;
    inHandCash: number;
    totalCash: number;
    ordersCompleted: number;
    lastPaymentDate: string;
    nextPaymentDate: string;
    status: 'pending' | 'paid' | 'overdue';
    completeAmount: number;
    amountToPayDeliveryBoy: number;
    monthlyEarnings: {
        month: string;
        amount: number;
        orders: number;
        status: 'pending' | 'paid';
    }[];
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    deliveryBoyId: string;
    paymentId: string;
    data: {
        completeAmount: number;
        monthlyAmount: number;
        inHandCash: number;
        earnings: Array<{
            date: string;
            amount: number;
            paymentId: string;
        }>;
    };
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-gray-200 text-gray-800 border border-gray-300';
        case 'pending':
            return 'bg-gray-100 text-gray-700 border border-gray-200';
        case 'overdue':
            return 'bg-gray-300 text-gray-900 border border-gray-400';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const isPayButtonEnabled = (nextPaymentDate: string) => {
    const now = new Date();
    const nextPaidAt = new Date(nextPaymentDate);
    return now >= nextPaidAt;
};

export const isAlreadyPaid = (deliveryBoy: DeliveryBoy) => {
    return (
        deliveryBoy.amountToPayDeliveryBoy === 0 &&
        deliveryBoy.inHandCash === 0 &&
        deliveryBoy.completeAmount === 0 &&
        deliveryBoy.totalCash === 0
    );
};


export interface RidePaymentRule {
    id: string;
    KM: number;
    ratePerKm: number;
    vehicleType: 'bike' | 'scooter' | 'cycle';
    isActive: boolean;
    lastUpdated?: string;
}

export interface HeaderSectionProps {
    paymentRules: RidePaymentRule[];
    handleAddRule: () => void;
}

export interface FilterSectionProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterVehicle: string;
    setFilterVehicle: (vehicle: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
}

export interface RulesTableProps {
    filteredRules: RidePaymentRule[];
    handleEditRule: (rule: RidePaymentRule) => void;
    handleBlockRule: (id: string, vehicleType: string) => void;
    handleUnblockRule: (id: string) => void;
    handleToggleStatus: (id: string) => void;
}

export interface ModalProps {
    isOpen: boolean;
    editingRule: RidePaymentRule | null;
    formData: {
        KM: number;
        ratePerKm: number;
        vehicleType: 'bike' | 'scooter' | 'cycle';
        isActive: boolean;
    };
    errors: { [key: string]: string };
    setFormData: (data: any) => void;
    setEditingRule: (rule: RidePaymentRule | null) => void;
    setIsModalOpen: (open: boolean) => void;
    handleSaveRule: () => void;
}
