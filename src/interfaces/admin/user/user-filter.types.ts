export interface UserListSearchAndFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterActive: boolean;
    setFilterActive: (active: boolean) => void;
}