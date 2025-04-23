import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import createAxios from '../../service/axiousServices/restaurantAxious';

interface Dish {
    _id: string;
    name: string;
    rating: number;
    timing: string; // e.g., "daily", "evening", "afternoon"
    category: string; // e.g., "veg", "drinks"
    restaurantName: string;
    imageUrl: string;
    discount: string;
    adFlag?: boolean;
    isOnline: boolean;
    price: number; // For price sorting
}

export default function FoodDeliveryPage() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
    const [tempSortOption, setTempSortOption] = useState<string>(sortOption); // For dropdown selection
    const [cuisinesList, setCuisinesList] = useState<string[]>(['All']);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAllMenus = async () => {
            try {
                const response = await axiosInstance.get('/get-all-menus');
                console.log('Fetched Dishes:', response.data);

                const mappedDishes: Dish[] = response.data.map((item: any) => ({
                    _id: item._id,
                    name: item.name,
                    rating: item.rating || 4.0,
                    timing: item.timing || 'Daily',
                    category: item.category || 'General',
                    restaurantName: item.restaurantName || 'Unknown Restaurant',
                    imageUrl:
                        item.images && item.images.length > 0
                            ? item.images[0]
                            : '/api/placeholder/400/250',
                    discount: item.price
                        ? `20% OFF UPTO ₹${Math.round(item.price * 0.2)}`
                        : 'No Discount',
                    adFlag: Math.random() > 0.7,
                    isOnline: item.isOnline || false,
                    price: parseFloat(item.price) || 0,
                }));

                const uniqueCategories = [
                    'All',
                    ...new Set(mappedDishes.map((dish) => dish.category)),
                ];
                setCuisinesList(uniqueCategories);

                setDishes(mappedDishes);
            } catch (error) {
                console.error('Error fetching all menu items:', error);
            }
        };
        fetchAllMenus();
    }, []);

    // Filter dishes based on search term and selected cuisine
    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine =
            selectedCuisine === 'All' || dish.category === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    // Sort dishes based on the selected option
    const sortedDishes = [...filteredDishes].sort((a, b) => {
        switch (sortOption) {
            case 'rating':
                return b.rating - a.rating;
            case 'priceLowToHigh':
                return a.price - b.price;
            case 'priceHighToLow':
                return b.price - a.price;
            case 'timing':
                const timingOrder: any = {
                    morning: 1,
                    afternoon: 2,
                    evening: 3,
                    daily: 4,
                };
                return (
                    (timingOrder[a.timing.toLowerCase()] || 5) -
                    (timingOrder[b.timing.toLowerCase()] || 5)
                );
            case 'recommended':
            default:
                if (a.adFlag && !b.adFlag) return -1;
                if (!a.adFlag && b.adFlag) return 1;
                return b.rating - a.rating;
        }
    });

    // Handle applying sort option from dropdown
    const handleApplySort = async () => {
        setSortOption(tempSortOption);
        setShowSortDropdown(false);
        console.log(tempSortOption, '========');

        const response = await axiosInstance.post('/sort-menu', {tempSortOption})
        console.log('respoooo:',response);

    };


    const sortOptions = [
        { value: 'recommended', label: 'Relevance (Default)' },
        { value: 'timing', label: 'Delivery Time' },
        { value: 'rating', label: 'Rating' },
        { value: 'priceLowToHigh', label: 'Cost: Low to High' },
        { value: 'priceHighToLow', label: 'Cost: High to Low' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            {/* Search Bar */}
            <div className="bg-white py-4 shadow-sm mb-2">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for dishes, cuisines..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Cuisine filters */}
            <div className="bg-white py-3 mb-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="overflow-x-auto scrollbar-hide whitespace-nowrap">
                        <div className="inline-flex space-x-3">
                            {cuisinesList.map((cuisine) => (
                                <button
                                    key={cuisine}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCuisine === cuisine
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

            {/* Sort options */}
            <div className="container mx-auto px-4 mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{filteredDishes.length} Dishes</h2>
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

                        {/* Sort Dropdown */}
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
                                                className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 p-2">
                                    <button
                                        onClick={handleApplySort}
                                        className="w-full text-center text-orange-500 font-semibold py-2 hover:text-orange-600"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dish Grid */}
            <div className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedDishes.map((dish) => (
                        <div
                            key={dish._id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/dish/${dish._id}`)}
                        >
                            <div className="relative">
                                <img
                                    src={dish.imageUrl}
                                    alt={dish.name}
                                    className="w-full h-52 object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                    <div className="text-white font-bold text-lg">{dish.discount}</div>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center">
                                            {dish.adFlag && (
                                                <span className="inline-block text-xs text-gray-500 border border-gray-300 px-1 rounded mr-2">
                                                    Ad
                                                </span>
                                            )}
                                            <h3 className="font-semibold text-base line-clamp-1">
                                                {dish.name}
                                            </h3>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {dish.restaurantName}
                                        </div>
                                        <div className="flex items-center mt-1 text-sm text-gray-600">
                                            <div className="flex items-center bg-green-700 text-white px-1 py-0.5 rounded text-xs">
                                                <span>{dish.rating}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 ml-0.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                                                </svg>
                                            </div>
                                            <span className="mx-1">•</span>
                                            <span>{dish.timing}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                            {dish.category}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 mt-1">
                                            ₹{dish.price.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}