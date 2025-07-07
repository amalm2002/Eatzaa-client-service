import { Header } from "../../../../pages/admin/header/header";
import { DeliveryBoyDetailsHeaderProps } from "../../../../interfaces/admin/delivery-boys/delivery-boy-details.types";
import { Bike, MapPin, Check, X } from 'lucide-react';

const DeliveryBoyDetailsHeader = ({ deliveryBoy, getStatusBadge, getOnlineBadge, handleVerify, handleReject, showRejectModal, setShowRejectModal }: DeliveryBoyDetailsHeaderProps) => {
    return (
        <div className="bg-gradient-to-br from-orange-50 via-white to-gray-100">
            <Header />
            <div className="pt-20 sm:pt-24 max-w-[90rem] mx-auto p-4 sm:p-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow">
                                <img
                                    src={deliveryBoy.profileImage}
                                    alt={deliveryBoy.name}
                                    className="h-full w-full object-cover"
                                />
                                {deliveryBoy.isOnline && (
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                                )}
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">{deliveryBoy.name}</h1>
                                <div className="ml-3 flex space-x-2">
                                    {getStatusBadge()}
                                    {getOnlineBadge()}
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Bike className="mr-1 h-4 w-4 text-orange-500" />
                                <span className="mr-3">{deliveryBoy.vehicle}</span>
                                <MapPin className="mr-1 h-4 w-4 text-orange-500" />
                                <span>{deliveryBoy.zone.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        {!deliveryBoy.isVerified && !deliveryBoy.isRejected ? (
                            <>
                                <button
                                    onClick={handleVerify}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                                >
                                    <Check className="mr-2 h-4 w-4" /> Verify Partner
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                                >
                                    <X className="mr-2 h-4 w-4" /> Reject Partner
                                </button>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md">
                                {deliveryBoy.isVerified ? 'Partner Verified' : 'Partner Rejected'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryBoyDetailsHeader;