export interface ImageGalleryProps {
    images: string[];
    currentImageIndex: number;
    setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
    dishName: string;
}