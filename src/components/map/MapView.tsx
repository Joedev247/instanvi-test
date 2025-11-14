import React, { useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useMapActions } from '@/hooks/useMapActions';
import { useMarkerActions } from '@/hooks/useMarkerActions';
import { DynamicMarkers } from './DynamicMarkers';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

/**
 * Map click handler component
 */
const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
};

/**
 * Map initializer component to ensure proper rendering
 */
const MapInitializer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Force map to invalidate size and refresh tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

/**
 * Geographic Map View Component
 */
export const MapView: React.FC = () => {
  const { geographicPoint, mapZoom, mapCenter, setGeographicPoint } = useMapActions();
  const { addGeographicMarker } = useMarkerActions();

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const point = { latitude: lat, longitude: lng };
      setGeographicPoint(point);
      addGeographicMarker(point, `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
    [setGeographicPoint, addGeographicMarker]
  );

  const handleViewChange = useCallback(() => {
    // This will be called when map view changes
    // We can update state if needed
  }, []);

  // Default center (can be overridden by state)
  // Default to a visible location (e.g., center of Africa/Cameroon area)
  const defaultCenter: [number, number] = [4.0511, 9.7679]; // Douala, Cameroon
  const center: [number, number] = geographicPoint
    ? [geographicPoint.latitude, geographicPoint.longitude]
    : mapCenter.latitude !== 0 || mapCenter.longitude !== 0
    ? [mapCenter.latitude, mapCenter.longitude]
    : defaultCenter;

  return (
    <div className="map-view">
      <MapContainer
        center={center}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        whenReady={handleViewChange}
        scrollWheelZoom={true}
      >
        <MapInitializer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={2}
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {geographicPoint && (
          <Marker position={[geographicPoint.latitude, geographicPoint.longitude]}>
            <Popup>
              <div>
                <strong>Geographic Location</strong>
                <br />
                Lat: {geographicPoint.latitude.toFixed(6)}
                <br />
                Lng: {geographicPoint.longitude.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}
        <DynamicMarkers />
      </MapContainer>
    </div>
  );
};

