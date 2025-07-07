import { DeliveryBoyDetailsTabsProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-details.types";

const DeliveryBoyDetailsTabs = ({ activeTab, setActiveTab }: DeliveryBoyDetailsTabsProps) => {
    return (
        <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {['overview', 'documents', 'personal'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                    border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
                    ${activeTab === tab
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                            aria-current={activeTab === tab ? 'page' : undefined}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default DeliveryBoyDetailsTabs;