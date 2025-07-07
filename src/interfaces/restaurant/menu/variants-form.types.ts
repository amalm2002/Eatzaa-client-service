import { MenuItem } from "./menu-item-form.types";

export interface VariantsFormProps {
    values: MenuItem;
    setFieldValue: (field: string, value: any) => void;
    openVariantModal: (mode: 'new' | 'existing') => void;
    removeVariant: (id: string, setFieldValue: (field: string, value: any) => void, values: MenuItem) => void;
}
