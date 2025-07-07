import { FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { SubscriptionPlanListProps, Plan } from '../../../../interfaces/admin/restaurants/restaurant-subscription.types';

const SubscriptionPlanList = ({
  sortedPlans,
  sortField,
  sortDirection,
  handleSort,
  handleDeletePlan,
  setEditPlan,
  setFormData,
}: SubscriptionPlanListProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-gray-50 border-b border-gray-200">
            <tr>
              {[
                { field: 'name', label: 'Plan Name' },
                { field: 'price', label: 'Price' },
                { field: 'period', label: 'Period' },
                { field: 'popular', label: 'Popular' },
              ].map((header) => (
                <th
                  key={header.field}
                  className="px-8 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                  onClick={() => handleSort(header.field as keyof Plan)}
                >
                  <div className="flex items-center gap-2">
                    <span>{header.label}</span>
                    {sortField === header.field && (
                      sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPlans.map((plan) => (
              <tr
                key={plan.id}
                className="hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
              >
                <td className="px-8 py-4">
                  <div className="font-semibold text-gray-900 text-lg">{plan.name}</div>
                  <div className="text-sm text-gray-600">{plan.description}</div>
                </td>
                <td className="px-8 py-4 text-gray-700 font-medium">{plan.price}</td>
                <td className="px-8 py-4 text-gray-700">{plan.period}</td>
                <td className="px-8 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${plan.popular ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {plan.popular ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditPlan(plan);
                        setFormData({
                          name: plan.name,
                          price: plan.price,
                          period: plan.period,
                          description: plan.description,
                          features: plan.features.join(', '),
                          popular: plan.popular,
                        });
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full shadow-sm transform hover:scale-110 transition-all"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-100">
        {sortedPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-gray-900 text-lg">{plan.name}</div>
                <div className="text-xs text-gray-600">{plan.description}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${plan.popular ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {plan.popular ? 'Popular' : 'Standard'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
              <div>
                <div className="text-gray-500 text-xs font-medium">Price</div>
                <div className="font-medium">{plan.price}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium">Period</div>
                <div className="font-medium">{plan.period}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-xs font-medium">Features</div>
                <ul className="list-disc pl-5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditPlan(plan);
                  setFormData({
                    name: plan.name,
                    price: plan.price,
                    period: plan.period,
                    description: plan.description,
                    features: plan.features.join(', '),
                    popular: plan.popular,
                  });
                }}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlanList;