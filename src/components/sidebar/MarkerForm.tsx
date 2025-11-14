import React, { useState } from 'react';
import { useMarkerActions } from '@/hooks/useMarkerActions';
import { useAppState } from '@/context/StateContext';
import './MarkerForm.css';

/**
 * Marker Form Component
 * Allows editing selected marker properties
 */
export const MarkerForm: React.FC = () => {
  const { selectedMarkerId, markers, updateMarker } = useMarkerActions();
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId);

  React.useEffect(() => {
    if (selectedMarker) {
      setLabel(selectedMarker.label);
      setDescription(selectedMarker.description || '');
    } else {
      setLabel('');
      setDescription('');
    }
  }, [selectedMarker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMarkerId && label.trim()) {
      updateMarker(selectedMarkerId, {
        label: label.trim(),
        description: description.trim() || undefined,
      });
    }
  };

  if (!selectedMarker) {
    return (
      <div className="marker-form">
        <h3>Edit Marker</h3>
        <p className="form-hint">Select a marker to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="marker-form">
      <h3>Edit Marker</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="marker-label">Label *</label>
          <input
            id="marker-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            placeholder="Enter marker label"
          />
        </div>
        <div className="form-group">
          <label htmlFor="marker-description">Description</label>
          <textarea
            id="marker-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter marker description (optional)"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <div className="type-badge">{selectedMarker.type}</div>
        </div>
        {selectedMarker.type === 'geographic' && selectedMarker.position.lat && (
          <div className="form-group">
            <label>Coordinates</label>
            <div className="coordinates">
              Lat: {selectedMarker.position.lat.toFixed(6)}
              <br />
              Lng: {selectedMarker.position.lng?.toFixed(6)}
            </div>
          </div>
        )}
        {selectedMarker.type === 'floor-plan' &&
          selectedMarker.position.x !== undefined &&
          selectedMarker.position.y !== undefined && (
            <div className="form-group">
              <label>Position</label>
              <div className="coordinates">
                X: {Math.round(selectedMarker.position.x * 100)}%
                <br />
                Y: {Math.round(selectedMarker.position.y * 100)}%
              </div>
            </div>
          )}
        <button type="submit" className="submit-btn">
          Update Marker
        </button>
      </form>
    </div>
  );
};

