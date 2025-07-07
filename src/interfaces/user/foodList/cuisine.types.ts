export interface CuisineFiltersProps {
    cuisinesList: string[];
    selectedCuisine: string;
    setSelectedCuisine: (cuisine: string) => void;
}