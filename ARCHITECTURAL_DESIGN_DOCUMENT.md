# Architectural Design Document

## 1. Primary Architectural Pattern

### Pattern Selection: **Component-Based Architecture with Flux/Redux Pattern**

**Justification:**

This project will employ a **Component-Based Architecture** enhanced with a **Flux-inspired state management pattern** (using React Context API or Zustand for lightweight state management). This architectural choice is justified by the following factors:

1. **State Complexity:** The application requires managing multiple interconnected states:
   - Geographic coordinates (latitude/longitude)
   - Spatial floor plan features (rooms, zones, markers)
   - UI state (active views, selected markers, map zoom/pan)
   - Persistence state synchronization

2. **Unidirectional Data Flow:** The Flux pattern ensures predictable state updates:
   - Actions → State Updates → Component Re-renders
   - Prevents state mutation bugs
   - Makes debugging easier with clear data flow

3. **Component Reusability:** The component-based approach allows for:
   - Reusable map components
   - Shared marker rendering logic
   - Modular floor plan visualization

4. **Separation of Concerns:**
   - Business logic separated from UI components
   - State management isolated from presentation
   - Persistence layer abstracted from components

5. **Scalability:** This architecture supports future enhancements:
   - Additional map layers
   - Multiple floor plans
   - Real-time updates
   - Collaborative features

---

## 2. Component Hierarchy and Data Flow

### Component Hierarchy

```
App (Root Component)
│
├── StateProvider (Context Provider)
│   └── Manages global application state
│
├── Layout
│   ├── Header
│   ├── MainContent
│   │   ├── MapView (Geographic Map)
│   │   │   ├── MapContainer
│   │   │   ├── DynamicMarkers
│   │   │   └── MapControls
│   │   │
│   │   └── FloorPlanView (Spatial Floor Plan)
│   │       ├── FloorPlanCanvas
│   │       ├── DynamicMarkers
│   │       └── FloorPlanControls
│   │
│   └── Sidebar
│       ├── MarkerList
│       ├── MarkerForm
│       └── PersistenceStatus
│
└── PersistenceService (Utility)
    └── Handles localStorage operations
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│              (Click, Drag, Form Submit)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Action Dispatcher                         │
│         (useState, useReducer, or Context API)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Store                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ApplicationState {                                   │  │
│  │    geographicPoint: { lat, lng }                     │  │
│  │    spatialFeatures: Marker[]                         │  │
│  │    uiState: { activeView, selectedMarker }            │  │
│  │  }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  MapView     │ │ FloorPlanView│ │  Sidebar     │
│  Components  │ │  Components  │ │  Components  │
└──────────────┘ └──────────────┘ └──────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PersistenceService (localStorage)               │
│         Auto-syncs state on every state change               │
└─────────────────────────────────────────────────────────────┘
```

### Props and Callbacks Flow

**Top-Down Props Flow:**
- `App` → `StateProvider`: Initial state from localStorage
- `StateProvider` → `Layout`: State and dispatch functions via Context
- `Layout` → `MapView`/`FloorPlanView`: State slices and callbacks
- `MapView`/`FloorPlanView` → `DynamicMarkers`: Marker data array
- `DynamicMarkers` → Individual `Marker`: Marker object and click handler

**Bottom-Up Callbacks Flow:**
- `Marker` → `onClick` → `MapView`/`FloorPlanView` → `handleMarkerClick`
- `handleMarkerClick` → `dispatch(action)` → `StateProvider` → State Update
- State Update → `PersistenceService.save()` → localStorage
- State Update → Re-render all subscribed components

---

## 3. Application State Structure

### TypeScript State Definition

```typescript
// types/state.ts

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
  | { type: 'UPDATE_FLOOR_PLAN_VIEW'; payload: { zoom: number; pan: { x: number; y: number } } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOAD_STATE'; payload: ApplicationState }
  | { type: 'RESET_STATE' };
```

### State Initialization

```typescript
// Initial state factory
export const createInitialState = (): ApplicationState => ({
  geographicPoint: null,
  spatialMarkers: [],
  ui: {
    activeView: 'both',
    selectedMarkerId: null,
    mapZoom: 10,
    mapCenter: { latitude: 0, longitude: 0 },
    floorPlanZoom: 1,
    floorPlanPan: { x: 0, y: 0 },
    sidebarOpen: true,
  },
  lastSaved: null,
  version: '1.0.0',
});
```

### State Persistence Schema

The state will be serialized to localStorage with the following structure:

```typescript
// localStorage key: 'instanvi-app-state'
{
  "geographicPoint": { "latitude": 40.7128, "longitude": -74.0060 },
  "spatialMarkers": [
    {
      "id": "uuid-here",
      "type": "geographic",
      "position": { "lat": 40.7128, "lng": -74.0060 },
      "label": "Marker 1",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "ui": {
    "activeView": "both",
    "selectedMarkerId": null,
    "mapZoom": 10,
    "mapCenter": { "latitude": 40.7128, "longitude": -74.0060 },
    "floorPlanZoom": 1,
    "floorPlanPan": { "x": 0, "y": 0 },
    "sidebarOpen": true
  },
  "lastSaved": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 4. Third-Party Mapping Library Selection

### Selected Library: **Leaflet.js** with **React-Leaflet**

### Technical Rationale

#### 1. **Lightweight and Performant**
- **Bundle Size:** Leaflet core is ~38KB (gzipped), significantly smaller than alternatives like Mapbox GL JS (~200KB+)
- **Performance:** Excellent rendering performance for dynamic markers, especially with large datasets
- **Memory Efficiency:** Lower memory footprint compared to WebGL-based solutions

#### 2. **React Integration**
- **react-leaflet:** Mature, well-maintained React bindings with excellent TypeScript support
- **Component-Based:** Maps naturally fit React's component model
- **Hooks Support:** Modern React hooks API for map interactions

#### 3. **Flexibility and Customization**
- **Custom Markers:** Easy to create custom marker components with React
- **Floor Plan Support:** Can render custom tile layers or canvas-based floor plans
- **Plugin Ecosystem:** Extensive plugin library for additional features

#### 4. **Cross-Platform Compatibility**
- **Browser Support:** Works on all modern browsers (IE11+ with polyfills)
- **Mobile Responsive:** Excellent touch gesture support
- **Accessibility:** Better screen reader support compared to canvas-only solutions

#### 5. **Cost-Effective**
- **No API Key Required:** Unlike Google Maps or Mapbox, Leaflet works with free tile providers (OpenStreetMap)
- **Self-Hosted Options:** Can use self-hosted tile servers if needed
- **No Usage Limits:** No per-request pricing model

#### 6. **Dynamic Marker Rendering**
- **Efficient Updates:** React-Leaflet efficiently handles marker additions/removals
- **State-Driven:** Markers can be rendered from state arrays with minimal re-renders
- **Custom Components:** Each marker can be a React component with its own logic

#### 7. **Floor Plan Visualization**
- **Custom Layers:** Can overlay floor plan images as custom tile layers
- **Coordinate Systems:** Flexible coordinate system support for floor plan coordinates
- **Canvas Integration:** Can integrate with HTML5 Canvas for custom floor plan rendering

### Alternative Considered: Mapbox GL JS

**Why Not Mapbox:**
- Larger bundle size (200KB+ vs 38KB)
- Requires API key and has usage limits
- More complex setup for custom floor plans
- Overkill for this use case

### Implementation Approach

```typescript
// Example structure
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';

// Dynamic markers from state
{spatialMarkers
  .filter(m => m.type === 'geographic')
  .map(marker => (
    <Marker key={marker.id} position={[marker.position.lat!, marker.position.lng!]}>
      <Popup>{marker.label}</Popup>
    </Marker>
  ))}
```

### Floor Plan Visualization Strategy

For the spatial floor plan, we'll use:
- **HTML5 Canvas** or **SVG** for custom floor plan rendering
- **Leaflet's custom CRS** (Coordinate Reference System) for floor plan coordinates
- Or a separate **React component** using Canvas/SVG for better control

This hybrid approach leverages Leaflet's strengths for geographic maps while using native web technologies for floor plans.

---

## 5. Additional Architectural Decisions

### State Management Library Choice

**Selected: React Context API + useReducer**

**Rationale:**
- Built into React (no additional dependencies)
- Sufficient for this application's state complexity
- Lightweight and performant
- Easy to migrate to Zustand or Redux if needed later

### Persistence Strategy

**Implementation:**
- **Debounced Auto-Save:** State changes trigger debounced localStorage writes (300ms delay)
- **Initialization:** State loaded from localStorage on app mount
- **Error Handling:** Graceful fallback if localStorage is unavailable
- **Versioning:** State schema versioning for future migrations

### Performance Optimizations

1. **Memoization:** React.memo for marker components
2. **Virtualization:** Consider react-window for large marker lists
3. **Debouncing:** Map pan/zoom events debounced
4. **Lazy Loading:** Code splitting for map components

---

## 6. Technology Stack Summary

- **Framework:** React 18+ with TypeScript
- **State Management:** React Context API + useReducer
- **Mapping Library:** Leaflet.js + react-leaflet
- **Build Tool:** Vite (fast, modern, excellent DX)
- **Styling:** CSS Modules or Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Linting/Formatting:** ESLint + Prettier

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-01  
**Author:** Senior Frontend Developer

