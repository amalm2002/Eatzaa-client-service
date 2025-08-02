import { MenuItem, Review } from "../foodList/dish-grid.types";

export interface ReviewsTabProps {
    menuItem: MenuItem;
    sortedReviews: Review[] | undefined;
    sortBy: 'newest' | 'highest' | 'lowest';
    setSortBy: React.Dispatch<React.SetStateAction<'newest' | 'highest' | 'lowest'>>;
    renderStars: (rating: number, size?: 'sm' | 'md' | 'lg') => any
    ratingDistribution: number[];
    formatDate: (dateString: string) => string;
}