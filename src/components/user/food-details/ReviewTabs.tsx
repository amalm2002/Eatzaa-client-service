import { ReviewsTabProps } from "../../../interfaces/user/food-details/review-tab-props.types";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
    menuItem,
    sortedReviews,
    sortBy,
    setSortBy,
    renderStars,
    ratingDistribution,
    formatDate,
}) => (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl border border-yellow-200">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="text-center sm:text-left sm:min-w-32">
                    <div className="text-3xl sm:text-4xl font-bold text-teal-600 mb-1">
                        {menuItem.averageRating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                        {renderStars(menuItem.averageRating || 0, 'lg')}
                    </div>
                    <div className="text-gray-600 text-sm">Based on {menuItem.totalReviews || 0} reviews</div>
                </div>
                <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600 w-3">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-yellow-200 rounded-full h-2">
                                <div
                                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${menuItem.reviews && menuItem.reviews.length > 0
                                            ? (ratingDistribution[index] / menuItem.reviews.length) * 100
                                            : 0}%`,
                                    }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 w-6 text-right">{ratingDistribution[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Customer Reviews</h3>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
            </select>
        </div>
        <div className="space-y-4">
            {sortedReviews && sortedReviews.length > 0 ? (
                sortedReviews.map((review) => (
                    <div
                        key={review._id}
                        className="border border-yellow-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-yellow-50"
                    >
                        <div className="flex items-start gap-3">
                            <img
                                src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'User')}&background=0d9488&color=fff`}
                                alt={review.userName || 'User'}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName || 'User')}&background=0d9488&color=fff`;
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-800 truncate">{review.userName || 'Anonymous User'}</h4>
                                    {review.verified && (
                                        <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    {renderStars(review.rating, 'sm')}
                                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors duration-200 p-1 rounded">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>Helpful ({review.helpful || 0})</span>
                                        </button>
                                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200 p-1 rounded">
                                            <ThumbsDown className="w-3 h-3" />
                                            <span className="hidden sm:inline">Not helpful</span>
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 truncate max-w-24 sm:max-w-none">
                                        Order #{review.orderId.slice(-8)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h4>
                    <p className="text-gray-500 text-sm">Be the first to review this dish!</p>
                </div>
            )}
        </div>
        {sortedReviews && sortedReviews.length > 0 && (
            <div className="text-center pt-4 border-t border-yellow-200">
                <button className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-teal-50">
                    Load more reviews
                </button>
            </div>
        )}
    </div>
);