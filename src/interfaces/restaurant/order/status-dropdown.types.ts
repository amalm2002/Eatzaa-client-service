import { AxiosInstance } from "axios";
import { Order } from "./order.types";

export interface StatusDropdownProps {
    order: Order;
    axiosInstance: AxiosInstance;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}