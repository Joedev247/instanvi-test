import React from 'react';
import { useAppState } from '@/context/StateContext';
import { persistenceService } from '@/services/persistenceService';
import './PersistenceStatus.css';

/**
 * Persistence Status Component
 * Shows localStorage status and last save time
 */
export const PersistenceStatus: React.FC = () => {
  const { state } = useAppState();
  const isAvailable = persistenceService.isAvailable();

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="persistence-status">
      <h3>Persistence Status</h3>
      <div className="status-item">
        <span className="status-label">localStorage:</span>
        <span className={`status-value ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? '✓ Available' : '✗ Unavailable'}
        </span>
      </div>
      <div className="status-item">
        <span className="status-label">Last Saved:</span>
        <span className="status-value">{formatDate(state.lastSaved)}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Markers:</span>
        <span className="status-value">{state.spatialMarkers.length}</span>
      </div>
      {state.geographicPoint && (
        <div className="status-item">
          <span className="status-label">Location:</span>
          <span className="status-value">
            {state.geographicPoint.latitude.toFixed(4)}, {state.geographicPoint.longitude.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};

