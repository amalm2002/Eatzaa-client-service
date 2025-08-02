import { DeliveryPartnerCardProps, Review } from '../../../interfaces/user/profile/order-tracking.types';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Star, X, Send, Edit2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../../api/endpoints/userApi';
import { toast } from 'sonner';

const DeliveryPartnerCard = ({ order }: DeliveryPartnerCardProps) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [submittedReview, setSubmittedReview] = useState(null);
    const [submittedReview, setSubmittedReview] = useState<Review | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubmittedReview = async () => {
            try {
                const response = await userApi.getUserReviewForOrder(dispatch, {
                    userId,
                    orderId: order.orderId,
                    deliveryBoyId: order.deliveryBoy?.id
                });
                if (response.success && response.data.review) {
                    setSubmittedReview(response.data.review);
                }
            } catch (error) {
                console.error('Error fetching submitted review:', error);
            }
        };
        if (order?.deliveryBoy?.id && order?.orderId && userId) {
            fetchSubmittedReview();
        }
    }, [order.deliveryBoy?.id, order.orderId, userId]);


    const handleSubmitReview = async () => {
        if (rating === 0) {
            return;
        }
        setIsSubmitting(true);
        try {
            const reviewData = {
                deliveryBoyId: order.deliveryBoy?.id,
                rating: rating,
                comment: reviewText,
                orderId: order.orderId,
                userId: userId,
                isEdit: isEditing,
            };

            const response = await userApi.reviewAndRaitingDeliveryBoy(dispatch, reviewData);
            console.log('response on submitting review and rating', response);
            if (response.success) {
                setSubmittedReview(response.data.review);
                setRating(0);
                setReviewText('');
                setShowReviewModal(false);
                setIsEditing(false);
                toast.success(response.message || 'Review Added successfully!')
            } else if (!response.success) {
                toast.error(response.message)
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditReview = () => {
        if (!submittedReview) return;
        setIsEditing(true);
        setRating(submittedReview.rating);
        setReviewText(submittedReview.comment);
        setShowReviewModal(true);
    };

    const handleDeleteReview = async () => {
        try {
            const response = await userApi.deleteReview(dispatch, {
                orderId: order.orderId,
                userId: userId,
                deliveryBoyId: order.deliveryBoy?.id
            });
            console.log('response data on delete :', response);

            if (response.success) {
                setSubmittedReview(null);
                toast.success(response.message)
            } else if (!response.success) {
                toast.error(response.error.message || 'Somthing went wrong')
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const canReview = order.currentStatus === 'delivered';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">🏍️ Your Delivery Partner</h2>
            {order.currentStatus !== 'pending' && order.currentStatus !== 'cancelled' && order.deliveryBoy ? (
                <div>
                    <div className="text-center mb-6">
                        <img
                            src={order.deliveryBoy.profileImage}
                            alt={order.deliveryBoy.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-4 border-teal-100"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{order.deliveryBoy.name}</h3>
                        <div className="flex items-center justify-center mt-2">
                            <Star className="text-yellow-500 fill-current" size={16} />
                            <span className="ml-1 text-gray-600">{order.deliveryBoy.rating || 'N/A'}</span>
                            <span className="ml-2 text-sm text-gray-500">({order.deliveryBoy.totalDeliveries || 0} deliveries)</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-3">
                            <button className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center">
                                <Phone size={16} className="mr-2" />
                                Call
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                                <MessageCircle size={16} className="mr-2" />
                                Chat
                            </button>
                        </div>

                        {/* Show review button if no review submitted, otherwise show review data */}
                        {canReview && !submittedReview ? (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center"
                            >
                                <Star size={16} className="mr-2" />
                                Rate & Review
                            </button>
                        ) : submittedReview ? (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        {[...Array(submittedReview.rating)].map((_, i) => (
                                            <Star key={i} className="text-yellow-500 fill-current" size={16} />
                                        ))}
                                        <span className="ml-2 text-gray-600">{submittedReview.rating}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleEditReview}
                                            className="text-teal-600 hover:text-teal-700"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={handleDeleteReview}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700">{submittedReview.comment}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(submittedReview.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ) : null}

                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Contact Number</div>
                            <div className="font-mono text-gray-800 font-semibold">{order.deliveryBoy.mobile}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600">No delivery partner assigned yet.</div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Review' : 'Rate Your Experience'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setIsEditing(false);
                                    setRating(0);
                                    setReviewText('');
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <img
                                src={order.deliveryBoy?.profileImage}
                                alt={order.deliveryBoy?.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-4 border-teal-100"
                            />
                            <h4 className="text-lg font-semibold text-gray-800">{order.deliveryBoy?.name}</h4>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                How was your delivery experience?
                            </label>
                            <div className="flex justify-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded"
                                    >
                                        <Star
                                            size={32}
                                            className={`${star <= (hoverRating || rating)
                                                ? 'text-yellow-500 fill-current'
                                                : 'text-gray-300'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-sm text-gray-600">
                                    {rating > 0 && (
                                        <>
                                            {rating === 1 && 'Poor'}
                                            {rating === 2 && 'Fair'}
                                            {rating === 3 && 'Good'}
                                            {rating === 4 && 'Very Good'}
                                            {rating === 5 && 'Excellent'}
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Share your feedback (optional)
                            </label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us about your delivery experience..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                maxLength={500}
                            />
                            <div className="text-right mt-1">
                                <span className="text-xs text-gray-500">{reviewText.length}/500</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-3">
                            <button
                                onClick={handleSubmitReview}
                                disabled={isSubmitting || rating === 0}
                                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <>
                                        <Send size={16} className="mr-2" />
                                        {isEditing ? 'Update Review' : 'Submit Review'}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setIsEditing(false);
                                    setRating(0);
                                    setReviewText('');
                                }}
                                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryPartnerCard;