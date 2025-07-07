import { MenuItem } from "./menu.types";

export interface MenuCardProps {
    item: MenuItem;
    handleEdit: (id: string) => void;
    handleToggleActive: (id: string, isActive: boolean) => void;
}