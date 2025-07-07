import { PartnerData } from "../dashboard/partner-data.types";

export interface SidebarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    partnerData: PartnerData;
    handleLogout: () => void;
}