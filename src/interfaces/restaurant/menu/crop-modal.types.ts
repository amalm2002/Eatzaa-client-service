import { Area } from 'react-easy-crop';

export interface CropModalProps {
    imageSrc: string | null;
    crop: { x: number; y: number };
    zoom: number;
    rotation: number;
    cropShape: 'rect' | 'round';
    setCrop: (crop: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    setRotation: (rotation: number) => void;
    setCropShape: (shape: 'rect' | 'round') => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    handleCrop: (setFieldValue: (field: string, value: any) => void) => void;
    setShowCropModal: (show: boolean) => void;
    setFieldValue: (field: string, value: any) => void;
}
