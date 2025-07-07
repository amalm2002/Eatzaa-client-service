import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { RetryPaymentButtonProps } from "../../../interfaces/restaurant/transaction/retry-payment.types";

const RetryPaymentButton: React.FC<RetryPaymentButtonProps> = ({ transaction, axiosInstance, navigate }) => {
  const [isRepaying, setIsRepaying] = useState(false);

  const handleRepayment = async () => {
    try {
      setIsRepaying(true);
      const response = await axiosInstance.post(`/payment/retry/${transaction._id}`);
      if (response.data.error) throw new Error(response.data.message || "Failed to initiate repayment");
      const { orderId, razorpayKey } = response.data;
      if (!orderId || !razorpayKey || !window.Razorpay) throw new Error("Invalid response or Razorpay SDK not loaded");

      const options = {
        key: razorpayKey,
        amount: transaction.amount * 100,
        currency: "INR",
        name: "Eatzaa",
        description: transaction.subscriptionPlan?.name,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post("/restaurnt-verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: transaction.subscriptionId,
              restaurantId: transaction.restaurantId,
            });
            toast.success("Payment verified and subscription activated!");
            navigate("/restaurant-payment-history");
          } catch (error: any) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: "Eatzaa Food Hub", email: "eatzaafoodhub@gmail.com", contact: "+91 0495 56765" },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", async (response: any) => {
        try {
          await axiosInstance.post("/restaurnt-payment-failed", {
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            error_code: response.error.code,
            error_description: response.error.description,
            planId: transaction.subscriptionId,
            restaurantId: transaction.restaurantId,
          });
          toast.error("Payment failed. Please try again.");
          navigate("/restaurant-payment-history");
        } catch (error: any) {
          toast.error("Failed to log payment failure. Contact support.");
        }
      });
      razor.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate repayment");
    } finally {
      setIsRepaying(false);
    }
  };

  return (
    <button
      onClick={handleRepayment}
      disabled={isRepaying}
      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md ${isRepaying ? "animate-pulse" : ""}`}
    >
      <RefreshCw className={`h-4 w-4 ${isRepaying ? "animate-spin" : ""}`} />
      <span>{isRepaying ? "Processing..." : "Retry Payment"}</span>
    </button>
  );
};

export default RetryPaymentButton;