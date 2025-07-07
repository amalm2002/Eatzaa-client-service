import { CartResetPopupProps } from "../../../interfaces/user/foodList/cart-reset-popup.types";

const CartResetPopup = ({ showPopup, handleCancel, handleResetCart }: CartResetPopupProps) => {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mb-10">
        <h3 className="text-lg font-bold mb-2">Items already in cart</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your cart contains items from another restaurant. Would you like to reset
          your cart for adding items from this restaurant?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            NO
          </button>
          <button
            onClick={handleResetCart}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            YES, START AFRESH
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartResetPopup;