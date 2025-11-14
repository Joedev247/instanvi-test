import React from 'react';
import { useAppState } from '@/context/StateContext';
import { MapView } from '../map/MapView';
import { FloorPlanView } from '../floor-plan/FloorPlanView';
import { Sidebar } from '../sidebar/Sidebar';
import './Layout.css';

/**
 * Main Layout Component
 */
export const Layout: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { activeView } = state.ui;

  return (
    <div className="layout">
      <header className="header">
        <h1>Instanvi - Dynamic Mapping Application</h1>
        <div className="view-controls">
          <button
            className={`view-btn ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'map' })}
          >
            Map Only
          </button>
          <button
            className={`view-btn ${activeView === 'both' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'both' })}
          >
            Both Views
          </button>
          <button
            className={`view-btn ${activeView === 'floor-plan' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'floor-plan' })}
          >
            Floor Plan Only
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="views-container">
          {(activeView === 'map' || activeView === 'both') && (
            <div className="view-panel map-panel">
              <h2>Geographic Map</h2>
              <MapView />
            </div>
          )}
          {(activeView === 'floor-plan' || activeView === 'both') && (
            <div className="view-panel floor-plan-panel">
              <h2>Spatial Floor Plan</h2>
              <FloorPlanView />
            </div>
          )}
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

