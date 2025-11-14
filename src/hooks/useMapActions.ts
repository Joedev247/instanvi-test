import { useCallback } from 'react';
import { useAppState } from '@/context/StateContext';
import type { GeographicPoint } from '@/types';

/**
 * Custom hook for map-related actions
 */
export const useMapActions = () => {
  const { state, dispatch } = useAppState();

  const setGeographicPoint = useCallback(
    (point: GeographicPoint) => {
      dispatch({ type: 'SET_GEOGRAPHIC_POINT', payload: point });
    },
    [dispatch]
  );

  const updateMapView = useCallback(
    (zoom: number, center: GeographicPoint) => {
      dispatch({ type: 'UPDATE_MAP_VIEW', payload: { zoom, center } });
    },
    [dispatch]
  );

  return {
    geographicPoint: state.geographicPoint,
    mapZoom: state.ui.mapZoom,
    mapCenter: state.ui.mapCenter,
    setGeographicPoint,
    updateMapView,
  };
};

