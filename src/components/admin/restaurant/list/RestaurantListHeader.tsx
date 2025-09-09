import { Header } from "../../../../pages/A/header/header";

const RestaurantListHeader = () => {
    return (
        <>
            <Header />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-in fade-in duration-300">
                        Restaurants
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-2">
                        Explore and manage your restaurant network with ease
                    </p>
                </div>
            </div>
        </>
    );
};

export default RestaurantListHeader;