import { Field } from 'formik';
import { PricingQuantityFormProps } from '../../../interfaces/restaurant/menu/pricing-quantity-form.types';

const PricingQuantityForm: React.FC<PricingQuantityFormProps> = ({ values, errors, touched }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
        <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
        Pricing & Quantity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)*</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">₹</span>
            <Field
              name="price"
              type="number"
              min="0"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
              placeholder="0.00"
            />
          </div>
          {errors.price && touched.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available</label>
          <Field
            name="quantity"
            type="number"
            min="0"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
            placeholder="0"
          />
          {errors.quantity && touched.quantity && (
            <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingQuantityForm;