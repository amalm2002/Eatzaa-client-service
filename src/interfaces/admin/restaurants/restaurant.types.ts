export interface Restaurant {
    id: string;
    name: string;
    owner: string;
    mobile: string;
    location: string;
    status: 'active' | 'inactive';
    rating: number;
    totalOrders: number;
    image?: string;
    isRejected?: boolean;
}

export interface RestaurantListFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'active' | 'inactive';
    setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
}

export interface RestaurantListTableProps {
    restaurants: Restaurant[];
    sortField: keyof Restaurant;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof Restaurant) => void;
    handleView: (id: string) => void;
}

export interface RestaurantListPaginationProps {
    filteredRestaurants: Restaurant[];
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}