import { useState } from "react";
import { Calendar, ChevronDown, Filter, RefreshCw, Download, Search } from "lucide-react";
import { Transaction } from "../../../interfaces/restaurant/transaction/transaction.types";
import { TransactionFiltersProps } from "../../../interfaces/restaurant/transaction/transaction-filter.types";

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    refreshData,
}) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <div className="w-full md:w-64 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or plan"
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full text-sm input-focus focus:outline-none focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        >
                            <Filter className="h-4 w-4" />
                            <span>{statusFilter === "all" ? "All Statuses" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                        {isStatusDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-100">
                                {["all", "paid", "created", "failed"].map((status) => (
                                    <button
                                        key={status}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left transition-all duration-200"
                                        onClick={() => {
                                            setStatusFilter(status as Transaction["status"] | "all");
                                            setIsStatusDropdownOpen(false);
                                        }}
                                    >
                                        {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                        <Calendar className="h-4 w-4" />
                        <span>Date Range</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                        className="flex items-center gap-2 px-3 py-2 gradient-button text-white rounded-md text-sm"
                        onClick={refreshData}
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 gradient-button text-white rounded-md text-sm">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;