import { Field } from 'formik';
import { BasicInfoFormProps } from '../../../interfaces/restaurant/menu/basicInfo-form.types';

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ values, errors, touched, setFieldValue }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
        <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
        Basic Information
      </h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Item Name*</label>
        <Field
          name="name"
          type="text"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
          placeholder="e.g. Paneer Tikka Masala"
        />
        {errors.name && touched.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <Field
          name="description"
          as="textarea"
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
          placeholder="Describe your dish in detail"
        />
        {errors.description && touched.description && (
          <div className="text-red-500 text-sm mt-1">{errors.description}</div>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
        <div className="grid grid-cols-3 gap-4">
          {(['veg', 'non-veg', 'drinks'] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFieldValue('category', category)}
              className={`py-3 px-4 rounded-lg border transition-all duration-300 ${
                values.category === category
                  ? 'bg-[#6589f6] text-white border-[#6589f6] shadow-lg'
                  : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
              } font-medium`}
            >
              {category === 'veg' && '🥬 '}
              {category === 'non-veg' && '🍗 '}
              {category === 'drinks' && '🥤 '}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        {errors.category && touched.category && (
          <div className="text-red-500 text-sm mt-1">{errors.category}</div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;