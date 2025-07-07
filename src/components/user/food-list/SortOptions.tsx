import { SortOption,SortOptionsProps } from "../../../interfaces/user/foodList/sort-options.types";

const SortOptions = ({
    sortOption,
    tempSortOption,
    setTempSortOption,
    setShowSortDropdown,
    handleApplySort,
    showSortDropdown,
    dropdownRef,
}: SortOptionsProps) => {
    const sortOptions: SortOption[] = [
        { value: 'recommended', label: 'Relevance (Default)' },
        { value: 'timing', label: 'Delivery Time' },
        { value: 'rating', label: 'Rating' },
        { value: 'priceLowToHigh', label: 'Cost: Low to High' },
        { value: 'priceHighToLow', label: 'Cost: High to Low' },
    ];

    return (
        <div className="container mx-auto px-4 mb-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Dishes</h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                            />
                        </svg>
                        <span className="text-sm capitalize">
                            {sortOptions.find((opt) => opt.value === sortOption)?.label}
                        </span>
                    </button>

                    {showSortDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                            <div className="py-2">
                                {sortOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="sortOption"
                                            value={option.value}
                                            checked={tempSortOption === option.value}
                                            onChange={() => setTempSortOption(option.value)}
                                            className="h-4 w-4 text-[rgb(60,110,113)] border-gray-300 focus:text-[rgb(60,110,113)]"
                                        />
                                        <span className="text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 p-2">
                                <button
                                    onClick={handleApplySort}
                                    className="w-full text-center text-[rgb(44,147,140)] font-semibold py-2 hover:text-[rgb(52,98,101)]"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SortOptions;