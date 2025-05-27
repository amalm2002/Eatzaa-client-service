import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import createAxios from "../../../../service/axiousServices/deliveryBoyAxious";

type Page = 'login' | 'otp' | 'details' | 'vehicle' | 'zone' | 'location' | 'resubmit';


interface ZoneShiftPageProps {
    zone: string;
    setZone: React.Dispatch<React.SetStateAction<string>>;
    shift: string;
    setShift: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
}

const ZoneShiftPage: React.FC<ZoneShiftPageProps> = ({ zone, setZone, shift, setShift, handleNavigation }) => {
    const [error, setError] = useState<string>('');
    const [zoneOptions, setZoneOptions] = useState<{ _id: string; name: string }[]>([]);


    const dispatch = useDispatch()
    const axiosInstance = createAxios(dispatch)
    // const deliveryBoyId = useSelector((store: { deliveryBoyAuth: { delivery_boy_id: string } }) => store.deliveryBoyAuth.delivery_boy_id)
    const deliveryBoyId = localStorage.getItem('deliveryBoyId')


    // const zones: string[] = ['Downtown', 'Midtown', 'Uptown', 'Suburbs'];
    const shifts: string[] = ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'];

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const response = await axiosInstance.get('/get-zone')
                console.log('fetch zone :', response);
                const formattedZones = response.data.fetchZones.map((zone: any) => ({
                    _id: zone._id,
                    name: zone.name,
                }));
                setZoneOptions(formattedZones);

            } catch (error: any) {
                console.log('this error has been show on the fecth zone side :', error);
                toast.error(error.response.data.message || 'Somthing went wrong')
            }
        }

        fetchZone()
    }, [])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if (zone && shift) {
        if (zone) {
            setError('');
            console.log('Form submitted:', { zone });

            const { data } = await axiosInstance.post(`/zone?deliveryBoyId=${deliveryBoyId}`,{zone})

            console.log('response data :', data);


            handleNavigation('login');
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

            {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Zone & Shift</h2> */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Zone </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Delivery Zone
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* {zones.map((z) => (
                            <button
                                key={z}
                                type="button"
                                onClick={() => setZone(z)}
                                className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all ${zone === z
                                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 hover:border-orange-300 text-gray-700'
                                    }`}
                            >
                                {z}
                            </button>
                        ))} */}
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

                {/* <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Preferred Shift
                    </label>
                    <div className="space-y-2">
                        {shifts.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setShift(s)}
                                className={`w-full py-3 px-4 border-2 rounded-xl text-sm font-medium text-left transition-all ${shift === s
                                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 hover:border-orange-300 text-gray-700'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    {error && !shift && <p className="text-red-500 text-xs mt-1">Please select a shift</p>}
                </div> */}

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