export interface Payment {
    id: string;
    restaurantId: string;
    restaurantName: string;
    subscriptionName: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    status: 'created' | 'paid' | 'failed';
    createdAt: Date;
    expireAt?: Date;
    isActive: boolean;
}



export interface PaymentListHeaderProps {
    totalAmount: number;
    paidAmount: number;
}

export interface PaymentListFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'paid' | 'created' | 'failed';
    setStatusFilter: (status: 'all' | 'paid' | 'created' | 'failed') => void;
    dateFilter: 'all' | '7days' | '30days' | '90days';
    setDateFilter: (date: 'all' | '7days' | '30days' | '90days') => void;
    activeFilter: 'all' | 'active' | 'expired';
    setActiveFilter: (active: 'all' | 'active' | 'expired') => void;
}

export interface PaymentListTableProps {
    paginatedPayments: Payment[];
    sortField: keyof Payment;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof Payment) => void;
    handleView: (id: string) => void;
    formatDate: (date?: Date) => string;
    getStatusColor: (status: 'created' | 'paid' | 'failed') => string;
}

export interface PaymentListPaginationProps {
    filteredPayments: Payment[];
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}