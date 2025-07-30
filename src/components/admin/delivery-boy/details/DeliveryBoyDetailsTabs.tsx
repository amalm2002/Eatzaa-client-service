import { DeliveryBoyDetailsTabsProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-details.types";

const DeliveryBoyDetailsTabs = ({ activeTab, setActiveTab }: DeliveryBoyDetailsTabsProps) => {
    return (
        // <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        //         <nav className="flex space-x-8" aria-label="Tabs">
        //             {['overview', 'documents', 'personal'].map((tab) => (
        //                 <button
        //                     key={tab}
        //                     onClick={() => setActiveTab(tab)}
        //                     className={`
        //             border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
        //             ${activeTab === tab
        //                             ? 'border-orange-500 text-orange-600'
        //                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
        //           `}
        //                     aria-current={activeTab === tab ? 'page' : undefined}
        //                 >
        //                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
        //                 </button>
        //             ))}
        //         </nav>
        //     </div>
        // </div>
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {['overview', 'documents', 'personal'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                        border-b-2 py-4 px-1 text-sm font-medium transition-all duration-300 relative
                        ${activeTab === tab
                                    ? 'border-black text-black bg-gradient-to-t from-gray-50 to-transparent'
                                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-400 hover:bg-gray-50'}
                    `}
                            aria-current={activeTab === tab ? 'page' : undefined}
                        >
                            <span className="relative z-10">
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default DeliveryBoyDetailsTabs;