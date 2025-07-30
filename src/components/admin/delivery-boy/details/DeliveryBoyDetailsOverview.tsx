import { Info, User, Phone, MapPin, Bike, AlertCircle, Clock, Calendar } from 'lucide-react';
import { DeliveryBoyDetailsOverviewProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsOverview = ({ deliveryBoy, formatDate, getStatusBadge, getOnlineBadge }: DeliveryBoyDetailsOverviewProps) => {
    return (
        // <div className="space-y-6">
        //     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        //         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        //             <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
        //                 <Info className="mr-2 h-5 w-5 text-orange-500" />
        //                 Delivery Partner Information
        //             </h3>
        //             <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and status.</p>
        //         </div>
        //         <div className="px-4 py-5 sm:p-6">
        //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        //                 {[
        //                     { icon: User, label: 'Full Name', value: deliveryBoy.name },
        //                     { icon: Phone, label: 'Mobile', value: deliveryBoy.mobile },
        //                     { icon: MapPin, label: 'Zone', value: deliveryBoy.zone.name },
        //                     { icon: Bike, label: 'Vehicle', value: deliveryBoy.vehicle },
        //                     { icon: Clock, label: 'Status', value: deliveryBoy.status },
        //                     { icon: Calendar, label: 'Joined', value: formatDate(deliveryBoy.createdAt) },
        //                 ].map((item, index) => (
        //                     <div key={index} className="flex group hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
        //                         <div className="flex-shrink-0">
        //                             <item.icon className="h-6 w-6 text-orange-400 group-hover:text-orange-500 transition-colors duration-200" />
        //                         </div>
        //                         <div className="ml-3">
        //                             <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
        //                             <p className="mt-1 text-sm text-gray-900">{item.value}</p>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //     </div>

        //     {deliveryBoy.isRejected && (
        //         <div className="bg-red-50 border border-red-200 rounded-lg shadow overflow-hidden">
        //             <div className="px-4 py-5 sm:p-6">
        //                 <div className="flex items-center">
        //                     <div className="flex-shrink-0">
        //                         <AlertCircle className="h-5 w-5 text-red-400" />
        //                     </div>
        //                     <div className="ml-3">
        //                         <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
        //                         <div className="mt-2 text-sm text-red-700">
        //                             <p>{deliveryBoy.rejectionReason}</p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div className="space-y-8">
            <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl border border-gray-200">
                <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xl leading-7 font-semibold text-gray-900 flex items-center">
                        <Info className="mr-3 h-6 w-6 text-black" />
                        Delivery Partner Information
                    </h3>
                    <p className="mt-2 max-w-3xl text-base text-gray-600">Complete profile and operational details</p>
                </div>
                <div className="px-6 py-8 sm:px-8 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: User, label: 'Full Name', value: deliveryBoy.name },
                            { icon: Phone, label: 'Mobile', value: deliveryBoy.mobile },
                            { icon: MapPin, label: 'Zone', value: deliveryBoy.zone.name },
                            { icon: Bike, label: 'Vehicle', value: deliveryBoy.vehicle },
                            { icon: Clock, label: 'Status', value: deliveryBoy.status },
                            { icon: Calendar, label: 'Joined', value: formatDate(deliveryBoy.createdAt) },
                        ].map((item, index) => (
                            <div key={index} className="flex group hover:bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                                        <item.icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.label}</h3>
                                    <p className="mt-1 text-base font-semibold text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {deliveryBoy.isRejected && (
                <div className="bg-white border-l-4 border-black rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-6 sm:px-8">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Application Status: Rejected</h3>
                                <div className="mt-3 text-base text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="font-medium">Reason:</p>
                                    <p className="mt-1">{deliveryBoy.rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryBoyDetailsOverview;