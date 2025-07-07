import { OrderItem } from "./order-tracking.types";

export interface Order {
    id: string;
    restaurantName: string;
    date: string;
    status: string;
    total: number;
    items: OrderItem[];
}

export interface OrderHistoryProps {
    tealColor?: string;
}

export interface OrderCardProps {
    order: Order;
    tealColor: string;
    handleViewOrderDetails: (orderId: string) => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handlePageChange: (pageNumber: number) => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    tealColor: string;
}
