import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ZoneShiftPageProps } from "../../../../interfaces/delivery-boy/location/zone.types";
import { deliveryBoyApi } from "../../../../api/endpoints/deliveryBoyApi";

const ZoneShiftPage: React.FC<ZoneShiftPageProps> = ({ zone, setZone, shift, setShift, handleNavigation }) => {
    const [error, setError] = useState<string>('');
    const [zoneOptions, setZoneOptions] = useState<{ _id: string; name: string }[]>([]);

    const dispatch = useDispatch()
    const deliveryBoyId = localStorage.getItem('deliveryBoyId') ?? ''


    const shifts: string[] = ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'];

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const data = await deliveryBoyApi.fetchZones(dispatch);
                const formattedZones = data.fetchZones.map((zone: any) => ({
                    _id: zone._id,
                    name: zone.name,
                }));
                setZoneOptions(formattedZones);
            } catch (error: any) {
                console.log('this error has been show on the fecth zone side :', error);
                toast.error(error.message || 'Something went wrong');
            }
        }
        fetchZone()
    }, [])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (zone) {
            setError('');
            try {
                await deliveryBoyApi.submitZoneSelection(dispatch, deliveryBoyId, zone);
                handleNavigation('login');
            } catch (error: any) {
                toast.error(error.message || 'Error submitting zone selection');
            }
        } else {
            setError('Please select both a zone and a shift');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full">
            <button
                onClick={() => handleNavigation('vehicle')}
                className="mb-6 flex items-center text-orange-500 hover:text-orange-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Zone </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Delivery Zone
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {zoneOptions.map((z) => (
                            <button
                                key={z._id}
                                type="button"
                                onClick={() => setZone(z._id)}
                                className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all ${zone === z._id
                                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 hover:border-orange-300 text-gray-700'
                                    }`}
                            >
                                {z.name}
                            </button>
                        ))}
                    </div>
                    {error && !zone && <p className="text-red-500 text-xs mt-1">Please select a zone</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ZoneShiftPage