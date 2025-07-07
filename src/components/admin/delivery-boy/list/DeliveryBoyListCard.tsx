import { FiLock, FiUnlock } from 'react-icons/fi';
import { DeliveryBoyListCardProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy.types';

const DeliveryBoyListCard = ({ boy, handleView, handleBlockUnblock }: DeliveryBoyListCardProps) => {
  return (
    <div
      key={boy.id}
      className="p-5 bg-white rounded-xl shadow-md mb-4 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shadow-sm">
            {boy.image ? (
              <img src={boy.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-orange-700 text-lg font-bold">{boy.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">{boy.name}</div>
            <div className="text-xs text-gray-600">{boy.totalDeliveries} Deliveries</div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${boy.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}
        >
          {boy.status.charAt(0).toUpperCase() + boy.status.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
        <div>
          <div className="text-gray-500 text-xs font-medium">Email</div>
          <div className="font-medium">{boy.email}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs font-medium">Contact</div>
          <div className="font-medium">{boy.mobile}</div>
        </div>
        <div className="col-span-2">
          <div className="text-gray-500 text-xs font-medium">Location</div>
          <div className="font-medium">{boy.location}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleView(boy.id)}
          className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transform hover:scale-105 transition-all"
        >
          View
        </button>
        <button
          onClick={() => handleBlockUnblock(boy.id, boy.isActive)}
          className={`p-2 ${boy.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'} rounded-full shadow-sm transform hover:scale-110 transition-all`}
        >
          {boy.isActive ? <FiLock size={20} /> : <FiUnlock size={20} />}
        </button>
      </div>
    </div>
  );
};

export default DeliveryBoyListCard;