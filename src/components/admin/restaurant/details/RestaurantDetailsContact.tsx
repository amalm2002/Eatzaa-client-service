import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { RestaurantDetailsContactProps } from '../../../../interfaces/admin/restaurants/restaurant-details.types';

const RestaurantDetailsContact = ({ restaurant }: RestaurantDetailsContactProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <Phone className="w-6 h-6 mr-3 text-orange-600 animate-pulse" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Mail, color: 'orange', title: 'Email Address', value: restaurant.email },
            { icon: Phone, color: 'orange', title: 'Phone Number', value: restaurant.mobile },
          ].map((item, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className={`bg-orange-100 p-3 rounded-full shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-6 h-6 text-orange-600`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{item.value}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md`}>Contact</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <MapPin className="w-6 h-6 mr-3 text-orange-600 animate-pulse" />
          Restaurant Location
        </h2>
        <div className="mb-8">
          <div className="h-72 bg-gradient-to-br from-orange-50 to-gray-100 rounded-2xl overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center animate-bounce">
                <MapPin className="h-16 w-16 text-orange-500 mx-auto" />
                <p className="mt-3 text-sm text-gray-700 font-semibold">Map Preview</p>
              </div>
              <div className="absolute bottom-6 right-6">
                <a
                  href={`https://maps.google.com/?q=${restaurant.location.latitude},${restaurant.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all flex items-center"
                >
                  Open in Maps <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Address', value: restaurant.location.address },
            { label: 'Latitude', value: restaurant.location.latitude },
            { label: 'Longitude', value: restaurant.location.longitude },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-xl p-5 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-sm text-orange-600 font-semibold mb-2">{item.label}</h3>
              <p className="text-gray-900 font-bold text-lg tracking-wide">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsContact;