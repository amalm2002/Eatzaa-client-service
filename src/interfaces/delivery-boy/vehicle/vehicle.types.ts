import { Page } from "../authentication/login.types";

export interface VehiclePageProps {
    vehicle: string;
    setVehicle: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
}