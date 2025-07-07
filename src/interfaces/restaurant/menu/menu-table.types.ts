import { MenuItem } from "./menu.types";

export interface MenuTableProps {
    paginatedItems: MenuItem[];
    sortField: keyof MenuItem;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof MenuItem) => void;
    handleEdit: (id: string) => void;
    handleToggleActive: (id: string, isActive: boolean) => void;
}