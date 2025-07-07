export interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    isOnline: boolean;
}