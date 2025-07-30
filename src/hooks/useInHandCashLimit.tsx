import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryBoyApi } from "../api/endpoints/deliveryBoyApi";

interface CashLimitResponse {
  success: boolean;
  message: string;
}

export const useInHandCashLimit = () => {
  const dispatch = useDispatch();
  const deliveryBoyId = useSelector((store: { deliveryBoyAuth: { delivery_boy_id: string } }) => store.deliveryBoyAuth.delivery_boy_id);
  const [cashLimitStatus, setCashLimitStatus] = useState<CashLimitResponse>({ success: true, message: "" });

  useEffect(() => {
    const checkTheInHandCash = async () => {
      try {
        const response = await deliveryBoyApi.checkTheInHandCash(dispatch, deliveryBoyId);
        setCashLimitStatus(response.data);
      } catch (error) {
        console.error('Error in useInHandCashLimit hook:', (error as Error).message);
        setCashLimitStatus({ success: false, message: 'Failed to check cash limit. Please try again.' });
      }
    };

    checkTheInHandCash();

    const interval = setInterval(checkTheInHandCash, 30000);
    return () => clearInterval(interval);
    
  }, [dispatch, deliveryBoyId]);

  return cashLimitStatus;
};