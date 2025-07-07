import { CuisineFiltersProps } from "../../../interfaces/user/foodList/cuisine.types";

const CuisineFilters = ({ cuisinesList, selectedCuisine, setSelectedCuisine }: CuisineFiltersProps) => {
  return (
    <div className="bg-white py-3 mb-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide whitespace-nowrap">
          <div className="inline-flex space-x-3">
            {cuisinesList.map((cuisine) => (
              <button
                key={cuisine}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCuisine === cuisine
                    ? 'bg-[rgb(60,110,113)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineFilters;