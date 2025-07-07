import { Camera, X } from 'lucide-react';
import { ImagesTimingFormProps } from '../../../interfaces/restaurant/menu/images-timing-form.types';

const ImagesTimingForm: React.FC<ImagesTimingFormProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleFileChange,
  fileInputRefs,
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
        <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
        Images & Timing
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability Timing</label>
        <div className="grid grid-cols-3 gap-4">
          {(['daily', 'afternoon', 'evening'] as const).map((timing) => (
            <button
              key={timing}
              type="button"
              onClick={() => setFieldValue('timing', timing)}
              className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
                values.timing === timing
                  ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-lg'
                  : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
              } font-medium`}
            >
              {timing.charAt(0).toUpperCase() + timing.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {values.images.map((image, index) => (
          <div
            key={index}
            className={`border-2 ${image ? 'border-gray-200' : 'border-dashed border-gray-300'} rounded-xl p-4 flex flex-col items-center justify-center h-56 transition-all duration-300 hover:border-[#6589f6] hover:shadow-md bg-gray-50`}
          >
            {image ? (
              <div className="relative w-full h-full">
                <img src={image} alt="Food item" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFieldValue(`images[${index}]`, '')}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-all"
                >
                  <X size={18} className="text-gray-600" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#6589f6] text-white text-xs py-1.5 text-center rounded-b-lg">
                    Primary Image
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500 hover:text-[#6589f6] w-full h-full justify-center transition-all">
                <input
                  type="file"
                  accept="image/*"
                  ref={(el: HTMLInputElement | null) => {
                    fileInputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleFileChange(index, e, setFieldValue)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="bg-gray-100 rounded-full p-4 mb-2">
                    <Camera size={28} />
                  </div>
                  <span className="text-sm font-medium">
                    {index === 0 ? 'Primary Image*' : `Additional Image ${index}`}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Click to upload</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {errors.images && touched.images && (
        <div className="text-red-500 text-sm mt-1">{errors.images}</div>
      )}
    </div>
  );
};

export default ImagesTimingForm;