export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}