// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Star, Clock, ChefHat, X, ThumbsUp, ThumbsDown, Leaf, ArrowLeft } from 'lucide-react';
// import { MenuItem, Review } from '../../interfaces/user/foodList/dish-grid.types';
// import { userApi } from '../../api/endpoints/userApi';
// import { useDispatch } from 'react-redux';


// const FoodDetailModal: React.FC = () => {
//     const { dishId } = useParams<{ dishId: string }>();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
//     const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
//     const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     useEffect(() => {
//         const fetchDishData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const dishResponse = await userApi.getMenuDetails(dispatch, { dishId });
//                 const reviewResponse = await userApi.getFoodReview(dispatch, { dishId });

//                 const reviews = reviewResponse.response || [];
//                 const totalReviews = reviews.length;
//                 const averageRating = reviews.length > 0
//                     ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
//                     : 0;

//                 setMenuItem({
//                     ...dishResponse,
//                     reviews,
//                     totalReviews,
//                     averageRating,
//                 });
//             } catch (err) {
//                 setError('Failed to load dish details');
//                 console.error('Error fetching dish:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (dishId) {
//             fetchDishData();
//         } else {
//             setError('Dish ID not provided');
//             setLoading(false);
//         }
//     }, [dishId, dispatch]);

//     const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
//         const sizeClasses = {
//             sm: 'w-3 h-3',
//             md: 'w-4 h-4',
//             lg: 'w-5 h-5',
//         };

//         return (
//             <div className="flex items-center gap-0.5">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                         key={star}
//                         className={`${sizeClasses[size]} transition-colors ${star <= Math.floor(rating)
//                             ? 'fill-yellow-400 text-yellow-400'
//                             : 'fill-yellow-200 text-yellow-400'
//                             }`}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     const formatDate = (dateString: string) => {
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-IN', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//             });
//         } catch {
//             return 'Unknown date';
//         }
//     };

//     const getRatingDistribution = () => {
//         if (!menuItem?.reviews || menuItem.reviews.length === 0) return [0, 0, 0, 0, 0];
//         const distribution = [0, 0, 0, 0, 0];
//         menuItem.reviews.forEach((review) => {
//             if (review.rating >= 1 && review.rating <= 5) {
//                 distribution[review.rating - 1]++;
//             }
//         });
//         return distribution.reverse();
//     };

//     const sortedReviews = menuItem?.reviews
//         ?.slice()
//         .sort((a, b) => {
//             if (sortBy === 'newest') {
//                 return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//             } else if (sortBy === 'highest') {
//                 return b.rating - a.rating;
//             } else {
//                 return a.rating - b.rating;
//             }
//         });

//     const ratingDistribution = getRatingDistribution();

//     const handleClose = () => {
//         navigate(-1);
//     };

//     if (loading) {
//         return (
//             <div className="fixed inset-0 bg-white/10 bg-opacity-10 backdrop-blur-lg flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-2xl p-8 text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading dish details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !menuItem) {
//         return (
//             <div className="fixed inset-0 bg-white/10 bg-opacity-10 backdrop-blur-lg flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
//                     <div className="text-red-500 text-6xl mb-4">⚠️</div>
//                     <h2 className="text-xl font-bold text-gray-800 mb-2">Dish Not Found</h2>
//                     <p className="text-gray-600 mb-6">{error || 'The requested dish could not be found.'}</p>
//                     <button
//                         onClick={handleClose}
//                         className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
//                     >
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="fixed inset-0 bg-white/10 bg-opacity-10 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
//             <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
//                 <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//                     <style>{`div::-webkit-scrollbar {display: none; } `}</style>
//                     <div className="relative">
//                         <button
//                             onClick={handleClose}
//                             className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
//                         >
//                             <X className="w-5 h-5 text-gray-600" />
//                         </button>

//                         {/* Image Gallery */}
//                         <div className="relative">
//                             <img
//                                 src={menuItem.images[currentImageIndex] || menuItem.images[0]}
//                                 alt={menuItem.name}
//                                 className="w-full h-48 sm:h-64 md:h-80 object-cover"
//                             />

//                             {/* Image Navigation */}
//                             {menuItem.images.length > 1 && (
//                                 <>
//                                     {/* Dots */}
//                                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//                                         {menuItem.images.map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => setCurrentImageIndex(index)}
//                                                 className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                                                     }`}
//                                             />
//                                         ))}
//                                     </div>

//                                     {/* Navigation Arrows */}
//                                     <button
//                                         onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? menuItem.images.length - 1 : prev - 1))}
//                                         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
//                                     >
//                                         <ArrowLeft className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                         onClick={() => setCurrentImageIndex((prev) => (prev === menuItem.images.length - 1 ? 0 : prev + 1))}
//                                         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
//                                     >
//                                         <ArrowLeft className="w-4 h-4 rotate-180" />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Hero Overlay */}
//                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 via-gray-900/40 to-transparent p-4 sm:p-6">
//                             <div className="text-white">
//                                 <div className="flex items-start justify-between mb-2">
//                                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                                         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{menuItem.name}</h1>
//                                         {menuItem.category === 'veg' && (
//                                             <div className="bg-teal-600 p-1 rounded flex-shrink-0">
//                                                 <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//                                             </div>
//                                         )}
//                                     </div>
//                                     {!menuItem.isActive && (
//                                         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Unavailable</span>
//                                     )}
//                                 </div>
//                                 <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
//                                     <div className="flex items-center gap-1">
//                                         {renderStars(menuItem.averageRating || 0)}
//                                         <span className="ml-1 font-medium">{menuItem.averageRating?.toFixed(1) || '0.0'}</span>
//                                         <span className="text-gray-300">({menuItem.totalReviews || 0})</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
//                                         <span>15-20 min</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />
//                                         <span className="capitalize">{menuItem.timing}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Content */}
//                     <div className="p-4 sm:p-6">
//                         {/* Price and Cart Section */}
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-2xl sm:text-3xl font-bold text-teal-600">₹{menuItem.price}</span>
//                                 <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                                     {menuItem.quantity} in stock
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Tabs */}
//                         <div className="border-b border-gray-200 mb-6">
//                             <nav className="flex space-x-6 sm:space-x-8">
//                                 <button
//                                     onClick={() => setActiveTab('details')}
//                                     className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'details' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-gray-800'
//                                         }`}
//                                 >
//                                     Details
//                                 </button>
//                                 {menuItem.reviews && menuItem.reviews.length > 0 && (
//                                     <button
//                                         onClick={() => setActiveTab('reviews')}
//                                         className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'reviews' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-gray-800'
//                                             }`}
//                                     >
//                                         Reviews ({menuItem.totalReviews || 0})
//                                     </button>
//                                 )}
//                             </nav>
//                         </div>

//                         {/* Tab Content */}
//                         <div className="pb-4">
//                             {activeTab === 'details' ? (
//                                 <div className="space-y-6">
//                                     {/* Description */}
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-800 mb-3">About this dish</h3>
//                                         <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{menuItem.description}</p>
//                                     </div>

//                                     {/* Info Cards */}
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
//                                             <div className="flex items-center gap-2 mb-2">
//                                                 <Leaf className="w-5 h-5 text-teal-600" />
//                                                 <h4 className="font-semibold text-teal-800">Category</h4>
//                                             </div>
//                                             <p className="text-teal-700 capitalize font-medium">{menuItem.category}</p>
//                                         </div>

//                                         <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
//                                             <div className="flex items-center gap-2 mb-2">
//                                                 <Clock className="w-5 h-5 text-teal-600" />
//                                                 <h4 className="font-semibold text-teal-800">Availability</h4>
//                                             </div>
//                                             <p className="text-teal-700 capitalize font-medium">{menuItem.timing}</p>
//                                         </div>
//                                     </div>

//                                     {/* Serving Info (Optional) */}
//                                     {menuItem.category !== 'drinks' && (
//                                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                             <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                                                 <ChefHat className="w-5 h-5 text-gray-600" />
//                                                 What's Included
//                                             </h4>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
//                                                     <span>1 {menuItem.name}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="space-y-6">
//                                     {/* Rating Overview */}
//                                     <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-6 rounded-xl border border-teal-200">
//                                         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//                                             <div className="text-center sm:text-left sm:min-w-32">
//                                                 <div className="text-3xl sm:text-4xl font-bold text-teal-600 mb-1">
//                                                     {menuItem.averageRating?.toFixed(1) || '0.0'}
//                                                 </div>
//                                                 <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
//                                                     {renderStars(menuItem.averageRating || 0, 'lg')}
//                                                 </div>
//                                                 <div className="text-gray-600 text-sm">Based on {menuItem.totalReviews || 0} reviews</div>
//                                             </div>

//                                             <div className="flex-1">
//                                                 {[5, 4, 3, 2, 1].map((rating, index) => (
//                                                     <div key={rating} className="flex items-center gap-2 mb-2">
//                                                         <span className="text-sm text-gray-600 w-3">{rating}</span>
//                                                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                                                         <div className="flex-1 bg-gray-200 rounded-full h-2">
//                                                             <div
//                                                                 className="bg-teal-600 h-2 rounded-full transition-all duration-500"
//                                                                 style={{
//                                                                     width: `${menuItem.reviews && menuItem.reviews.length > 0
//                                                                         ? (ratingDistribution[index] / menuItem.reviews.length) * 100
//                                                                         : 0
//                                                                         }%`,
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                         <span className="text-sm text-gray-600 w-6 text-right">{ratingDistribution[index]}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Reviews Header */}
//                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                                         <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
//                                         <select
//                                             value={sortBy}
//                                             onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
//                                             className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                                         >
//                                             <option value="newest">Newest First</option>
//                                             <option value="highest">Highest Rating</option>
//                                             <option value="lowest">Lowest Rating</option>
//                                         </select>
//                                     </div>

//                                     {/* Reviews List */}
//                                     <div className="space-y-4">
//                                         {sortedReviews && sortedReviews.length > 0 ? (
//                                             sortedReviews.map((review) => (
//                                                 <div
//                                                     key={review._id}
//                                                     className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white"
//                                                 >
//                                                     <div className="flex items-start gap-3">
//                                                         <img
//                                                             src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'User')}&background=0d9488&color=fff`}
//                                                             alt={review.userName || 'User'}
//                                                             className="w-10 h-10 rounded-full object-cover flex-shrink-0"
//                                                             onError={(e) => {
//                                                                 e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'User')}&background=0d9488&color=fff`;
//                                                             }}
//                                                         />
//                                                         <div className="flex-1 min-w-0">
//                                                             <div className="flex flex-wrap items-center gap-2 mb-1">
//                                                                 <h4 className="font-medium text-gray-800 truncate">{review.userName || 'Anonymous User'}</h4>
//                                                                 {review.verified && (
//                                                                     <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
//                                                                         ✓ Verified
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                             <div className="flex items-center gap-2 mb-3">
//                                                                 {renderStars(review.rating, 'sm')}
//                                                                 <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
//                                                             </div>
//                                                             <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
//                                                             <div className="flex items-center justify-between">
//                                                                 <div className="flex items-center gap-4">
//                                                                     <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors duration-200 p-1 rounded">
//                                                                         <ThumbsUp className="w-3 h-3" />
//                                                                         <span>Helpful ({review.helpful || 0})</span>
//                                                                     </button>
//                                                                     <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200 p-1 rounded">
//                                                                         <ThumbsDown className="w-3 h-3" />
//                                                                         <span className="hidden sm:inline">Not helpful</span>
//                                                                     </button>
//                                                                 </div>
//                                                                 <div className="text-xs text-gray-400 truncate max-w-24 sm:max-w-none">
//                                                                     Order #{review.orderId.slice(-8)}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <div className="text-center py-8">
//                                                 <div className="text-gray-400 text-6xl mb-4">📝</div>
//                                                 <h4 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h4>
//                                                 <p className="text-gray-500 text-sm">Be the first to review this dish!</p>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Load More Button */}
//                                     {sortedReviews && sortedReviews.length > 0 && (
//                                         <div className="text-center pt-4 border-t border-gray-200">
//                                             <button className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-teal-50">
//                                                 Load more reviews
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FoodDetailModal;






import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import { MenuItem, Review } from '../../interfaces/user/foodList/dish-grid.types';
import { userApi } from '../../api/endpoints/userApi';
import { useDispatch } from 'react-redux';
import { ImageGallery } from '../../components/user/food-details/ImageGallery';
import { HeroOverlay } from '../../components/user/food-details/HeroOverlay';
import { PriceSection } from '../../components/user/food-details/PriceSection';
import { DetailsTab } from '../../components/user/food-details/DetailsTab';
import { ReviewsTab } from '../../components/user/food-details/ReviewTabs';



const FoodDetailModal: React.FC = () => {
    const { dishId } = useParams<{ dishId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        const fetchDishData = async () => {
            try {
                setLoading(true);
                setError(null);
                const dishResponse = await userApi.getMenuDetails(dispatch, { dishId });
                const reviewResponse = await userApi.getFoodReview(dispatch, { dishId });

                const reviews = reviewResponse.response || [];
                const totalReviews = reviews.length;
                const averageRating = reviews.length > 0
                    ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
                    : 0;

                setMenuItem({
                    ...dishResponse,
                    reviews,
                    totalReviews,
                    averageRating,
                });
            } catch (err) {
                setError('Failed to load dish details');
                console.error('Error fetching dish:', err);
            } finally {
                setLoading(false);
            }
        };

        if (dishId) {
            fetchDishData();
        } else {
            setError('Dish ID not provided');
            setLoading(false);
        }
    }, [dishId, dispatch]);

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md'): any => {
        const sizeClasses = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
        };

        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} transition-colors ${star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-200 text-yellow-400'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'Unknown date';
        }
    };

    const getRatingDistribution = (): number[] => {
        if (!menuItem?.reviews || menuItem.reviews.length === 0) return [0, 0, 0, 0, 0];
        const distribution = [0, 0, 0, 0, 0];
        menuItem.reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });
        return distribution.reverse();
    };

    const sortedReviews = menuItem?.reviews
        ?.slice()
        .sort((a: Review, b: Review) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === 'highest') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });

    const ratingDistribution = getRatingDistribution();

    const handleClose = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dish details...</p>
                </div>
            </div>
        );
    }

    if (error || !menuItem) {
        return (
            <div className="fixed inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">Dish Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The requested dish could not be found.'}</p>
                    <button
                        onClick={handleClose}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`div::-webkit-scrollbar {display: none;}`}</style>
                    <div className="relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-md"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <ImageGallery
                            images={menuItem.images}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            dishName={menuItem.name}
                        />
                        <HeroOverlay menuItem={menuItem} renderStars={renderStars} />
                    </div>
                    <div className="p-4 sm:p-6">
                        <PriceSection menuItem={menuItem} />
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-6 sm:space-x-8">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'details' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Details
                                </button>
                                {menuItem.reviews && menuItem.reviews.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'reviews' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        Reviews ({menuItem.totalReviews || 0})
                                    </button>
                                )}
                            </nav>
                        </div>
                        <div className="pb-4">
                            {activeTab === 'details' ? (
                                <DetailsTab menuItem={menuItem} />
                            ) : (
                                <ReviewsTab
                                    menuItem={menuItem}
                                    sortedReviews={sortedReviews}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    renderStars={renderStars}
                                    ratingDistribution={ratingDistribution}
                                    formatDate={formatDate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailModal;