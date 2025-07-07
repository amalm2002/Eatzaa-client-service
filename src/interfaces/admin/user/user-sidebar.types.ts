import { User } from "./user.types";

export interface UserListSidebarProps {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    handleToggleBlock: (userId: string, action: 'block' | 'unblock') => void;
    actionLoading: boolean;
}