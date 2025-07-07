import { MenuItem } from "./menu-item-form.types";

export interface ImagesTimingFormProps {
    values: MenuItem;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    handleFileChange: (index: number, event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => void;
    fileInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
}