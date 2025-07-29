// export interface MapModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   origin: { latitude: number; longitude: number };
//   destination: { latitude: number; longitude: number };
//   orderId: string;
//   deliveryBoyId?: string;
// }

export interface MapModalProps {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  orderId: string;
  deliveryBoyId?: string;
}