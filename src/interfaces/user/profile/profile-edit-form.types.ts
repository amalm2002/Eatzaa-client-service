export interface ProfileEditFormProps {
    editForm: { name: string; email: string; phone: string };
    errors: { name?: string; phone?: string };
    setEditForm: (form: { name: string; email: string; phone: string }) => void;
    handleEditSubmit: (e: React.FormEvent) => void;
    setIsEditing: (isEditing: boolean) => void;
    setErrors: (errors: { name?: string; phone?: string }) => void;
    tealColor: string;
}