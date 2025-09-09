import { Header } from "../../../../pages/admin/header/header";

const DeliveryBoyListHeader = () => {
  return (
    <>
      <Header />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
            Delivery Boys
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage your delivery team efficiently
          </p>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyListHeader;