import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '../../api/endpoints/userApi';
import Navbar from '../../components/user/layouts/Navbar';
import SearchBar from '../../components/user/food-list/SearchBar';
import CuisineFilters from '../../components/user/food-list/CuisineFilters';
import SortOptions from '../../components/user/food-list/SortOptions';
import DishGrid from '../../components/user/food-list/DishGrid';
import PaginationControls from '../../components/user/food-list/PaginationControls';
import CartResetPopup from '../../components/user/food-list/CartResetPopup';
import { useDispatch, useSelector } from 'react-redux';
import { Dish } from '../../interfaces/user/foodList/dish.types';
import { CartItem } from '../../interfaces/user/foodList/cart-reset-popup.types';

const FoodDeliveryPage = () => {
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
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [pendingDish, setPendingDish] = useState<Dish | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        const responseData = await userApi.getSortedMenu(dispatch, sortOption, searchTerm, selectedCuisine);

        const mappedDishes: Dish[] = responseData.map((item: any) => ({
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
          restaurantId: item.restaurantId,
          description: item.description || '',
          hasVariants: item.hasVariants || false,
          images: item.images || [],
          variants: item.variants || [],
          quantity: item.quantity || 0,
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
  }, [sortOption, searchTerm, selectedCuisine, dispatch]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const fetchedItems = await userApi.getCartItems(dispatch, userId);
        setCartItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };
    fetchCartItems();
  }, [userId, dispatch]);

   const handleAddToCart = async (dish: Dish) => {
    if (dish.quantity === 0) {
      toast.error('This item is out of stock.');
      return;
    }
    try {
      if (cartItems.length > 0 && cartItems[0].restaurantId !== dish.restaurantId) {
        setPendingDish(dish);
        setShowPopup(true);
        return;
      }

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
        restaurant_id: dish.restaurantId,
        discount: discountAmount > 0 ? discountAmount : 0,
        description: dish.description,
        timing: dish.timing,
        rating: dish.rating,
        hasVariants: dish.hasVariants,
        images: dish.images,
        variants: dish.variants || [],
      };

      await userApi.addToCart(dispatch, userId, cartItem);

      setCartItems([...cartItems, {
        menuId: dish._id,
        quantity: 1,
        price: finalPrice,
        name: dish.name,
        category: dish.category,
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurantName,
        discount: discountAmount,
        description: dish.description,
        timing: dish.timing,
        rating: dish.rating,
        hasVariants: dish.hasVariants,
        images: dish.images,
        variants: dish.variants || [],
      }]);

      toast.success('Item added to cart successfully!');
      navigate('/user-cart-page');
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const handleResetCart = async () => {
    try {
      await userApi.resetCart(dispatch, userId);
      toast.success('Cart cleared successfully! You can now add dishes from a new restaurant.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#CAE8BD',
          color: 'gray',
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
        },
        icon: '🍽️',
      });

      setCartItems([]);
      if (pendingDish) {
        await handleAddToCart(pendingDish);
      }

      setShowPopup(false);
      setPendingDish(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPendingDish(null);
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

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Navbar />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CuisineFilters
        cuisinesList={cuisinesList}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
      />
      <SortOptions
        sortOption={sortOption}
        tempSortOption={tempSortOption}
        setTempSortOption={setTempSortOption}
        setShowSortDropdown={setShowSortDropdown}
        handleApplySort={handleApplySort}
        showSortDropdown={showSortDropdown}
        dropdownRef={dropdownRef}
      />
      <DishGrid dishes={currentDishes} cartItems={cartItems} handleAddToCart={handleAddToCart} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      <CartResetPopup showPopup={showPopup} handleCancel={handleCancel} handleResetCart={handleResetCart} />
    </div>
  );
};

export default FoodDeliveryPage;