import { SubscriptionPlanFormProps } from "../../../../interfaces/admin/restaurants/restaurant-subscription.types";

const SubscriptionPlanForm = ({
  formData,
  setFormData,
  formErrors,
  editPlan,
  handleAddPlan,
  handleEditPlan,
  setEditPlan,
  setFormErrors,
}: SubscriptionPlanFormProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {editPlan ? 'Edit Plan' : 'Add New Plan'}
      </h2>
      <form onSubmit={editPlan ? handleEditPlan : handleAddPlan} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
          <input
            type="text"
            className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Monthly Plan"
          />
          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="text"
            className={`w-full px-4 py-3 border ${formErrors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700`}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g., ₹499"
          />
          {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <input
            type="text"
            className={`w-full px-4 py-3 border ${formErrors.period ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700`}
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g., per month"
          />
          {formErrors.period && <p className="text-red-500 text-xs mt-1">{formErrors.period}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            className={`w-full px-4 py-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700`}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Perfect for trying our delicious meals"
          />
          {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
          <textarea
            className={`w-full px-4 py-3 border ${formErrors.features ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700`}
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            placeholder="e.g., All menu items, Free delivery, Customer support"
            rows={4}
          />
          {formErrors.features && <p className="text-red-500 text-xs mt-1">{formErrors.features}</p>}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-200 rounded"
            checked={formData.popular}
            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
          />
          <label className="ml-3 text-sm font-medium text-gray-700">Mark as Popular</label>
        </div>
        <div className="md:col-span-2 flex justify-end gap-4">
          {editPlan && (
            <button
              type="button"
              onClick={() => {
                setEditPlan(null);
                setFormData({ name: '', price: '', period: '', description: '', features: '', popular: false });
                setFormErrors({});
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md transform hover:scale-105 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all"
          >
            {editPlan ? 'Update Plan' : 'Add Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPlanForm;