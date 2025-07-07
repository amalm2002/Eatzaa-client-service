export interface PaginationControlsProps {
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}