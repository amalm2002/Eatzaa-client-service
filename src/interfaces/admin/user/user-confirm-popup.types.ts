export interface UserListConfirmPopupProps {
    showConfirmPopup: boolean;
    pendingAction: { userId: string; action: 'block' | 'unblock' } | null;
    actionLoading: boolean;
    setShowConfirmPopup: (show: boolean) => void;
    confirmToggleBlock: () => void;
}