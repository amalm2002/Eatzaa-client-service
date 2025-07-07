export interface ConfirmationModalProps {
    id: string;
    isActive: boolean;
    onConfirm: (id: string, isActive: boolean) => Promise<void>;
}