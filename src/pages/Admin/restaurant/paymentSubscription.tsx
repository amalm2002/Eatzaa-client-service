
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../header/header';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

const SubscriptionPlanManagementPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: '',
    description: '',
    features: '',
    popular: false,
  });
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [sortField, setSortField] = useState<keyof Plan>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const dispatch = useDispatch();
  const axiosInstance = createAxios(dispatch);
  // const navigate = useNavigate();


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/getSubscriptionPlans');
        // console.log('API yyyy Response:', response.data);

        if (response.data.message === 'success') {

          const plans: Plan[] = response.data.response.map((plan: any) => ({
            id: plan._id || plan.id,
            name: plan.name,
            price: `₹${plan.price}`,
            period: plan.period,
            description: plan.description,
            features: plan.features,
            popular: plan.popular,
          }));
          setPlans(plans);
        } else {
          toast.error('Failed to load plans');
        }
      } catch (error) {
        toast.error('Error fetching plans');
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name) errors.name = 'Plan name is required';
    if (!formData.price || !/^\₹?\d+$/.test(formData.price)) errors.price = 'Valid price is required (e.g., ₹499)';
    if (!formData.period) errors.period = 'Period is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.features) errors.features = 'At least one feature is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // console.log(formData,'fromadata');

      const newPlan: Plan = {
        id: String(plans.length + 1),
        name: formData.name,
        price: formData.price,
        period: formData.period,
        description: formData.description,
        features: formData.features.split(',').map((f) => f.trim()),
        popular: formData.popular,
      };

      setPlans([...plans, newPlan]);
      // console.log(newPlan);

      const response = await axiosInstance.post('/addSubscriptionPlan', newPlan);
      // console.log(response);

      if (response.data.message === 'success') {
        setPlans([...plans, response.data.plan]);
      }

      setFormData({ name: '', price: '', period: '', description: '', features: '', popular: false });
      setFormErrors({});
      toast.success('Plan added successfully');
    } catch (error) {
      toast.error('Error adding plan');
      console.error('Error adding plan:', error);
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan || !validateForm()) return;

    try {
      const updatedPlan: Plan = {
        ...editPlan,
        name: formData.name,
        price: formData.price,
        period: formData.period,
        description: formData.description,
        features: formData.features.split(',').map((f) => f.trim()),
        popular: formData.popular,
      };


      setPlans(plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));

      const response = await axiosInstance.put(
        `/updateSubscriptionPlan/${updatedPlan.id}`,
        updatedPlan
      );
      // console.log(response);

      if (response.data.message === 'success') {
        const normalizedPlan: Plan = {
          id: response.data.plan._id || response.data.plan.id,
          name: response.data.plan.name,
          price: `₹${response.data.plan.price}`,
          period: response.data.plan.period,
          description: response.data.plan.description,
          features: response.data.plan.features,
          popular: response.data.plan.popular,
        };
        setPlans(plans.map((p) => (p.id === updatedPlan.id ? normalizedPlan : p)));
      }

      setEditPlan(null);
      setFormData({
        name: '',
        price: '',
        period: '',
        description: '',
        features: '',
        popular: false,
      });
      setFormErrors({});
      toast.success('Plan updated successfully');
    } catch (error) {
      toast.error('Error updating plan');
      console.error('Error updating plan:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {

      setPlans(plans.filter((p) => p.id !== id));

      const response = await axiosInstance.delete(`/deleteSubscriptionPlan/${id}`);

      console.log(response);

      if (response.data.message === 'success') {
        setPlans(plans.filter((p) => p.id !== id));
      }

      toast.success('Plan deleted successfully');
    } catch (error) {
      toast.error('Error deleting plan');
      console.error('Error deleting plan:', error);
    }
  };

  const handleSort = (field: keyof Plan) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPlans = plans.sort((a, b) => {
    if (sortField === 'price') {
      const aPrice = parseInt(a.price.replace('₹', ''));
      const bPrice = parseInt(b.price.replace('₹', ''));
      return sortDirection === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    }
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100">
      <div className="flex-1 flex flex-col w-full">
        <Header />
        <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
                Subscription Plans
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Manage subscription plans for your restaurant network
              </p>
            </div>
            {/* <button
              onClick={() => {
                setEditPlan(null);
                setFormData({ name: '', price: '', period: '', description: '', features: '', popular: false });
                setFormErrors({});
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md transform hover:scale-105 transition-all"
            >
              <FiPlus className="inline-block mr-2" size={20} />
              Add New Plan
            </button> */}
          </div>

          {/* Add/Edit Plan Form */}
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

          {/* Plan List */}
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
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPlanManagementPage;