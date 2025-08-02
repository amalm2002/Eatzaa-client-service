import { OrderSummaryProps, Review } from '../../../interfaces/user/profile/order-tracking.types';
import { use, useEffect, useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../../api/endpoints/userApi';
import { toast } from 'sonner';
import ReviewModal from '../../ui/ReviewModal';

const OrderSummary = ({ order }: OrderSummaryProps) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submittedReviews, setSubmittedReviews] = useState<Record<string, Review>>({});
    const [isEditing, setIsEditing] = useState(false);

    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);
    const user = useSelector((store: { userAuth: { user: string } }) => store.userAuth.user);
    const dispatch = useDispatch();

    const canReview = order.currentStatus === 'delivered';

    useEffect(() => {
        const fetchSubmittedReviews = async () => {
            try {
                const reviewPromises = order.items.map(async (item: any) => {
                    const response = await userApi.getUserReviewForFoodItem(dispatch, {
                        userId,
                        orderId: order.orderId,
                        itemId: item.foodId,
                    });
                    return { itemId: item.foodId, review: response.success && response.data?.review ? response.data.review : null };
                });

                const reviewResults = await Promise.all(reviewPromises);
                const reviewsMap: Record<string, Review> = {};
                reviewResults.forEach(({ itemId, review }) => {
                    if (review) {
                        reviewsMap[itemId] = review;
                    }
                });

                setSubmittedReviews(reviewsMap);
            } catch (error) {
                console.error('Error fetching submitted reviews:', error);
                toast.error('Failed to fetch reviews');
            }
        };

        if (order?.orderId && userId && canReview) {
            fetchSubmittedReviews();
        }
    }, [order.orderId, userId, canReview, order.items, dispatch]);

    const handleOpenReviewModal = (itemId: string) => {
        setSelectedItemId(itemId);
        setShowReviewModal(true);
        setRating(0);
        setReviewText('');
        setIsEditing(false);
    };

    const handleEditReview = (itemId: string) => {
        const existingReview = submittedReviews[itemId];
        if (!existingReview) return;

        setSelectedItemId(itemId);
        setIsEditing(true);
        setRating(existingReview.rating);
        setReviewText(existingReview.comment);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (rating: number, reviewText: string) => {
        if (!selectedItemId) return;

        try {
            const reviewData = {
                userName: user,
                itemId: selectedItemId,
                rating,
                comment: reviewText,
                orderId: order.orderId,
                userId,
                isEdit: isEditing,
            };

            console.log('review data :', reviewData);


            const response = await userApi.reviewAndRatingFoodItem(dispatch, reviewData);
            if (response.success) {
                setSubmittedReviews((prev) => ({
                    ...prev,
                    [selectedItemId]: response.data.review,
                }));
                toast.success(response.message || 'Review added successfully!');
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    const handleDeleteReview = async (itemId: string) => {
        try {
            const response = await userApi.deleteFoodItemReview(dispatch, {
                orderId: order.orderId,
                userId,
                itemId,
            });
            if (response.success) {
                setSubmittedReviews((prev) => {
                    const updated = { ...prev };
                    delete updated[itemId];
                    return updated;
                });
                toast.success(response.message || 'Review deleted successfully');
            } else {
                toast.error(response.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const selectedItem = order.items.find((item: any) => item.foodId === selectedItemId);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🛒 Order Summary</h2>
            <div className="space-y-4 mb-6">
                {order.items.map((item: any, index: number) => {
                    const itemReview = submittedReviews[item.foodId];
                    return (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={item.images[0] || '/api/placeholder/150/150'}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-800">{item.name}</div>
                                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                        <div className="text-sm text-gray-600 flex items-center">
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-1 ${item.category.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                            />
                                            {item.category}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</div>
                            </div>

                            {canReview && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    {!itemReview ? (
                                        <button
                                            onClick={() => handleOpenReviewModal(item.foodId)}
                                            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center text-sm"
                                        >
                                            <Star size={16} className="mr-2" />
                                            Rate This Item
                                        </button>
                                    ) : (
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    {[...Array(itemReview.rating)].map((_, i) => (
                                                        <Star key={i} className="text-yellow-500 fill-current" size={14} />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">{itemReview.rating}/5</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleEditReview(item.foodId)} className="text-teal-600 hover:text-teal-700">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteReview(item.foodId)} className="text-red-600 hover:text-red-700">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {itemReview.comment && <p className="text-sm text-gray-700 mb-1">{itemReview.comment}</p>}
                                            <p className="text-xs text-gray-500">{new Date(itemReview.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-teal-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <span>Payment Method</span>
                    <span className="text-teal-600 capitalize">{order.paymentMethod}</span>
                </div>
            </div>

            {selectedItem && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false);
                        setIsEditing(false);
                        setRating(0);
                        setReviewText('');
                        setSelectedItemId(null);
                    }}
                    onSubmit={handleSubmitReview}
                    title="Rate This Item"
                    subtitle={selectedItem.name}
                    imageSrc={selectedItem.images[0] || '/api/placeholder/150/150'}
                    imageAlt={selectedItem.name}
                    initialRating={rating}
                    initialReviewText={reviewText}
                    isEditing={isEditing}
                    ratingLabel="How would you rate this item?"
                    placeholder="How was the taste, quality, and presentation?"
                />
            )}
        </div>
    );
};

export default OrderSummary;