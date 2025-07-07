export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

export interface OrderSchedule {
    id: string;
    type: 'Delivery' | 'Pickup';
    status: OrderStatus;
    dateTime: string;
}