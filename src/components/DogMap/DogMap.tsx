import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../types/Locations';

delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DogMapProps {
  locations: Location[];
  center: L.LatLng | null;
  radiusKm: number;
  onMapClick: (latlng: L.LatLng) => void;
}

const MapEventsHandler: React.FC<{ onClick: (latlng: L.LatLng) => void }> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const DogMap: React.FC<DogMapProps> = ({
  locations,
  center,
  radiusKm,
  onMapClick,
}) => {
  const validLocations = locations.filter(
    (loc) =>
      typeof loc.latitude === 'number' && typeof loc.longitude === 'number'
  );

  const initialMapCenter: [number, number] = 
    validLocations.length > 0
      ? [validLocations[0].latitude, validLocations[0].longitude]
      : [37.7749, -122.4194];

  return (
    <MapContainer center={initialMapCenter} zoom={10} style={{ height: 400, width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEventsHandler onClick={onMapClick} />

      {center && (
        <>
          <Marker position={center}>
            <Popup>Search Center</Popup>
          </Marker>
          <Circle center={center} radius={radiusKm * 1000} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}/>
        </>
      )}

      {validLocations.map((loc) => (
        <Marker key={loc.zip_code} position={[loc.latitude, loc.longitude]}>
          <Popup>
            {loc.city}, {loc.state} ({loc.zip_code})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DogMap;
