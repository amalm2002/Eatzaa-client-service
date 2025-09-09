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