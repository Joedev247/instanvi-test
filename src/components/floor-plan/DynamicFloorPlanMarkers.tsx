import React, { useCallback } from 'react';
import { useMarkerActions } from '@/hooks/useMarkerActions';

interface DynamicFloorPlanMarkersProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Dynamic Markers Component for Floor Plan
 * Renders all floor plan markers from state
 */
export const DynamicFloorPlanMarkers: React.FC<DynamicFloorPlanMarkersProps> = ({
  containerRef,
}) => {
  const { markers, selectedMarkerId, selectMarker } = useMarkerActions();

  const floorPlanMarkers = markers.filter((marker) => marker.type === 'floor-plan');

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      selectMarker(markerId);
    },
    [selectMarker]
  );

  if (!containerRef.current) {
    return null;
  }

  const rect = containerRef.current.getBoundingClientRect();

  return (
    <>
      {floorPlanMarkers.map((marker) => {
        if (marker.position.x === undefined || marker.position.y === undefined) {
          return null;
        }

        // Convert relative coordinates (0-1) to pixel coordinates
        const x = marker.position.x * rect.width;
        const y = marker.position.y * rect.height;

        const isSelected = selectedMarkerId === marker.id;

        return (
          <div
            key={marker.id}
            className={`floor-plan-marker ${isSelected ? 'selected' : ''}`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(marker.id);
            }}
            title={marker.label}
          >
            <div className="marker-pin" />
            {isSelected && (
              <div className="marker-popup">
                <strong>{marker.label}</strong>
                {marker.description && <p>{marker.description}</p>}
                <small>
                  Position: ({Math.round(x)}, {Math.round(y)})
                </small>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

