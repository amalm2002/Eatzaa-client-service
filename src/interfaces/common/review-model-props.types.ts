export interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, reviewText: string) => Promise<void>;
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    initialRating?: number;
    initialReviewText?: string;
    isEditing?: boolean;
    ratingLabel?: string;
    placeholder?: string;
}