export interface RestaurantDetailsProps {
    activePage: string;
    setActivePage: (page: string) => void;
    restaurantId: string;
}

export interface Restaurant {
    id: string;
    restaurantName: string;
    email: string;
    mobile: string;
    isVerified: boolean;
    isRejected: boolean;
    rejectionReason: string;
    location: {
        longitude: string;
        latitude: string;
        address: string;
    };
    cuisine: string[];
    rating: number;
    avgDeliveryTime: string;
    restaurantDocuments: {
        idProofUrl: string;
        fssaiLicenseUrl: string;
        businessCertificateUrl: string;
        bankAccountNumber: string;
        ifscCode: string;
    };
    coverImage: string;
    logo: string;
    description: string;
    openingHours: string;
}

export interface RestaurantDetails {
    id: string;
    restaurantName: string;
    cuisine: string[];
    rating: number;
    isVerified: boolean;
    isRejected: boolean;
    coverImage: string;
    logo: string;
}

export interface RestaurantDetailsHeaderProps {
    restaurant: RestaurantDetails;
}

export interface RestaurantDetailsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export interface RestaurantOverView {
    description: string;
    openingHours: string;
    cuisine: string[];
    avgDeliveryTime: string;
    isRejected: boolean;
    rejectionReason: string;
}

export interface RestaurantDetailsOverviewProps {
    restaurant: RestaurantOverView;
}

export interface RestaurantDocuments {
    isVerified: boolean;
    isRejected: boolean;
    restaurantDocuments: {
        idProofUrl: string;
        fssaiLicenseUrl: string;
        businessCertificateUrl: string;
        bankAccountNumber: string;
        ifscCode: string;
    };
}

export interface RestaurantDetailsDocumentsProps {
    restaurant: RestaurantDocuments;
    handleVerify: () => void;
    setShowRejectModal: (show: boolean) => void;
    handleImageClick: (url: string) => void;
    getCloudinaryUrl: (path: string) => string;
}

export interface RestaurantContact {
    email: string;
    mobile: string;
    location: {
        address: string;
        latitude: string;
        longitude: string;
    };
}

export interface RestaurantDetailsContactProps {
    restaurant: RestaurantContact;
}

export interface RestaurantName {
    restaurantName: string;
}

export interface RestaurantDetailsModalsProps {
    showRejectModal: boolean;
    setShowRejectModal: (show: boolean) => void;
    rejectionReason: string;
    setRejectionReason: (reason: string) => void;
    handleReject: () => void;
    zoomedImage: string | null;
    setZoomedImage: (url: string | null) => void;
    restaurant: RestaurantName;
}
