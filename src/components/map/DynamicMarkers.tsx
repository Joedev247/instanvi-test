import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useMarkerActions } from '@/hooks/useMarkerActions';

/**
 * Dynamic Markers Component for Geographic Map
 * Renders all geographic markers from state
 */
export const DynamicMarkers: React.FC = () => {
  const { markers, selectMarker } = useMarkerActions();

  const geographicMarkers = markers.filter((marker) => marker.type === 'geographic');

  return (
    <>
      {geographicMarkers.map((marker) => {
        if (!marker.position.lat || !marker.position.lng) {
          return null;
        }

        return (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            eventHandlers={{
              click: () => {
                selectMarker(marker.id);
              },
            }}
          >
            <Popup>
              <div>
                <strong>{marker.label}</strong>
                {marker.description && (
                  <>
                    <br />
                    {marker.description}
                  </>
                )}
                <br />
                <small>
                  {marker.position.lat?.toFixed(6)}, {marker.position.lng?.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

