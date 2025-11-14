import React from 'react';
import { useAppState } from '@/context/StateContext';
import { MarkerList } from './MarkerList';
import { MarkerForm } from './MarkerForm';
import { PersistenceStatus } from './PersistenceStatus';
import './Sidebar.css';

/**
 * Sidebar Component
 */
export const Sidebar: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { sidebarOpen } = state.ui;

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Marker Management</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <div className="sidebar-content">
          <PersistenceStatus />
          <MarkerForm />
          <MarkerList />
        </div>
      </div>
      {!sidebarOpen && (
        <button className="sidebar-toggle-floating" onClick={toggleSidebar}>
          →
        </button>
      )}
    </>
  );
};

