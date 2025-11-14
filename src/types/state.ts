/**
 * Geographic coordinate point
 */
export interface GeographicPoint {
  latitude: number;
  longitude: number;
  accuracy?: number; // Optional accuracy in meters
}

/**
 * Spatial feature marker
 */
export interface SpatialMarker {
  id: string; // Unique identifier (UUID)
  type: 'geographic' | 'floor-plan';
  position: {
    // For geographic markers
    lat?: number;
    lng?: number;
    // For floor plan markers
    x?: number; // X coordinate in floor plan units
    y?: number; // Y coordinate in floor plan units
  };
  label: string;
  description?: string;
  color?: string; // Hex color code
  icon?: string; // Icon identifier
  metadata?: Record<string, unknown>; // Additional flexible data
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * UI state management
 */
export interface UIState {
  activeView: 'map' | 'floor-plan' | 'both';
  selectedMarkerId: string | null;
  mapZoom: number;
  mapCenter: GeographicPoint;
  floorPlanZoom: number;
  floorPlanPan: { x: number; y: number };
  sidebarOpen: boolean;
}

/**
 * Complete application state
 */
export interface ApplicationState {
  // Core data
  geographicPoint: GeographicPoint | null;
  spatialMarkers: SpatialMarker[];

  // UI state
  ui: UIState;

  // Persistence metadata
  lastSaved: string | null; // ISO 8601 timestamp
  version: string; // State schema version for migration
}

/**
 * State action types
 */
export type StateAction =
  | { type: 'SET_GEOGRAPHIC_POINT'; payload: GeographicPoint }
  | { type: 'ADD_MARKER'; payload: SpatialMarker }
  | { type: 'UPDATE_MARKER'; payload: { id: string; updates: Partial<SpatialMarker> } }
  | { type: 'DELETE_MARKER'; payload: string } // marker id
  | { type: 'SET_ACTIVE_VIEW'; payload: UIState['activeView'] }
  | { type: 'SELECT_MARKER'; payload: string | null }
  | { type: 'UPDATE_MAP_VIEW'; payload: { zoom: number; center: GeographicPoint } }
  | {
      type: 'UPDATE_FLOOR_PLAN_VIEW';
      payload: { zoom: number; pan: { x: number; y: number } };
    }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOAD_STATE'; payload: ApplicationState }
  | { type: 'RESET_STATE' };

/**
 * Initial state factory
 */
export const createInitialState = (): ApplicationState => ({
  geographicPoint: null,
  spatialMarkers: [],
  ui: {
    activeView: 'both',
    selectedMarkerId: null,
    mapZoom: 10,
    mapCenter: { latitude: 4.0511, longitude: 9.7679 }, // Default to Douala, Cameroon
    floorPlanZoom: 1,
    floorPlanPan: { x: 0, y: 0 },
    sidebarOpen: true,
  },
  lastSaved: null,
  version: '1.0.0',
});

