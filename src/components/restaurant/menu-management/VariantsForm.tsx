import { Check, Plus } from 'lucide-react';
import { VariantsFormProps } from '../../../interfaces/restaurant/menu/variants-form.types';

const VariantsForm: React.FC<VariantsFormProps> = ({ values, setFieldValue, openVariantModal, removeVariant }) => {
  const toggleVariants = () => {
    setFieldValue('hasVariants', !values.hasVariants);
    if (!values.hasVariants) setFieldValue('variants', []);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="w-1.5 h-8 bg-[#6589f6] rounded mr-3"></span>
          Variants
        </h2>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 mr-3">Enable Variants</span>
          <button
            type="button"
            onClick={toggleVariants}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
              values.hasVariants ? 'bg-[#6589f6]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                values.hasVariants ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {values.hasVariants && (
        <>
          <div className="bg-[#6589f6]/5 rounded-xl p-5 mb-5 border border-[#6589f6]/10 flex items-start">
            <div className="text-[#6589f6] mr-3 mt-1">
              <Check size={18} />
            </div>
            <div className="text-sm text-[#6589f6]">
              <p className="font-medium">Variants enabled</p>
              <p className="mt-1">Add different size options, add-ons, or customizations for this menu item.</p>
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openVariantModal('new')}
              className="bg-white border border-[#6589f6] text-[#6589f6] px-5 py-2.5 rounded-lg flex items-center hover:bg-[#6589f6]/5 transition-all font-medium"
            >
              <Plus size={18} className="mr-1" /> Add Custom Variant
            </button>
            <button
              type="button"
              onClick={() => openVariantModal('existing')}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg flex items-center hover:bg-gray-50 transition-all font-medium"
            >
              <Plus size={18} className="mr-1" /> Add Existing Variant
            </button>
          </div>
          {values.variants.length > 0 ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (₹)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {values.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        {variant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{variant.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id, setFieldValue, values)}
                          className="text-red-500 hover:text-red-700 transition-all"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Plus size={28} className="text-gray-400" />
                </div>
              </div>
              <p className="font-medium">No variants added yet</p>
              <p className="text-sm mt-1">Add variants for different sizes, options, etc.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VariantsForm;