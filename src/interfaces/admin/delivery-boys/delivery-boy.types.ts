export interface DeliveryBoy {
    id: string;
    name: string;
    mobile: string;
    email: string;
    location: string;
    status: 'active' | 'blocked';
    totalDeliveries: number;
    image?: string;
    isActive: boolean;
}

export interface DeliveryBoyListFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'active' | 'blocked';
    setStatusFilter: (filter: 'all' | 'active' | 'blocked') => void;
}

export interface DeliveryBoyListTableProps {
    paginatedDeliveryBoys: DeliveryBoy[];
    handleView: (id: string) => void;
    handleBlockUnblock: (id: string, isCurrentlyActive: boolean) => void;
    sortField: keyof DeliveryBoy;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof DeliveryBoy) => void;
}

export interface DeliveryBoyListCardProps {
    boy: DeliveryBoy;
    handleView: (id: string) => void;
    handleBlockUnblock: (id: string, isCurrentlyActive: boolean) => void;
}

export interface DeliveryBoyListPaginationProps {
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}
