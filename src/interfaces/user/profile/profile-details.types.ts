import { UserProfile } from "./user-profile.types";

export interface ProfileDetailsProps {
    profile: UserProfile;
    setIsEditing: (isEditing: boolean) => void;
    tealColor: string;
}