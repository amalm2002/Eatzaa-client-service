
export interface RecentOrder {
    id: string;
    orderNumber: number;
    restaurant: string;
    amount: number;
    time: string;
    status: string;
}

export interface RecentOrdersProps {
    recentOrders: RecentOrder[];
}