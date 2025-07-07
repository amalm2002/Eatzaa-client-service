import { Header } from "../../../../pages/admin/header/header";

const SubscriptionPlanHeader = () => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
            Subscription Plans
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage subscription plans for your restaurant network
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlanHeader;