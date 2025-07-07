import { Transaction } from "./transaction.types";

export interface TransactionFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: Transaction["status"] | "all";
    setStatusFilter: (status: Transaction["status"] | "all") => void;
    dateRange: { from: string; to: string };
    setDateRange: (range: { from: string; to: string }) => void;
    refreshData: () => void;
}