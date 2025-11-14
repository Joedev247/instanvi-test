import { useCallback } from 'react';
import { useAppState } from '@/context/StateContext';
import type { SpatialMarker, GeographicPoint } from '@/types';
import { generateUUID } from '@/utils/uuid';

/**
 * Custom hook for marker-related actions
 */
export const useMarkerActions = () => {
  const { state, dispatch } = useAppState();

  const addGeographicMarker = useCallback(
    (point: GeographicPoint, label: string) => {
      const marker: SpatialMarker = {
        id: generateUUID(),
        type: 'geographic',
        position: {
          lat: point.latitude,
          lng: point.longitude,
        },
        label,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MARKER', payload: marker });
    },
    [dispatch]
  );

  const addFloorPlanMarker = useCallback(
    (x: number, y: number, label: string) => {
      const marker: SpatialMarker = {
        id: generateUUID(),
        type: 'floor-plan',
        position: {
          x,
          y,
        },
        label,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MARKER', payload: marker });
    },
    [dispatch]
  );

  const updateMarker = useCallback(
    (id: string, updates: Partial<SpatialMarker>) => {
      dispatch({ type: 'UPDATE_MARKER', payload: { id, updates } });
    },
    [dispatch]
  );

  const deleteMarker = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_MARKER', payload: id });
    },
    [dispatch]
  );

  const selectMarker = useCallback(
    (id: string | null) => {
      dispatch({ type: 'SELECT_MARKER', payload: id });
    },
    [dispatch]
  );

  return {
    markers: state.spatialMarkers,
    geographicPoint: state.geographicPoint,
    selectedMarkerId: state.ui.selectedMarkerId,
    addGeographicMarker,
    addFloorPlanMarker,
    updateMarker,
    deleteMarker,
    selectMarker,
  };
};

