import { DetailsTabProps } from "../../../interfaces/user/food-details/details-tab-props.types";
import { Leaf, Clock, ChefHat } from "lucide-react";

export const DetailsTab: React.FC<DetailsTabProps> = ({ menuItem }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 tracking-tight">About this dish</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{menuItem.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-800">Category</h4>
                </div>
                <p className="text-teal-700 capitalize font-medium">{menuItem.category}</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-800">Availability</h4>
                </div>
                <p className="text-teal-700 capitalize font-medium">{menuItem.timing}</p>
            </div>
        </div>
        {menuItem.category !== 'drinks' && (
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-teal-600" />
                    What's Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-teal-700 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        <span>1 {menuItem.name}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);