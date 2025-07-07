const Sidebar = () => {
    return (
        <div className="hidden md:flex flex-1 bg-[rgb(60,110,113)] text-white p-12 flex-col justify-center items-center h-full">
            <h2 className="text-4xl font-bold tracking-tight animate-fadeIn">FoodHub</h2>
            <h3 className="text-2xl mt-3 font-semibold">Taste Excellence</h3>
            <p className="mt-6 text-center text-lg max-w-xs animate-slideUp">
                Reset your password and dive back into a world of delicious meals!
            </p>
            <ul className="mt-8 space-y-4 text-left">
                <li className="flex items-center text-lg animate-slideUp delay-100">
                    <span className="text-yellow-300 mr-3">✔</span> Seamless Ordering
                </li>
                <li className="flex items-center text-lg animate-slideUp delay-200">
                    <span className="text-yellow-300 mr-3">✔</span> Exclusive Offers
                </li>
                <li className="flex items-center text-lg animate-slideUp delay-300">
                    <span className="text-yellow-300 mr-3">✔</span> 24/7 Support
                </li>
            </ul>
            <div className="mt-10 text-sm text-center animate-slideUp delay-400">
                <p>📍 123 Gourmet Street, Foodville</p>
                <p>📞 +1 (555) 123-4567</p>
            </div>
        </div>
    );
};

export default Sidebar;