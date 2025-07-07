import { Info, User, Phone, MapPin, Bike, AlertCircle, Clock, Calendar } from 'lucide-react';
import { DeliveryBoyDetailsOverviewProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsOverview = ({ deliveryBoy, formatDate, getStatusBadge, getOnlineBadge }: DeliveryBoyDetailsOverviewProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <Info className="mr-2 h-5 w-5 text-orange-500" />
                        Delivery Partner Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and status.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: User, label: 'Full Name', value: deliveryBoy.name },
                            { icon: Phone, label: 'Mobile', value: deliveryBoy.mobile },
                            { icon: MapPin, label: 'Zone', value: deliveryBoy.zone.name },
                            { icon: Bike, label: 'Vehicle', value: deliveryBoy.vehicle },
                            { icon: Clock, label: 'Status', value: deliveryBoy.status },
                            { icon: Calendar, label: 'Joined', value: formatDate(deliveryBoy.createdAt) },
                        ].map((item, index) => (
                            <div key={index} className="flex group hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
                                <div className="flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-orange-400 group-hover:text-orange-500 transition-colors duration-200" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
                                    <p className="mt-1 text-sm text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {deliveryBoy.isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Rejection Reason</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{deliveryBoy.rejectionReason}</p>
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