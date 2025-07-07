import { OrderCardProps } from  '../../../interfaces/user/profile/order-history.types';

const OrderCard = ({ order, tealColor, handleViewOrderDetails }: OrderCardProps) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke={tealColor}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              {order.restaurantName}
              {order.status === 'delivered' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {order.status === 'processing' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l1.5 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {order.status === 'cancelled' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </h4>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(order.date).toLocaleDateString()} • Order #{order.id}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.status === 'processing'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="text-sm text-gray-900">
              <span className="font-semibold" style={{ color: tealColor }}>
                {item.quantity} ×
              </span>{' '}
              {item.name}
            </p>
            <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <p className="text-sm font-medium text-gray-500">Total</p>
        <p className="text-lg font-semibold" style={{ color: tealColor }}>
          ${order.total.toFixed(2)}
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => handleViewOrderDetails(order.id)}
          className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: tealColor }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default OrderCard;