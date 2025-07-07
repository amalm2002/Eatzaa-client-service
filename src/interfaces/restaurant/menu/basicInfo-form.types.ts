import { MenuItem } from "./menu-item-form.types";

export interface BasicInfoFormProps {
  values: MenuItem;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
}