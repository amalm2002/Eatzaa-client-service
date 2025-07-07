import { MenuItem } from "./menu-item-form.types";
import { Variant } from "./variant.types";

export interface VariantModalProps {
    mode: 'new' | 'existing';
    newVariant: Variant;
    setNewVariant: (variant: Variant) => void;
    setShowVariantModal: (show: boolean) => void;
    setFieldValue: (field: string, value: any) => void;
    values: MenuItem;
    selectedExistingVariant: string;
    setSelectedExistingVariant: (variantId: string) => void;
}