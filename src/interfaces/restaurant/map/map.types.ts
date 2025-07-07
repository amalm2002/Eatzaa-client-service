export interface MapProps {
    latitude: number;
    longitude: number,
    onLocationChange: (lat: number, long: number, status: any) => void
}
