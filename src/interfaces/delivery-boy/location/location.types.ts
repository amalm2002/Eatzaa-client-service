import { Page } from "../authentication/login.types";

export interface Location {
    latitude: number;
    longitude: number;
}

export interface DeliveryBoyLocationProps {
    handleNavigation: (page: Page) => void;
}
