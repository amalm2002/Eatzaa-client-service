import { RestaurantDetailsTabsProps } from "../../../../interfaces/admin/restaurants/restaurant-details.types";

const RestaurantDetailsTabs = ({ activeTab, setActiveTab }: RestaurantDetailsTabsProps) => {
  return (
    <div className="border-b border-gray-200 sticky top-0 bg-white z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto py-4 gap-8">
          {['overview', 'documents', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap font-semibold text-sm uppercase tracking-wide pb-2 px-1 transition-all ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsTabs;