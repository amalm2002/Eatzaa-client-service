import { DeliveryPartnerCardProps, Review } from '../../../interfaces/user/profile/order-tracking.types';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Star, Edit2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../../api/endpoints/userApi';
import { toast } from 'sonner';
import ReviewModal from '../../ui/ReviewModal';

const DeliveryPartnerCard = ({ order }: DeliveryPartnerCardProps) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedReview, setSubmittedReview] = useState<Review | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);
    const user = useSelector((store: { userAuth: { user: string } }) => store.userAuth.user);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubmittedReview = async () => {
            try {
                const response = await userApi.getUserReviewForOrder(dispatch, {
                    userId,
                    orderId: order.orderId,
                    deliveryBoyId: order.deliveryBoy?.id,
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
    }, [order.deliveryBoy?.id, order.orderId, userId, dispatch]);

    const handleSubmitReview = async (rating: number, reviewText: string) => {
        setIsSubmitting(true);
        try {
            const reviewData = {
                userName:user,
                deliveryBoyId: order.deliveryBoy?.id,
                rating,
                comment: reviewText,
                orderId: order.orderId,
                userId,
                isEdit: isEditing,
            };

            const response = await userApi.reviewAndRaitingDeliveryBoy(dispatch, reviewData);
            if (response.success) {
                setSubmittedReview(response.data.review);
                setIsEditing(false);
                toast.success(response.message || 'Review added successfully!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
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
    console.log('rating :', rating, 'comment :', reviewText);

    const handleDeleteReview = async () => {
        try {
            const response = await userApi.deleteReview(dispatch, {
                orderId: order.orderId,
                userId,
                deliveryBoyId: order.deliveryBoy?.id,
            });
            if (response.success) {
                setSubmittedReview(null);
                toast.success(response.message);
            } else {
                toast.error(response.error?.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
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
                                        <button onClick={handleEditReview} className="text-teal-600 hover:text-teal-700">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={handleDeleteReview} className="text-red-600 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700">{submittedReview.comment}</p>
                                <p className="text-sm text-gray-500 mt-1">{new Date(submittedReview.createdAt).toLocaleDateString()}</p>
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

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false);
                    setIsEditing(false);
                    setRating(0);
                    setReviewText('');
                }}
                onSubmit={handleSubmitReview}
                title="Rate Your Experience"
                subtitle={order.deliveryBoy?.name || ''}
                imageSrc={order.deliveryBoy?.profileImage || ''}
                imageAlt={order.deliveryBoy?.name || ''}
                initialRating={rating}
                initialReviewText={reviewText}
                isEditing={isEditing}
                ratingLabel="How was your delivery experience?"
                placeholder="Tell us about your delivery experience..."
            />
        </div>
    );
};

export default DeliveryPartnerCard;