import React from "react";

export interface DeliveryBoyDetailsProps {
    deliveryBoyId: string;
    setActivePage: (page: string) => void;
    activePage: string;
}

export interface DeliveryBoyDetailsHeaderProps {
    deliveryBoy: any;
    getStatusBadge: () => React.ReactElement;
    getOnlineBadge: () => React.ReactElement
    handleVerify: () => void;
    handleReject: () => void;
    showRejectModal: boolean;
    setShowRejectModal: (show: boolean) => void;
}

export interface DeliveryBoyDetailsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export interface DeliveryBoyDetailsOverviewProps {
    deliveryBoy: any;
    formatDate: (dateString: string) => string;
    getStatusBadge: () => React.ReactElement
    getOnlineBadge: () => React.ReactElement
}

export interface DeliveryBoyDetailsDocumentsProps {
    deliveryBoy: any;
    handleVerify: () => void;
    handleReject: () => void;
    showRejectModal: boolean;
    setShowRejectModal: (show: boolean) => void;
    handleImageClick: (url: string) => void;
}

export interface DeliveryBoyDetailsPersonalProps {
    deliveryBoy: any;
    formatDate: (dateString: string) => string;
}

export interface DeliveryBoyDetailsRejectModalProps {
    showRejectModal: boolean;
    setShowRejectModal: (show: boolean) => void;
    rejectionReason: string;
    setRejectionReason: (reason: string) => void;
    handleReject: () => void;
    commonReasons: string[];
}

export interface DeliveryBoyDetailsImageModalProps {
    zoomedImage: string | null;
    setZoomedImage: (url: string | null) => void;
}

export interface DeliveryBoy {
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    concernType: 'payment' | 'route' | 'vehicle' | 'support' | 'other' | 'Zone Changing';
    concern: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    lastActive: string;
    completedDeliveries: number;
    rating: number;
    zoneId?: string;
    zoneName?: string;
    deliveryBoyId?: string;
}

export interface HelpOption {
    _id: string;
    title: string;
    description: string;
    category: string;
    isActive: boolean;
    createdAt?: string;
}