import { PriceSectionProps } from "../../../interfaces/user/food-details/price-section-props.types";

export const PriceSection: React.FC<PriceSectionProps> = ({ menuItem }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
        <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-teal-700 tracking-tight">₹{menuItem.price}</span>
            <span className="text-sm text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-teal-200 font-medium">
                {menuItem.quantity} in stock
            </span>
        </div>
    </div>
);