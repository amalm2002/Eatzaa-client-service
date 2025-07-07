export type TabType = 'profile' | 'orders' | 'favorites' | 'addresses';

export interface SidebarProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    name: string;
    email: string;
    tealColor: string;
}
