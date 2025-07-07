import { AxiosInstance } from 'axios';
import { Order } from "./order.types";

export interface OrderCardProps {
    order: Order;
    axiosInstance: AxiosInstance;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}
