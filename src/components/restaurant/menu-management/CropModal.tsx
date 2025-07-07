import Cropper from 'react-easy-crop';
import { Crop, X } from 'lucide-react';
import { CropModalProps } from '../../../interfaces/restaurant/menu/crop-modal.types';

const CropModal: React.FC<CropModalProps> = ({
  imageSrc,
  crop,
  zoom,
  rotation,
  cropShape,
  setCrop,
  setZoom,
  setRotation,
  setCropShape,
  onCropComplete,
  handleCrop,
  setShowCropModal,
  setFieldValue,
}) => {
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <Crop size={24} className="mr-2 text-[#6589f6]" /> Crop Image
          </h3>
          <button
            onClick={() => setShowCropModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={24} />
          </button>
        </div>
        <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden shadow-inner">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            classes={{
              containerClassName: 'rounded-lg',
              cropAreaClassName: cropShape === 'round' ? 'rounded-full' : 'rounded-lg',
            }}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6589f6]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6589f6]"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Shape</label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setCropShape('rect')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${cropShape === 'rect' ? 'bg-[#6589f6] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Square
            </button>
            <button
              type="button"
              onClick={() => setCropShape('round')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${cropShape === 'round' ? 'bg-[#6589f6] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Circle
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setShowCropModal(false)}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleCrop(setFieldValue)}
            className="px-5 py-2.5 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all flex items-center font-medium"
          >
            <Crop size={18} className="mr-1" /> Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;