import { Order } from "./order.types";

export interface OrderFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
    sortField: keyof Order;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof Order) => void;
}
