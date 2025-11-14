import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ApplicationState, StateAction } from '@/types';
import { createInitialState } from '@/types';
import { persistenceService } from '@/services/persistenceService';

/**
 * State reducer function
 */
const stateReducer = (state: ApplicationState, action: StateAction): ApplicationState => {
  switch (action.type) {
    case 'SET_GEOGRAPHIC_POINT': {
      return {
        ...state,
        geographicPoint: action.payload,
      };
    }

    case 'ADD_MARKER': {
      return {
        ...state,
        spatialMarkers: [...state.spatialMarkers, action.payload],
      };
    }

    case 'UPDATE_MARKER': {
      return {
        ...state,
        spatialMarkers: state.spatialMarkers.map((marker) =>
          marker.id === action.payload.id
            ? { ...marker, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : marker
        ),
      };
    }

    case 'DELETE_MARKER': {
      return {
        ...state,
        spatialMarkers: state.spatialMarkers.filter((marker) => marker.id !== action.payload),
        ui: {
          ...state.ui,
          selectedMarkerId:
            state.ui.selectedMarkerId === action.payload ? null : state.ui.selectedMarkerId,
        },
      };
    }

    case 'SET_ACTIVE_VIEW': {
      return {
        ...state,
        ui: {
          ...state.ui,
          activeView: action.payload,
        },
      };
    }

    case 'SELECT_MARKER': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedMarkerId: action.payload,
        },
      };
    }

    case 'UPDATE_MAP_VIEW': {
      return {
        ...state,
        ui: {
          ...state.ui,
          mapZoom: action.payload.zoom,
          mapCenter: action.payload.center,
        },
      };
    }

    case 'UPDATE_FLOOR_PLAN_VIEW': {
      return {
        ...state,
        ui: {
          ...state.ui,
          floorPlanZoom: action.payload.zoom,
          floorPlanPan: action.payload.pan,
        },
      };
    }

    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'RESET_STATE': {
      return createInitialState();
    }

    default: {
      return state;
    }
  }
};

interface StateContextType {
  state: ApplicationState;
  dispatch: React.Dispatch<StateAction>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

/**
 * State Provider Component
 */
export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, createInitialState());

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = persistenceService.load();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  // Auto-save state to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (persistenceService.isAvailable()) {
        persistenceService.save(state);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [state]);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

/**
 * Custom hook to access state and dispatch
 */
export const useAppState = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};

