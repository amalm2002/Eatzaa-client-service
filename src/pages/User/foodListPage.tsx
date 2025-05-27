import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/user/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import createAxios from '../../service/axiousServices/userAxious';
import { toast } from 'sonner';

interface Dish {
    _id: string;
    name: string;
    rating: number;
    timing: string;
    category: string;
    restaurantName: string;
    imageUrl: string;
    discount: string;
    adFlag?: boolean;
    isOnline: boolean;
    price: number;
}

interface CartItem {
    menuId: string;
    quantity: number;
    price: number;
    name: string;
    category: string;
    restaurantName: string;
    discount: number;
}

export default function FoodDeliveryPage() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
    const [tempSortOption, setTempSortOption] = useState<string>(sortOption);
    const [cuisinesList, setCuisinesList] = useState<string[]>(['All']);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(12);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosInstance = createAxios(dispatch);
    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);

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
        const fetchDishes = async () => {
            try {
                const response = await axiosInstance.post('/sort-menu', {
                    tempSortOption: sortOption,
                    searchTerm: searchTerm || '',
                    category: selectedCuisine || 'All',
                });
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
                    adFlag: item.adFlag || false,
                    isOnline: item.isOnline || false,
                    price: parseFloat(item.price) || 0,
                }));

                const uniqueCategories = [
                    'All',
                    ...new Set(mappedDishes.map((dish) => dish.category)),
                ];
                setCuisinesList(uniqueCategories);
                setDishes(mappedDishes);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching sorted menu items:', error);
            }
        };
        fetchDishes();
    }, [sortOption, searchTerm, selectedCuisine]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get(`/get-cart/${userId}`);
                console.log('Cart response:', response);
                setCartItems(response.data.response.items || []);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
            }
        };
        fetchCartItems();
    }, [userId]);

    const handleAddToCart = async (dish: Dish) => {
        try {

            if (cartItems.length >= 4) {
                toast.warning('Cart limit reached! You can only add up to 4 items.');
                return;
            }


            if (cartItems.some((item) => item.menuId === dish._id)) {
                toast.error('This item is already in your cart.');
                return;
            }

            let finalPrice = dish.price;
            let discountAmount = 0;

            const cartItem = {
                food_id: dish._id,
                quantity: 1,
                price: finalPrice,
                name: dish.name,
                category: dish.category,
                restaurant_name: dish.restaurantName,
                discount: discountAmount > 0 ? discountAmount : 0,
            };

            const response = await axiosInstance.post(`/add-to-cart/${userId}`, cartItem);
            // console.log('Add to cart response:', response.data);


            setCartItems([...cartItems, {
                menuId: dish._id,
                quantity: 1,
                price: finalPrice,
                name: dish.name,
                category: dish.category,
                restaurantName: dish.restaurantName,
                discount: discountAmount,
            }]);

            toast.success('Item added to cart successfully!');
            navigate('/user-cart-page')
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Failed to add item to cart. Please try again.');
        }
    };

    const handleApplySort = () => {
        setSortOption(tempSortOption);
        setShowSortDropdown(false);
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDishes = dishes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dishes.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <h2 className="text-xl font-bold">{dishes.length} Dishes</h2>
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

            {/* Dish Grid */}
            <div className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentDishes.map((dish) => (
                        <div
                            key={dish._id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={dish.imageUrl}
                                    alt={dish.name}
                                    className="w-full h-52 object-cover cursor-pointer"
                                    onClick={() => navigate(`/dish/${dish._id}`)}
                                />

                                {/* Opened/Closed Badge */}
                                {/* Online Status Badge */}
                                <div
                                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg text-xs font-semibold
                                    border border-opacity-30 backdrop-blur-sm
                                    transition-all duration-300
                                    animate-fade-in
                                    text-white
                                    bg-gradient-to-r
                                    from-green-500 to-green-600
                                    dark:from-green-600 dark:to-green-700
                                    ring-1 ring-green-400/50
                                    "
                                    style={{ display: dish.isOnline ? 'flex' : 'none' }}
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    <span className="text-xs">Opened</span>
                                </div>

                                <div
                                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg text-xs font-semibold
                                    border border-opacity-30 backdrop-blur-sm
                                    transition-all duration-300
                                    animate-fade-in
                                    text-white
                                    bg-gradient-to-r
                                    from-red-500 to-red-600
                                    dark:from-red-600 dark:to-red-700
                                    ring-1 ring-red-400/50
                                    "
                                     style={{ display: !dish.isOnline ? 'flex' : 'none' }}
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    <span className="text-xs">Closed</span>
                                </div>


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
                                            <h3
                                                className="font-semibold text-base line-clamp-1 cursor-pointer"
                                                onClick={() => navigate(`/dish/${dish._id}`)}
                                            >
                                                {dish.name}
                                            </h3>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {dish.restaurantName}
                                        </div>
                                        <div className="flex items-center mt-1 text-sm text-gray-600">
                                            <div className="flex items-center bg-yellow-300 text-white px-1 py-0.5 rounded text-xs">
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
                                    {/* <button
                                        onClick={() => handleAddToCart(dish)}
                                        disabled={cartItems.some((item) => item.menuId === dish._id)} 
                                        className={`mt-2 px-4 py-2 rounded-md text-sm transition-colors ${cartItems.some((item) => item.menuId === dish._id)
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-[rgb(60,110,113)] text-white hover:bg-[rgb(52,98,101)]'
                                            }`}
                                    >
                                        {cartItems.some((item) => item.menuId === dish._id)
                                            ? 'In Cart'
                                            : 'Add to Cart'}
                                    </button> */}

                                    <button
                                        onClick={() => handleAddToCart(dish)}
                                        disabled={!dish.isOnline || cartItems.some((item) => item.menuId === dish._id)}
                                        className={`mt-2 px-4 py-2 rounded-md text-sm transition-colors
                                        ${!dish.isOnline
                                                ? 'bg-red-400 text-white cursor-not-allowed'
                                                : cartItems.some((item) => item.menuId === dish._id)
                                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                                    : 'bg-[rgb(60,110,113)] text-white hover:bg-[rgb(52,98,101)]'
                                            }`}
                                    >
                                        {!dish.isOnline
                                            ? 'Unavailable'
                                            : cartItems.some((item) => item.menuId === dish._id)
                                                ? 'In Cart'
                                                : 'Add to Cart'}
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200"
                        >
                            Previous
                        </button>
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`px-3 py-2 rounded-md ${currentPage === page
                                        ? 'bg-[rgb(60,110,113)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-200"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}