import { User } from "./user.types";

export interface UserListTableProps {
    users: User[];
    loading: boolean;
    error: string | null;
    filterActive: boolean;
    searchTerm: string;
    handleRowClick: (user: User) => void;
    handleToggleBlock: (userId: string, action: 'block' | 'unblock') => void;
    actionLoading: boolean;
}