import { useEffect, useState } from "react";
import RegisterMap from "../map/map";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';
import createAxios from "../../../service/axiousServices/restaurantAxious";
import { useNavigate } from "react-router-dom";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch } from "react-redux";


function RestaurntLocation() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [, setLocation] = useState(false);
    const [longitude, setLongitude] = useState(79.17271614074708);
    const [latitude, setLatitude] = useState(23.226390067116835);

    const axiosInstance = createAxios()

    const handleGeolocation = (lat: number, lng: number, status: any) => {
        setLocation(status);
        setLongitude(lng);
        setLatitude(lat);
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
    };

    console.log('restidddd', localStorage.getItem('restaurantId'));


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
                console.log(values);

                const restaurantId = localStorage.getItem("restaurantId");




                const { data } = await axiosInstance.post(
                    `/location?restaurantId=${restaurantId}`,
                    values,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log(data, 'is on the restaurnt location page');


                if (data?.success === true) {
                    toast.success("Location updated successfully!");
                    setTimeout(() => {
                        localStorage.removeItem("restaurantId");
                        navigate("/restaurant-login");
                    }, 2000);
                } else {
                    toast.error(data?.message || "Something went wrong, please try again.");
                }

            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setSubmitting(false);

            }
        },
    });

    // Handle getting current location with high accuracy
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            // toast.error("Geolocation is not supported by your browser");
            alert("Geolocation is not supported by your browser");
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

            // Validate and submit
            await formik.validateForm();
            if (!Object.keys(formik.errors).length) {
                await formik.submitForm();
            } else {
                // toast.error("Invalid location coordinates");
                alert("Invalid location coordinates");

            }
        };

        const errorCallback = (error: GeolocationPositionError) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    // toast.error("Please allow location access to use this feature");
                    alert("Please allow location access to use this feature");
                    break;
                case error.POSITION_UNAVAILABLE:
                    // toast.error("Location information is unavailable");
                    alert("Location information is unavailable");
                    break;
                case error.TIMEOUT:
                    // toast.error("The request to get location timed out");
                    alert("The request to get location timed out");
                    break;
                default:
                    // toast.error("An error occurred while getting location");
                    alert("An error occurred while getting location");
            }

        };

        // Use watchPosition to get continuous updates
        const watchId = navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options
        );

        // Stop watching after 15 seconds or on success
        setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
        }, 15000);
    };


    useEffect(() => {
        if (formik.errors.latitude || formik.errors.longitude) {
            // toast.error(formik.errors.latitude || formik.errors.longitude);
            alert(formik.errors.latitude || formik.errors.longitude);
        }
    }, [formik.errors]);

    return (
        <>
            {/* <div className="driver-registration-container h-screen flex justify-center items-center">
                <div className="w-5/6 md:w-4/6 md:h-4/5 md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
                    <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
                        <div className="flex w-full justify-center pt-10 items-center">
                            <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-2 md:text-6xl user-signup-title">
                                Choose your Location!
                            </h1>
                        </div>
                        <h1 className="text-blue-800 text-sm mt-3 mx-7 md:mx-0 md:text-sm md:max-w-sm md:mt-3 user-signup-title">
                            Select your preferred location to enhance navigation and provide efficient service to your passengers.
                        </h1>
                    </div>
                    <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="user-signup-form driver-signup-map-form w-full h-full md:w-96 md:h-96 rounded-md drop-shadow-xl">
                                <div className="mb-4 mt-4">
                                    <RegisterMap
                                        latitude={latitude}
                                        longitude={longitude}
                                        onLocationChange={handleGeolocation}
                                    />
                                </div>
                            </div>
                            <div className="flex mt-6 justify-evenly">
                                <div className="w-1/2 py-2.5 px-3 mr-1 flex justify-center items-center bg-blue-800 rounded-2xl">
                                    <button
                                        onClick={handleGetCurrentLocation}
                                        type="button"
                                        className="w-full text-sm text-golden font-normal"
                                    >
                                        Get Current Location
                                    </button>
                                </div>
                                <div className="w-1/2 ml-1 px-3 flex justify-center items-center bg-blue-800 rounded-2xl">
                                    <button
                                        type="submit"
                                        className="w-full text-sm text-golden font-normal"
                                    >
                                        Choose this location
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}

            <div className="driver-registration-container min-h-screen flex justify-center items-center bg-gray-50 py-4">
                <div className="w-11/12 md:w-4/5 lg:w-4/5 md:h-auto lg:h-4/5 md:flex justify-between bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Left side - Content */}
                    <div className="relative md:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-12">
                        <div className="text-center md:text-left">
                            <h1 className="text-blue-800 font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-4">
                                Choose your Location!
                            </h1>
                            <p className="text-blue-700/80 text-sm sm:text-base lg:text-lg max-w-md mx-auto md:mx-0">
                                Select your preferred location to enhance navigation and provide efficient service to your passengers.
                            </p>
                        </div>

                        {/* Decorative elements */}
                        <div className="hidden md:block absolute -bottom-16 -left-16 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
                        <div className="hidden md:block absolute top-10 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
                    </div>

                    {/* Right side - Map & Form */}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center">
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-md">
                            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                                <div className="aspect-square w-full max-w-md max-h-96">
                                    <RegisterMap
                                        latitude={latitude}
                                        longitude={longitude}
                                        onLocationChange={handleGeolocation}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <button
                                    onClick={handleGetCurrentLocation}
                                    type="button"
                                    className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-700 transition-colors rounded-xl flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-amber-400 font-medium">Get Current Location</span>
                                </button>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-700 transition-colors rounded-xl flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-amber-400 font-medium">Choose this location</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RestaurntLocation;


