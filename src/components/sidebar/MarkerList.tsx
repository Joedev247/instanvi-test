import React, { useState } from 'react';
import { useMarkerActions } from '@/hooks/useMarkerActions';
import { useAppState } from '@/context/StateContext';
import { ConfirmModal } from '../common/ConfirmModal';
import './MarkerList.css';

/**
 * Marker List Component
 * Displays all markers and allows selection/deletion
 */
export const MarkerList: React.FC = () => {
  const { markers, selectedMarkerId, selectMarker, deleteMarker } = useMarkerActions();
  const { geographicPoint } = useAppState();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; markerId: string | null }>({
    isOpen: false,
    markerId: null,
  });

  const geographicMarkers = markers.filter((m) => m.type === 'geographic');
  const floorPlanMarkers = markers.filter((m) => m.type === 'floor-plan');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, markerId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.markerId) {
      deleteMarker(deleteConfirm.markerId);
      setDeleteConfirm({ isOpen: false, markerId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, markerId: null });
  };

  return (
    <div className="marker-list">
      <h3>Markers ({markers.length})</h3>

      {!geographicPoint && (
        <div className="info-message">
          Select a location on the map to enable floor plan editing.
        </div>
      )}

      {geographicMarkers.length > 0 && (
        <div className="marker-section">
          <h4>Geographic Markers ({geographicMarkers.length})</h4>
          <ul>
            {geographicMarkers.map((marker) => (
              <li
                key={marker.id}
                className={selectedMarkerId === marker.id ? 'selected' : ''}
                onClick={() => selectMarker(marker.id)}
              >
                <div className="marker-item">
                  <span className="marker-label">{marker.label}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, marker.id)}
                    title="Delete marker"
                  >
                    ×
                  </button>
                </div>
                {marker.position.lat && marker.position.lng && (
                  <small>
                    {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
                  </small>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {floorPlanMarkers.length > 0 && (
        <div className="marker-section">
          <h4>Floor Plan Markers ({floorPlanMarkers.length})</h4>
          <ul>
            {floorPlanMarkers.map((marker) => (
              <li
                key={marker.id}
                className={selectedMarkerId === marker.id ? 'selected' : ''}
                onClick={() => selectMarker(marker.id)}
              >
                <div className="marker-item">
                  <span className="marker-label">{marker.label}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, marker.id)}
                    title="Delete marker"
                  >
                    ×
                  </button>
                </div>
                {marker.position.x !== undefined && marker.position.y !== undefined && (
                  <small>
                    Position: ({Math.round(marker.position.x * 100)}%,{' '}
                    {Math.round(marker.position.y * 100)}%)
                  </small>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {markers.length === 0 && (
        <div className="empty-state">
          <p>No markers yet. Click on the map or floor plan to add markers.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Marker"
        message="Are you sure you want to delete this marker? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="red"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

