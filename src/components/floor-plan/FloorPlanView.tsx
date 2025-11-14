import React, { useCallback, useRef, useState } from 'react';
import { useMarkerActions } from '@/hooks/useMarkerActions';
import { useAppState } from '@/context/StateContext';
import { DynamicFloorPlanMarkers } from './DynamicFloorPlanMarkers';
import './FloorPlanView.css';

/**
 * Spatial Floor Plan View Component
 * Displays a static floor plan image and allows placing markers via clicks
 */
export const FloorPlanView: React.FC = () => {
  const { state } = useAppState();
  const { addFloorPlanMarker } = useMarkerActions();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [floorPlanImage, setFloorPlanImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleFloorPlanClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const currentGeographicPoint = state.geographicPoint;
      if (!currentGeographicPoint || !canvasRef.current) {
        alert('Please select a geographic location first on the map.');
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate relative coordinates (0-1 range)
      const relativeX = x / rect.width;
      const relativeY = y / rect.height;

      // Use relative coordinates for consistency across zoom levels
      addFloorPlanMarker(relativeX, relativeY, `Feature at (${Math.round(x)}, ${Math.round(y)})`);
    },
    [state.geographicPoint, addFloorPlanMarker]
  );

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFloorPlanImage(result);
        setImageError(false);
      };
      reader.onerror = () => {
        setImageError(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Create a simple placeholder if image doesn't exist
  const renderPlaceholder = () => (
    <div className="floor-plan-placeholder">
      <div className="placeholder-content">
        {imageError ? (
          <div className="image-error">
            <p>Failed to load image. Please try again.</p>
            <label className="upload-btn">
              Upload Floor Plan Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox="0 0 800 600">
              <rect width="800" height="600" fill="#f5f5f5" stroke="#ddd" strokeWidth="2" />
              <text x="400" y="280" textAnchor="middle" fill="#999" fontSize="24" fontFamily="Arial">
                Floor Plan Image
              </text>
              <text x="400" y="310" textAnchor="middle" fill="#999" fontSize="16" fontFamily="Arial">
                Click to place markers
              </text>
              <text x="400" y="340" textAnchor="middle" fill="#666" fontSize="14" fontFamily="Arial">
                Or upload your own floor plan image
              </text>
              {/* Draw some sample room outlines */}
              <rect x="100" y="100" width="200" height="150" fill="none" stroke="#ccc" strokeWidth="2" />
              <rect x="350" y="100" width="200" height="150" fill="none" stroke="#ccc" strokeWidth="2" />
              <rect x="500" y="300" width="200" height="200" fill="none" stroke="#ccc" strokeWidth="2" />
            </svg>
            <label className="upload-btn">
              Upload Floor Plan Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );

  const isEnabled = !!state.geographicPoint;

  return (
    <div className="floor-plan-view">
      {!isEnabled && (
        <div className="floor-plan-disabled">
          <p>Please select a geographic location on the map first to enable the floor plan editor.</p>
        </div>
      )}
      <div
        ref={canvasRef}
        className={`floor-plan-canvas ${!isEnabled ? 'disabled' : ''}`}
        onClick={handleFloorPlanClick}
      >
        {floorPlanImage ? (
          <img
            src={floorPlanImage}
            alt="Floor Plan"
            className="floor-plan-image"
            onError={() => setImageError(true)}
          />
        ) : (
          renderPlaceholder()
        )}
        {isEnabled && (
          <div className="image-upload-controls">
            <label className="upload-btn-small">
              {floorPlanImage ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            {floorPlanImage && (
              <button
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFloorPlanImage(null);
                  setImageError(false);
                }}
                title="Remove image"
              >
                ×
              </button>
            )}
          </div>
        )}
        <DynamicFloorPlanMarkers containerRef={canvasRef} />
      </div>
    </div>
  );
};

