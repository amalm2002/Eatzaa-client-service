import { Transaction } from "./transaction.types";

export interface TransactionTableProps {
    transactions: Transaction[];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    navigateToDetails: (id: string) => void;
}