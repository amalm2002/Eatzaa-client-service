export interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
}

export interface PlansSectionProps {
    plans: Plan[];
    loading: boolean;
    selectedPlan: string | null;
    handleRazorpayCheckout: (planId: string) => void;
}
