import { StatusCardProps } from '../../../interfaces/delivery-boy/dashboard/status-card.types';

const StatusCard = ({ isOnline, isInZone, zoneMessage, partnerData, handleToggleOnline, cashLimitStatus, handlePayInHandCash }: StatusCardProps) => {
  const isCashLimitExceeded = !cashLimitStatus.success;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-1 text-gray-800">Delivery Partner Status</h3>
          <p className={`font-medium ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            You are currently {isOnline ? 'Online' : 'Offline'}
          </p>
          {isOnline && (
            <p className="text-sm text-gray-500 mt-1">You've been online for {partnerData.loginHours} hours today</p>
          )}
          {zoneMessage && <p className="text-sm text-gray-500 mt-1">{zoneMessage}</p>}
          {isCashLimitExceeded && (
            <p className="text-sm text-red-500 mt-1">{cashLimitStatus.message}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleToggleOnline}
            disabled={isCashLimitExceeded || !isInZone} 
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-100 ${
              isOnline ? 'bg-green-500' : isCashLimitExceeded || !isInZone ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                isOnline ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-500 mt-2">{isOnline ? 'Go Offline' : 'Go Online'}</span>
          {isCashLimitExceeded && (
            <button
              onClick={handlePayInHandCash}
              className="mt-2 bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-100"
            >
              Pay In-Hand Cash
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;