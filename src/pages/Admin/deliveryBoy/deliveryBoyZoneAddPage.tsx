import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  MapContainer,
  Polygon,
  useMap,
  TileLayer,
} from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import useGeolocation from '../../../hooks/useGeolocation';
import { createAxios } from '../../../service/axiousServices/adminAxious';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][];
}

const DeliveryBoyZoneCreation: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZone, setNewZone] = useState({
    name: '',
    coordinates: [] as L.LatLngExpression[]
  });

  const { latitude, longitude } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude || 51.505, longitude || -0.09]);

  const navigate = useNavigate()

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);
  // console.log('newwwwwww Zone ,', newZone, 'coooooor :', newZone.coordinates);


  const dispatch = useDispatch()
  const axiosInstance = createAxios(dispatch)

  // useEffect(() => {
  //   const fetchZone = async () => {
  //     try {
  //       const response = await axiosInstance.get('/fetch-zone');
  //       console.log('Fetched zones:', response.data.fetchZones);

  //       const mappedZones: Zone[] = response.data.fetchZones.map((zone: any) => ({
  //         id: zone._id,
  //         name: zone.name,
  //         coordinates: zone.coordinates

  //       }));
  //       console.log('mappppp :', mappedZones);

  //       // setZones(mappedZones);
  //     } catch (error) {
  //       console.error('Error fetching zones:', error);
  //       toast.error('Failed to fetch the zones');
  //     }
  //   };

  //   fetchZone();
  // }, []);

  // console.log('zoneeeeeeeeee :', zones);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newZone.name && newZone.coordinates.length > 2) {
      try {
        const response = await axiosInstance.post('/zone-creation', {
          name: newZone.name,
          coordinates: newZone.coordinates
        });

        // console.log('Zoneeeeeeeeee response :', response);

        if (response.data.error) {
          toast.error(response.data.message)
        }

        // const savedZone = {
        //   id: response.data.id || zones.length + 1,
        //   name: newZone.name,
        //   coordinates: newZone.coordinates
        // };
        // setZones([...zones, savedZone]);
        setNewZone({ name: '', coordinates: [] });
        toast.success('Zone Added Successfully!')
        navigate('/admin/zone-list')
      } catch (error) {
        console.error('Error saving zone:', error);
        toast.error('Failed to save zone. Please try again.');
      }
    } else {
      toast.warning('Please provide a zone name and at least 3 coordinates.');
    }
  };

  const MapEventHandler: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(mapCenter, 13);
    }, [map, mapCenter]);
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">

      <div className="w-full md:w-1/3 p-6 bg-orange-50 overflow-y-auto">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">Create Delivery Zone</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Name</label>
            <input
              type="text"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              placeholder="Enter zone name (e.g., Calicut)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Coordinates</label>
            <p className="text-sm text-gray-500">Use map tools to draw the zone</p>
            <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {newZone.coordinates.map((coord, index) => (
                <li key={index} className="text-sm text-gray-600">
                  Lat: {(coord as [number, number])[0].toFixed(4)}, Lng: {(coord as [number, number])[1].toFixed(4)}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setNewZone({ ...newZone, coordinates: [] })}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
            >
              Clear Coordinates
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none"
          >
            Create Zone
          </button>
        </form>

        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold text-orange-600">Existing Zones</h2>
          <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {zones.map((zone) => (
              <li key={zone.id} className="text-sm text-gray-600">
                {zone.name} ({zone.coordinates.length} points)
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* Map */}
      <div className="w-full md:w-2/3  h-96 md:h-full">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <MapEventHandler />

          {/* Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={(e) => {
                const { layerType, layer } = e;
                if (layerType === 'polygon') {
                  const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
                  const newCoords = latlngs.map((latlng) => [latlng.lat, latlng.lng] as [number, number]);
                  setNewZone({ ...newZone, coordinates: newCoords });
                }
              }}
              draw={{
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: "#b00b00",
                    message: "<strong>Oh snap!<strong> You can't draw that!"
                  },
                  shapeOptions: {
                    color: "#f97316",
                    fillOpacity: 0.4
                  }
                },
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: true,
                polyline: false
              }}
            />
          </FeatureGroup>

          {/* Drawn Zones */}
          {zones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{ color: '#f97316', fillOpacity: 0.4 }}
            />
          ))}

          {/* New Zone Preview */}
          {newZone.coordinates.length > 0 && (
            <Polygon
              positions={newZone.coordinates}
              pathOptions={{ color: '#f97316', dashArray: '5,5', fillOpacity: 0.2 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryBoyZoneCreation;
