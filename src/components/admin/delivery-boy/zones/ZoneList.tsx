import { FiTrash2, FiMap } from 'react-icons/fi';
import { ZoneListProps } from '../../../../interfaces/admin/delivery-boys/zone.types';

const ZoneList = ({ paginatedZones, openDeleteModal }: ZoneListProps) => {
  return (
    <div className="space-y-4">
      {paginatedZones.map((zone) => (
        <div
          key={zone.id}
          className="relative p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-orange-400/20 via-orange-500/20 to-gray-200/20 group-hover:from-orange-500/30 group-hover:to-gray-300/30 rounded-xl transition-all duration-300" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900 text-xl tracking-tight">{zone.name}</div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <FiMap className="mr-1 text-orange-500" size={16} />
                <span className="font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  {zone.coordinates.length} Coordinates
                </span>
              </div>
            </div>
            <button
              onClick={() => openDeleteModal(zone.id)}
              className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {paginatedZones.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
          <FiMap className="mx-auto text-gray-400" size={40} />
          <p className="mt-4 text-gray-500 font-medium text-lg">No zones found</p>
          <p className="mt-2 text-gray-400 text-sm">Try adjusting your search or add a new zone.</p>
        </div>
      )}
    </div>
  );
};

export default ZoneList;