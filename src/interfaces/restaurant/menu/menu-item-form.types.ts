import { Variant } from "./variant.types";

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: 'veg' | 'non-veg' | 'drinks';
    price: number;
    quantity: number;
    images: string[];
    hasVariants: boolean;
    variants: Variant[];
    timing?: 'daily' | 'afternoon' | 'evening';
}