import { Coordinates } from "./coordinates.types";
import { Page } from "../authentication/login.types";

export interface Zone {
    id: { _id: string; name: string; coordinates: Coordinates[] };
    name: string;
}

export interface ZoneShiftPageProps {
    zone: string;
    setZone: React.Dispatch<React.SetStateAction<string>>;
    shift: string;
    setShift: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
}