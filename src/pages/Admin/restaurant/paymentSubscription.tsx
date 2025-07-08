import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import SubscriptionPlanHeader from '../../../components/admin/restaurant/subscription/SubscriptionPlanHeader';
import SubscriptionPlanForm from '../../../components/admin/restaurant/subscription/SubscriptionPlanForm';
import SubscriptionPlanList from '../../../components/admin/restaurant/subscription/SubscriptionPlanList';
import { Plan } from '../../../interfaces/admin/restaurants/restaurant-subscription.types';
import { adminApi } from '../../../api/endpoints/adminApi';

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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await adminApi.fetchSubscriptionPlans(dispatch);
        const plans: Plan[] = data.response.map((plan: any) => ({
          id: plan._id || plan.id,
          name: plan.name,
          price: `₹${plan.price}`,
          period: plan.period,
          description: plan.description,
          features: plan.features,
          popular: plan.popular,
        }));
        setPlans(plans);
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
      const newPlan = {
        name: formData.name,
        price: formData.price,
        period: formData.period,
        description: formData.description,
        features: formData.features.split(',').map((f) => f.trim()),
        popular: formData.popular,
      };
      const response = await adminApi.addSubscriptionPlan(dispatch, newPlan);
      const normalizedPlan: any = {
        id: response._id || response.id,
        name: response.name,
        price: `₹${response.price}`,
        period: response.period,
        description: response.description,
        features: response.features,
        popular: response.popular,
    };
    setPlans([...plans, normalizedPlan]);
    setFormData({ name: '', price: '', period: '', description: '', features: '', popular: false });
    setFormErrors({});
    toast.success('Plan added successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error adding plan');
    console.error('Error adding plan:', error);
  }
};

const handleEditPlan = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editPlan || !validateForm()) return;

  try {
    const updatedPlan = {
      name: formData.name,
      price: formData.price,
      period: formData.period,
      description: formData.description,
      features: formData.features.split(',').map((f) => f.trim()), // Ensure features is an array
      popular: formData.popular,
    };

    const response = await adminApi.updateSubscriptionPlan(dispatch, editPlan.id, updatedPlan);
    const normalizedPlan: any = {
      id: response.response._id || response.response.id,
      name: response.response.name,
      price: `₹${response.response.price}`,
      period: response.response.period,
      description: response.response.description,
      features: response.response.features,
      popular: response.response.popular,
    };
    setPlans(plans.map((p) => (p.id === editPlan.id ? normalizedPlan : p)));
    setEditPlan(null);
    setFormData({ name: '', price: '', period: '', description: '', features: '', popular: false });
    setFormErrors({});
    toast.success('Plan updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error updating plan');
    console.error('Error updating plan:', error);
  }
};

const handleDeletePlan = async (id: string) => {
  if (!window.confirm('Are you sure you want to delete this plan?')) return;

  try {
    setPlans(plans.filter((p) => p.id !== id));
    await adminApi.deleteSubscriptionPlan(dispatch, id);
    toast.success('Plan deleted successfully');
  } catch (error: any) {
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
      <main className="flex-1 p-6 mt-16 max-w-[90rem] mx-auto">
        <SubscriptionPlanHeader />
        <SubscriptionPlanForm
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          editPlan={editPlan}
          handleAddPlan={handleAddPlan}
          handleEditPlan={handleEditPlan}
          setEditPlan={setEditPlan}
          setFormErrors={setFormErrors}
        />
        <SubscriptionPlanList
          sortedPlans={sortedPlans}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleDeletePlan={handleDeletePlan}
          setEditPlan={setEditPlan}
          setFormData={setFormData}
        />
      </main>
    </div>
  </div>
);
};

export default SubscriptionPlanManagementPage;