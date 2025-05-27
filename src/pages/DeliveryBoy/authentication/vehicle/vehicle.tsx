import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createAxios from "../../../../service/axiousServices/deliveryBoyAxious";
import { toast } from "sonner";


type Page = 'login' | 'otp' | 'details' | 'vehicle' | 'zone' | 'location' | 'resubmit';

interface VehiclePageProps {
    vehicle: string;
    setVehicle: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
}

const VehiclePage: React.FC<VehiclePageProps> = ({ vehicle, setVehicle, handleNavigation }) => {

    const [error, setError] = useState<string>('');

    const dispatch = useDispatch()
    const axiosInstance = createAxios(dispatch)
    // const deliveryBoyId = useSelector((store: { deliveryBoyAuth: { delivery_boy_id: string } }) => store.deliveryBoyAuth.delivery_boy_id)
    const deliveryBoyId = localStorage.getItem('deliveryBoyId')


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (vehicle) {
            setError('');
            // console.log(vehicle, 'ddddddddddddtd');
            const { data } = await axiosInstance.post(`/vehicle?deliveryBoyId=${deliveryBoyId}`, { vehicle })
            // console.log('veccccccccccc :', data);
            if (data.success === true) {
                toast.success(data.message)
                handleNavigation('zone');
            }
        } else {
            setError('Please select a vehicle');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full">
            <button
                onClick={() => handleNavigation('details')}
                className="mb-6 flex items-center text-orange-500 hover:text-orange-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Vehicle</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setVehicle('bike')}
                        className={`relative h-40 flex flex-col items-center justify-center border-2 rounded-2xl transition-all ${vehicle === 'bike'
                            ? 'border-orange-500 bg-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-orange-300'
                            }`}
                    >
                        {vehicle === 'bike' && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zm-7-9V5m0 3H9m3 0h3m-8 2l2 2m8-2l-2 2m-6 0h8" />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-700">Motorcycle</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setVehicle('scooter')}
                        className={`relative h-40 flex flex-col items-center justify-center border-2 rounded-2xl transition-all ${vehicle === 'scooter'
                            ? 'border-orange-500 bg-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-orange-300'
                            }`}
                    >
                        {vehicle === 'scooter' && (
                            <div className="absolute top-3 right-3 bg-orange-500 text-white rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17a2 2 0 104 0 2 2 0 00-4 0zm14 0a2 2 0 104 0 2 2 0 00-4 0zm-7-7H8m4 0h4m-7 2l2 2m6-2l-2 2" />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-700">Scooter</span>
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                >
                    Continue
                </button>
            </form>
        </div>
    );
};

export default VehiclePage