import { MenuItem } from "../../../interfaces/user/foodList/dish-grid.types";

export interface HeroOverlayProps {
    menuItem: MenuItem;
    renderStars: (rating: number, size?: 'sm' | 'md' | 'lg') => any
}