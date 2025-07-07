import { User } from "./user.types";

export interface UserListPaginationProps {
    users: User[];
    filteredUsers: User[];
}