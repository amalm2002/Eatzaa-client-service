import { ChefHat, Store, Utensils, CheckCircle } from "lucide-react";

const RegisterSidebar = () => {
  return (
    <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-800 text-white flex flex-col justify-center items-center p-6 py-10 relative">
      <div className="absolute top-4 left-4 flex items-center">
        <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mr-2" />
        <span className="font-extrabold text-lg md:text-xl">Eatzaa</span>
      </div>

      <div className="absolute opacity-10 right-0 top-0 hidden md:block">
        <Utensils className="w-64 h-64 text-white" />
      </div>

      <div className="z-10 max-w-md">
        <Store className="w-16 h-16 md:w-20 md:h-20 text-orange-300 mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
          Eatzaaa
        </h1>
        <p className="mt-4 text-center text-base md:text-lg text-gray-100">
          The ultimate platform for restaurant owners to showcase their culinary creations and manage their business with elegance.
        </p>

        <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 bg-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm">
          <h3 className="font-semibold text-lg md:text-xl mb-2">Why Join Us?</h3>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-sm md:text-base">Secure and intuitive restaurant management</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-sm md:text-base">Beautifully showcase your menu offerings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-sm md:text-base">Insightful analytics to grow your business</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-sm md:text-base">Connect with food lovers in your area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSidebar;