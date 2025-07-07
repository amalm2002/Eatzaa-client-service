import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { VariantModalProps } from '../../../interfaces/restaurant/menu/variant-modal.types';
import { Variant } from '../../../interfaces/restaurant/menu/variant.types';
import { restaurantApi } from '../../../api/endpoints/restaurantApi';

const VariantModal: React.FC<VariantModalProps> = ({
  mode,
  newVariant,
  setNewVariant,
  setShowVariantModal,
  setFieldValue,
  values,
  selectedExistingVariant,
  setSelectedExistingVariant,
}) => {
  const dispatch = useDispatch();
  const [existingVariants, setExistingVariants] = useState<Variant[]>([]);

   useEffect(() => {
    if (mode === 'existing') {
      const fetchExistingVariants = async () => {
        try {
          const variants = await restaurantApi.fetchExistingVariants(dispatch);
          setExistingVariants(variants);
        } catch (error: any) {
          console.error('Error fetching existing variants:', error);
          toast.error(error.message);
        }
      };
      fetchExistingVariants();
    }
  }, [mode, dispatch]);

  const handleAddCustomVariant = () => {
    if (!newVariant.name.trim() || newVariant.price <= 0) {
      toast.error('Please provide a valid variant name and price.');
      return;
    }
    setFieldValue('variants', [...values.variants, newVariant]);
    setNewVariant({ id: Date.now().toString(), name: '', price: 0 });
    setShowVariantModal(false);
    toast.success('Custom variant added successfully!');
  };

  const handleAddExistingVariant = () => {
    const selectedVariant = existingVariants.find((v) => v.id === selectedExistingVariant);
    if (!selectedVariant) {
      toast.error('Please select a variant.');
      return;
    }
    if (!values.variants.some((v) => v.id === selectedVariant.id)) {
      setFieldValue('variants', [...values.variants, selectedVariant]);
      toast.success('Existing variant added successfully!');
    } else {
      toast.error('This variant is already added.');
    }
    setSelectedExistingVariant('');
    setShowVariantModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Plus size={20} className="mr-2 text-[#6589f6]" />
            {mode === 'new' ? 'Add Custom Variant' : 'Add Existing Variant'}
          </h3>
          <button
            onClick={() => setShowVariantModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {mode === 'new' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name*</label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                placeholder="e.g. Large"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowVariantModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomVariant}
                className="px-4 py-2 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all flex items-center font-medium"
              >
                <Plus size={18} className="mr-1" /> Add Variant
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Variant*</label>
              <select
                value={selectedExistingVariant}
                onChange={(e) => setSelectedExistingVariant(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6589f6] transition-all bg-gray-50"
              >
                <option value="">Select a variant</option>
                {existingVariants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name} (₹{variant.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowVariantModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExistingVariant}
                className="px-4 py-2 bg-[#6589f6] text-white rounded-lg hover:bg-[#5578e5] transition-all flex items-center font-medium"
              >
                <Plus size={18} className="mr-1" /> Add Variant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantModal;