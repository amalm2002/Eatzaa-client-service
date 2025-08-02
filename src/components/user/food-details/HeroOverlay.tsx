import { HeroOverlayProps } from "../../../interfaces/user/food-details/hero-overlay-props.types";
import { Leaf, Clock, ChefHat } from "lucide-react";

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ menuItem, renderStars }) => (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent p-4 sm:p-6">
        <div className="text-white max-w-3xl mx-auto">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate tracking-tight">{menuItem.name}</h1>
                    {menuItem.category === 'veg' && (
                        <div className="bg-teal-600 p-1.5 rounded-full flex-shrink-0">
                            <Leaf className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                {!menuItem.isActive && (
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">Unavailable</span>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                    {renderStars(menuItem.averageRating || 0)}
                    <span className="ml-1 font-semibold">{menuItem.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-200">({menuItem.totalReviews || 0})</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>15-20 min</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4" />
                    <span className="capitalize">{menuItem.timing}</span>
                </div>
            </div>
        </div>
    </div>
);