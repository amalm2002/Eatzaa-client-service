
import leafLet from 'leaflet'
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { useEffect, useRef } from 'react';


interface MapProps {
    latitude: number;
    longitude: number,
    onLocationChange: (lat: number, long: number, status: any) => void
}

export default function RegisterMap({ latitude, longitude, onLocationChange }: MapProps) {
    const mapRef = useRef<leafLet.Map | null>(null)
    const deliveryBoyZoneMarkerRef = useRef<leafLet.Marker | null>(null)

    const [deliveryBoyZonePosition, setRestaurantPosition] = useLocalStorage('DELIVERY_BOY_ZONE_MARKER', {
        latitude: latitude,
        longitude: longitude
    })

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = leafLet.map('map').setView(
                [latitude, longitude],
                4
            )

            leafLet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            mapRef.current.on('click', (e: leafLet.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng
                setRestaurantPosition({ latitude: lat, longitude: lng })
                onLocationChange(lat, lng, true)
            })
        }
    }, [])

    useEffect(() => {
        if (mapRef.current) {
            if (deliveryBoyZoneMarkerRef.current) {

                deliveryBoyZoneMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
                deliveryBoyZoneMarkerRef.current = leafLet.marker([latitude, longitude], {
                    draggable: true,
                }).addTo(mapRef.current)
                    .bindPopup('Select your location');

                deliveryBoyZoneMarkerRef.current.on('dragend', function (event) {
                    const marker = event.target;
                    const position = marker.getLatLng();
                    setRestaurantPosition({ latitude: position.lat, longitude: position.lng });
                    onLocationChange(position.lat, position.lng, true);
                });
            }

            mapRef.current.setView([latitude, longitude], 13);


            const el = deliveryBoyZoneMarkerRef.current?.getElement();

            if (el) {
                el.style.filter = 'hue-rotate(120deg)';
            }


            setRestaurantPosition({ latitude, longitude });
            onLocationChange(latitude, longitude, true);
        }
    }, [latitude, longitude]);


    return <div id="map" style={{ height: "400px", width: "500px" }} />;
}


