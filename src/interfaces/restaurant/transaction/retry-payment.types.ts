import { Transaction } from "./transaction-details.types";
import { AxiosInstance } from "axios";

export interface RetryPaymentButtonProps {
    transaction: Transaction;
    axiosInstance: AxiosInstance;
    navigate: (path: string) => void;
}