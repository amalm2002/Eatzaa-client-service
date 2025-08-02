import { Star, X, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReviewModalProps } from '../../interfaces/common/review-model-props.types';



const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  initialRating = 0,
  initialReviewText = '',
  isEditing = false,
  ratingLabel = 'How would you rate this?',
  placeholder = 'Share your thoughts...',
}: ReviewModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(initialReviewText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setReviewText(initialReviewText);
      setHoverRating(0);
    }
  }, [isOpen, initialRating, initialReviewText]);

  console.log('isSubmitting :',isSubmitting);
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(rating, reviewText);
      setRating(0);
      setReviewText('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Review' : title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-20 h-20 rounded-lg object-cover mx-auto mb-3 border-4 border-teal-100"
          />
          <h4 className="text-lg font-semibold text-gray-800">{subtitle}</h4>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">{ratingLabel}</label>
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
                  className={`${star <= (hoverRating || rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'} transition-colors`}
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Share your feedback (optional)</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500">{reviewText.length}/500</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
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
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;