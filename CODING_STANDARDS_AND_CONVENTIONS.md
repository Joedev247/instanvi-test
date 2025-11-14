# Coding Standards and Conventions Document

## 1. Naming Conventions

### Components

**PascalCase** for all React components and their files.

```typescript
// ✅ Correct
MapView.tsx
FloorPlanView.tsx
DynamicMarkers.tsx
MarkerForm.tsx

// ❌ Incorrect
mapView.tsx
floor-plan-view.tsx
dynamic_markers.tsx
```

**Component Naming Rules:**
- Use descriptive, noun-based names
- Avoid abbreviations unless widely understood (e.g., `App`, `Nav`)
- Suffix container components with `Container` if they manage state/logic
- Suffix presentational components with the feature name (e.g., `MarkerCard`, `MapControls`)

**Examples:**
```typescript
// Container component
export const MapViewContainer: React.FC = () => { ... }

// Presentational component
export const MarkerCard: React.FC<MarkerCardProps> = () => { ... }
```

---

### Hooks

**camelCase** starting with `use` prefix.

```typescript
// ✅ Correct
useAppState.ts
useMarkerActions.ts
useMapInteraction.ts
usePersistence.ts

// ❌ Incorrect
UseAppState.ts
appStateHook.ts
getAppState.ts
```

**Hook Naming Rules:**
- Always prefix with `use`
- Use verb-noun pattern for action hooks: `use[Action][Noun]`
- Use noun pattern for data hooks: `use[Noun]`

**Examples:**
```typescript
// Data hook
export const useAppState = () => { ... }

// Action hook
export const useMarkerActions = () => { ... }

// Effect hook
export const usePersistence = () => { ... }
```

---

### Functions

**camelCase** with descriptive, verb-based names.

```typescript
// ✅ Correct
const handleMarkerClick = (id: string) => { ... }
const calculateDistance = (point1: Point, point2: Point) => { ... }
const saveStateToLocalStorage = (state: ApplicationState) => { ... }

// ❌ Incorrect
const markerClick = (id: string) => { ... }
const calcDist = (p1: Point, p2: Point) => { ... }
const save = (state: ApplicationState) => { ... }
```

**Function Naming Rules:**
- Use verbs: `get`, `set`, `create`, `update`, `delete`, `handle`, `calculate`, `transform`
- Be specific: `getMarkerById` not `getMarker`
- Boolean functions: prefix with `is`, `has`, `can`, `should`
  ```typescript
  const isValidMarker = (marker: SpatialMarker) => { ... }
  const hasMarkers = (markers: SpatialMarker[]) => { ... }
  const canEditMarker = (marker: SpatialMarker) => { ... }
  ```

---

### Variables

**camelCase** for variables and constants (except true constants).

```typescript
// ✅ Correct
const markerCount = markers.length;
const selectedMarkerId = state.ui.selectedMarkerId;
const isMapVisible = activeView === 'map' || activeView === 'both';

// ❌ Incorrect
const marker_count = markers.length;
const SelectedMarkerId = state.ui.selectedMarkerId;
const IS_MAP_VISIBLE = activeView === 'map';
```

**Variable Naming Rules:**
- Use descriptive names: `markerList` not `list`
- Boolean variables: prefix with `is`, `has`, `can`, `should`
- Array variables: use plural nouns: `markers`, `users`, `items`
- Object variables: use singular nouns: `marker`, `user`, `config`

**Constants:**
- **UPPER_SNAKE_CASE** for true constants (never change)
  ```typescript
  const MAX_MARKERS = 100;
  const STORAGE_KEY = 'instanvi-app-state';
  const API_BASE_URL = 'https://api.example.com';
  ```
- **camelCase** for configuration objects that might be modified
  ```typescript
  const defaultConfig = { zoom: 10, center: [0, 0] };
  ```

---

### Types and Interfaces

**PascalCase** for TypeScript types and interfaces.

```typescript
// ✅ Correct
interface SpatialMarker { ... }
type MarkerType = 'geographic' | 'floor-plan';
type StateAction = { type: string; payload: unknown };

// ❌ Incorrect
interface spatialMarker { ... }
type markerType = 'geographic' | 'floor-plan';
```

**Type Naming Rules:**
- Interfaces: Use nouns, no `I` prefix
- Types: Use descriptive names, suffix unions with `Type` if needed
- Generic types: Use single uppercase letters: `T`, `K`, `V`, `P`

**Examples:**
```typescript
interface ApplicationState { ... }
interface MarkerProps { ... }

type MarkerType = 'geographic' | 'floor-plan';
type StateAction = SetMarkerAction | DeleteMarkerAction;

function processData<T>(data: T): T { ... }
```

---

### Files and Directories

**PascalCase** for component files, **camelCase** for utility files.

```
src/
├── components/           # Component files: PascalCase
│   ├── MapView.tsx
│   ├── FloorPlanView.tsx
│   └── DynamicMarkers.tsx
├── hooks/                # Hook files: camelCase with 'use' prefix
│   ├── useAppState.ts
│   └── useMarkerActions.ts
├── services/             # Service files: camelCase
│   ├── persistenceService.ts
│   └── stateService.ts
├── types/                # Type files: camelCase
│   ├── state.ts
│   └── marker.ts
└── utils/                # Utility files: camelCase
    ├── coordinateUtils.ts
    └── validationUtils.ts
```

---

## 2. Code-Behind Logic and State Mutation Policy

### State Mutation Policy

**STRICT RULE: State is IMMUTABLE**

All state updates must create new objects/arrays, never mutate existing ones.

```typescript
// ✅ Correct - Immutable update
const addMarker = (marker: SpatialMarker) => {
  setState(prevState => ({
    ...prevState,
    spatialMarkers: [...prevState.spatialMarkers, marker],
  }));
};

// ❌ Incorrect - Mutating state
const addMarker = (marker: SpatialMarker) => {
  state.spatialMarkers.push(marker); // MUTATION!
  setState(state);
};
```

**Immutability Patterns:**

1. **Objects:**
   ```typescript
   // Update nested object
   const updateMarker = (id: string, updates: Partial<SpatialMarker>) => {
     setState(prevState => ({
       ...prevState,
       spatialMarkers: prevState.spatialMarkers.map(marker =>
         marker.id === id ? { ...marker, ...updates } : marker
       ),
     }));
   };
   ```

2. **Arrays:**
   ```typescript
   // Add item
   const newArray = [...oldArray, newItem];
   
   // Remove item
   const newArray = oldArray.filter(item => item.id !== targetId);
   
   // Update item
   const newArray = oldArray.map(item =>
     item.id === targetId ? { ...item, ...updates } : item
   );
   ```

3. **Nested Updates:**
   ```typescript
   // Update deeply nested property
   setState(prevState => ({
     ...prevState,
     ui: {
       ...prevState.ui,
       selectedMarkerId: newId,
     },
   }));
   ```

---

### Code-Behind Logic Policy

**Separation of Concerns:**

1. **Components:** Should be primarily presentational
   - Minimal logic in components
   - Extract complex logic to custom hooks
   - Business logic in services/utilities

```typescript
// ✅ Correct - Logic extracted to hook
const MapView: React.FC = () => {
  const { markers, handleMarkerClick } = useMarkerActions();
  
  return (
    <MapContainer>
      <DynamicMarkers markers={markers} onClick={handleMarkerClick} />
    </MapContainer>
  );
};

// ❌ Incorrect - Too much logic in component
const MapView: React.FC = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // 50+ lines of logic here...
  
  return <MapContainer>...</MapContainer>;
};
```

2. **Custom Hooks:** Business logic and state management
   ```typescript
   // hooks/useMarkerActions.ts
   export const useMarkerActions = () => {
     const { state, dispatch } = useAppState();
     
     const handleMarkerClick = useCallback((id: string) => {
       dispatch({ type: 'SELECT_MARKER', payload: id });
     }, [dispatch]);
     
     const addMarker = useCallback((marker: SpatialMarker) => {
       dispatch({ type: 'ADD_MARKER', payload: marker });
     }, [dispatch]);
     
     return { markers: state.spatialMarkers, handleMarkerClick, addMarker };
   };
   ```

3. **Services:** Pure functions, side effects, external API calls
   ```typescript
   // services/persistenceService.ts
   export const persistenceService = {
     save: (state: ApplicationState): void => {
       try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
       } catch (error) {
         console.error('Failed to save state:', error);
       }
     },
     
     load: (): ApplicationState | null => {
       try {
         const data = localStorage.getItem(STORAGE_KEY);
         return data ? JSON.parse(data) : null;
       } catch (error) {
         console.error('Failed to load state:', error);
         return null;
       }
     },
   };
   ```

4. **Utils:** Pure, reusable utility functions
   ```typescript
   // utils/coordinateUtils.ts
   export const calculateDistance = (
     point1: GeographicPoint,
     point2: GeographicPoint
   ): number => {
     // Pure calculation, no side effects
   };
   ```

---

### Side Effects Policy

**All side effects must be in:**
- `useEffect` hooks (for React lifecycle)
- Service functions (for external APIs, localStorage)
- Event handlers (for user interactions)

```typescript
// ✅ Correct - Side effect in useEffect
useEffect(() => {
  const savedState = persistenceService.load();
  if (savedState) {
    dispatch({ type: 'LOAD_STATE', payload: savedState });
  }
}, [dispatch]);

// ✅ Correct - Side effect in service
const handleSave = () => {
  persistenceService.save(state);
};

// ❌ Incorrect - Side effect in render
const Component = () => {
  localStorage.setItem('key', 'value'); // Side effect in render!
  return <div>...</div>;
};
```

---

## 3. File Structure Standards

### Project Structure

```
instanvi-task/
├── public/                 # Static assets
│   └── floor-plan.png     # Floor plan image (if needed)
├── src/
│   ├── components/         # React components
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── MapContainer.tsx
│   │   │   └── MapControls.tsx
│   │   ├── floor-plan/
│   │   │   ├── FloorPlanView.tsx
│   │   │   ├── FloorPlanCanvas.tsx
│   │   │   └── FloorPlanControls.tsx
│   │   ├── markers/
│   │   │   ├── DynamicMarkers.tsx
│   │   │   ├── Marker.tsx
│   │   │   └── MarkerCard.tsx
│   │   └── forms/
│   │       └── MarkerForm.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAppState.ts
│   │   ├── useMarkerActions.ts
│   │   ├── usePersistence.ts
│   │   └── useMapInteraction.ts
│   ├── services/           # Business logic services
│   │   ├── persistenceService.ts
│   │   └── stateService.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── state.ts
│   │   ├── marker.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── coordinateUtils.ts
│   │   ├── validationUtils.ts
│   │   └── dateUtils.ts
│   ├── context/            # React Context providers
│   │   └── StateContext.tsx
│   ├── styles/             # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── package.json
└── README.md
```

---

### File Organization Rules

1. **One component per file**
2. **Co-locate related files:** Component + styles + tests in same directory (optional)
3. **Index files for exports:** Use `index.ts` to re-export from directories
   ```typescript
   // types/index.ts
   export * from './state';
   export * from './marker';
   ```
4. **Group by feature:** Organize by feature/domain, not by file type (after initial structure)

---

## 4. Formatting Standards

### Code Formatting

**Prettier Configuration:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Formatting Rules:**
- **Indentation:** 2 spaces (no tabs)
- **Line Length:** Maximum 100 characters
- **Quotes:** Single quotes for strings, double quotes for JSX attributes
- **Semicolons:** Always use semicolons
- **Trailing Commas:** Use in arrays and objects (ES5 style)

```typescript
// ✅ Correct formatting
const example = {
  name: 'Marker',
  coordinates: [40.7128, -74.006],
  metadata: {
    type: 'geographic',
    visible: true,
  },
};

// ❌ Incorrect
const example={name:"Marker",coordinates:[40.7128,-74.006],metadata:{type:"geographic",visible:true}}
```

---

### Import Organization

**Import Order:**
1. React and React-related imports
2. Third-party libraries
3. Internal components
4. Internal hooks
5. Internal services/utils
6. Types
7. Styles

```typescript
// ✅ Correct import order
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import { MapView } from '@/components/map/MapView';
import { useAppState } from '@/hooks/useAppState';
import { persistenceService } from '@/services/persistenceService';

import type { SpatialMarker, ApplicationState } from '@/types';

import './MapView.css';
```

**Import Rules:**
- Use absolute imports with path aliases (`@/components` instead of `../../components`)
- Group imports with blank lines
- Use `type` keyword for type-only imports
- Remove unused imports

---

### JSX Formatting

```typescript
// ✅ Correct JSX formatting
const Component: React.FC<Props> = ({ markers, onMarkerClick }) => {
  return (
    <div className="container">
      <h1>Markers</h1>
      {markers.length > 0 ? (
        <ul>
          {markers.map(marker => (
            <li key={marker.id} onClick={() => onMarkerClick(marker.id)}>
              {marker.label}
            </li>
          ))}
        </ul>
      ) : (
        <p>No markers available</p>
      )}
    </div>
  );
};

// ❌ Incorrect - Inline everything, no formatting
const Component: React.FC<Props> = ({markers,onMarkerClick})=>{return <div><h1>Markers</h1>{markers.length>0?<ul>{markers.map(marker=><li key={marker.id} onClick={()=>onMarkerClick(marker.id)}>{marker.label}</li>)}</ul>:<p>No markers</p>}</div>}
```

---

## 5. Code Quality Standards

### TypeScript Standards

1. **Strict Mode:** Always use strict TypeScript
   ```json
   {
     "strict": true,
     "noImplicitAny": true,
     "strictNullChecks": true
   }
   ```

2. **Type Everything:** Avoid `any`, use `unknown` if type is truly unknown
   ```typescript
   // ✅ Correct
   const processData = (data: unknown): string => {
     if (typeof data === 'string') return data;
     return JSON.stringify(data);
   };
   
   // ❌ Incorrect
   const processData = (data: any): any => {
     return data;
   };
   ```

3. **Use Interfaces for Objects:** Prefer interfaces over type aliases for object shapes
   ```typescript
   // ✅ Correct
   interface Marker {
     id: string;
     label: string;
   }
   
   // Use type for unions, intersections, primitives
   type MarkerType = 'geographic' | 'floor-plan';
   ```

4. **Explicit Return Types:** Use explicit return types for functions (except simple components)
   ```typescript
   // ✅ Correct
   const calculateDistance = (p1: Point, p2: Point): number => {
     return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
   };
   ```

---

### React Best Practices

1. **Functional Components Only:** Use function components with hooks
2. **Memoization:** Use `React.memo`, `useMemo`, `useCallback` appropriately
   ```typescript
   // Memoize expensive calculations
   const sortedMarkers = useMemo(
     () => markers.sort((a, b) => a.label.localeCompare(b.label)),
     [markers]
   );
   
   // Memoize callbacks passed to children
   const handleClick = useCallback((id: string) => {
     dispatch({ type: 'SELECT_MARKER', payload: id });
   }, [dispatch]);
   ```

3. **Key Props:** Always provide stable, unique keys
   ```typescript
   // ✅ Correct
   {markers.map(marker => (
     <Marker key={marker.id} marker={marker} />
   ))}
   
   // ❌ Incorrect
   {markers.map((marker, index) => (
     <Marker key={index} marker={marker} />
   ))}
   ```

4. **Error Boundaries:** Implement error boundaries for robust error handling
5. **Accessibility:** Use semantic HTML, ARIA attributes where needed

---

### Performance Standards

1. **Avoid Unnecessary Renders:** Use React DevTools Profiler to identify issues
2. **Code Splitting:** Use React.lazy for route-based code splitting
3. **Bundle Size:** Keep bundle size optimized, monitor with build tools
4. **Debouncing/Throttling:** Debounce expensive operations (map pan, input changes)

---

### Testing Standards

1. **Unit Tests:** Test utilities and pure functions
2. **Component Tests:** Test component behavior, not implementation
3. **Integration Tests:** Test user flows and state management
4. **Test Coverage:** Aim for 80%+ coverage on critical paths

```typescript
// Example test structure
describe('persistenceService', () => {
  it('should save state to localStorage', () => {
    const state = createInitialState();
    persistenceService.save(state);
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });
  
  it('should load state from localStorage', () => {
    const state = createInitialState();
    persistenceService.save(state);
    const loaded = persistenceService.load();
    expect(loaded).toEqual(state);
  });
});
```

---

### Documentation Standards

1. **JSDoc Comments:** Document public functions and complex logic
   ```typescript
   /**
    * Calculates the distance between two geographic points using the Haversine formula.
    * 
    * @param point1 - First geographic point
    * @param point2 - Second geographic point
    * @returns Distance in kilometers
    */
   export const calculateDistance = (
     point1: GeographicPoint,
     point2: GeographicPoint
   ): number => {
     // Implementation
   };
   ```

2. **Inline Comments:** Explain "why", not "what"
   ```typescript
   // ✅ Good - explains why
   // Debounce to avoid excessive localStorage writes during rapid state changes
   const debouncedSave = debounce(() => persistenceService.save(state), 300);
   
   // ❌ Bad - explains what (obvious from code)
   // Save the state
   persistenceService.save(state);
   ```

3. **README:** Keep README updated with setup instructions, architecture overview

---

## 6. Git and Version Control Standards

### Commit Messages

**Format:** `type(scope): subject`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(map): add dynamic marker rendering
fix(persistence): handle localStorage quota exceeded
docs: update architectural design document
refactor(state): extract marker actions to custom hook
```

---

### Branch Naming

- `main` or `master`: Production-ready code
- `develop`: Integration branch
- `feature/feature-name`: New features
- `fix/bug-description`: Bug fixes
- `refactor/component-name`: Refactoring

---

## 7. Review Checklist

Before submitting code, ensure:

- [ ] Code follows naming conventions
- [ ] No state mutations
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] Components are properly memoized where needed
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Tests written and passing
- [ ] Documentation updated

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-01  
**Author:** Senior Frontend Developer

