export interface Zone {
    id: string;
    name: string;
    coordinates: [number, number][];
}

export interface ZoneListSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export interface ZoneListProps {
    paginatedZones: Zone[];
    openDeleteModal: (id: string) => void;
}

export interface ZoneListPaginationProps {
    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}

export interface ZoneListDeleteModalProps {
    isModalOpen: boolean;
    closeDeleteModal: () => void;
    handleDelete: () => void;
}