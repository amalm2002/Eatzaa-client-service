import { useState } from "react";
import RegisterMap from "../map/map";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';
import { useDispatch } from "react-redux";
import 'mapbox-gl/dist/mapbox-gl.css';
import { DeliveryBoyLocationProps } from "../../../../interfaces/delivery-boy/location/location.types";
import { deliveryBoyApi } from "../../../../api/endpoints/deliveryBoyApi";

const DeliveryBoyLocation: React.FC<DeliveryBoyLocationProps> = ({ handleNavigation }) => {

    const dispatch = useDispatch();
    const [locationStatus, setLocationStatus] = useState<boolean>(false);
    const [longitude, setLongitude] = useState<number>(79.17271614074708);
    const [latitude, setLatitude] = useState<number>(23.226390067116835);

    const deliveryBoyId = localStorage.getItem('deliveryBoyId') ?? ''

    const handleGeolocation = (lat: number, lng: number, status: boolean): void => {
        setLocationStatus(status);
        setLongitude(lng);
        setLatitude(lat);
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
    };

    const formik = useFormik({
        initialValues: {
            latitude: latitude,
            longitude: longitude,
        },
        validationSchema: Yup.object({
            latitude: Yup.number()
                .min(8.4, "Choose a valid location in India")
                .max(37.6, "Choose a valid location in India"),
            longitude: Yup.number()
                .min(68.7, "Choose a valid location in India")
                .max(97.25, "Choose a valid location in India"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const data = await deliveryBoyApi.submitDeliveryBoyLocation(dispatch, deliveryBoyId, values);
                toast.success("Location updated successfully!");
                setTimeout(() => {
                    // localStorage.removeItem("deliveryBoyId");
                    handleNavigation('details');
                }, 2000);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleGetCurrentLocation = (): void => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        };

        const successCallback = async (position: GeolocationPosition) => {
            const newLat = position.coords.latitude;
            const newLng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log("Current Location:", { newLat, newLng, accuracy });

            formik.setFieldValue("latitude", newLat);
            formik.setFieldValue("longitude", newLng);
            setLatitude(newLat);
            setLongitude(newLng);

            await formik.validateForm();
            if (!Object.keys(formik.errors).length) {
                await formik.submitForm();
            } else {
                toast.error("Invalid location coordinates");
            }
        };

        const errorCallback = (error: GeolocationPositionError) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    toast.error("Please allow location access to use this feature");
                    break;
                case error.POSITION_UNAVAILABLE:
                    toast.error("Location information is unavailable");
                    break;
                case error.TIMEOUT:
                    toast.error("The request to get location timed out");
                    break;
                default:
                    toast.error("An error occurred while getting location");
            }
        };

        const watchId = navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options
        );

        setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
        }, 15000);
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full">
            <button
                onClick={() => handleNavigation('otp')}
                className="mb-6 flex items-center text-orange-500 hover:text-orange-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Choose Your Location</h2>
                <p className="text-gray-500 mt-2">
                    Select your preferred location for efficient delivery service.
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="aspect-square w-full max-w-md max-h-96">
                        <RegisterMap
                            latitude={latitude}
                            longitude={longitude}
                            onLocationChange={handleGeolocation}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleGetCurrentLocation}
                        type="button"
                        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition duration-150 ease-in-out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Get Current Location</span>
                    </button>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition duration-150 ease-in-out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Choose this Location</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeliveryBoyLocation;