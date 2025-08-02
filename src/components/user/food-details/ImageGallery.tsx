import { ArrowLeft } from 'lucide-react';
import { ImageGalleryProps } from '../../../interfaces/user/food-details/image-gallery.props.types';

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentImageIndex, setCurrentImageIndex, dishName }) => (
    <div className="relative">
        <img
            src={images[currentImageIndex] || images[0]}
            alt={dishName}
            className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-t-xl"
        />
        {images.length > 1 && (
            <>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? 'bg-teal-400 scale-125' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-teal-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
            </>
        )}
    </div>
);