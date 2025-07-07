export interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
}


export interface SubscriptionPlanFormProps {
    formData: {
        name: string;
        price: string;
        period: string;
        description: string;
        features: string;
        popular: boolean;
    };
    setFormData: (data: {
        name: string;
        price: string;
        period: string;
        description: string;
        features: string;
        popular: boolean;
    }) => void;
    formErrors: { [key: string]: string };
    editPlan: Plan | null;
    handleAddPlan: (e: React.FormEvent) => void;
    handleEditPlan: (e: React.FormEvent) => void;
    setEditPlan: (plan: Plan | null) => void;
    setFormErrors: (errors: { [key: string]: string }) => void;
}

export interface SubscriptionPlanListProps {
    sortedPlans: Plan[];
    sortField: keyof Plan;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof Plan) => void;
    handleDeletePlan: (id: string) => void;
    setEditPlan: (plan: Plan | null) => void;
    setFormData: (data: {
        name: string;
        price: string;
        period: string;
        description: string;
        features: string;
        popular: boolean;
    }) => void;
}
