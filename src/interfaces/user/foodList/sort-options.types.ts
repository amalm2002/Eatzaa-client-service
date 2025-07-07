import { RefObject } from 'react';

export interface SortOption {
    value: string;
    label: string;
}

export interface SortOptionsProps {
    sortOption: string;
    tempSortOption: string;
    setTempSortOption: (option: string) => void;
    setShowSortDropdown: (show: boolean) => void;
    handleApplySort: () => void;
    showSortDropdown: boolean;
    dropdownRef: RefObject<HTMLDivElement | null>;
}