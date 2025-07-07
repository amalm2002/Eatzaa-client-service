import { Address } from "./user-profile.types";

export interface AddressFormProps {
    newAddress: Address;
    setNewAddress: (address: Address) => void;
    handleAddressSubmit: (e: React.FormEvent) => void;
    setIsEditingAddress: (isEditing: boolean) => void;
    editingAddressIndex: number | null;
    tealColor: string;
}

export interface AddressListProps {
  profile: { address: Address[] };
  handleEditAddress: (index: number) => void;
  handleDeleteAddress: (index: number) => void;
  setIsEditingAddress: (isEditing: boolean) => void;
  tealColor: string;
}
