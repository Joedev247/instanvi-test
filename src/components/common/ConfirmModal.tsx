import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'red' | 'blue' | 'green';
}

/**
 * Custom Confirmation Modal Component
 * Displays a centered popup with confirmation dialog
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonColor = 'red',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button
              className={`modal-btn modal-btn-cancel`}
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`modal-btn modal-btn-confirm modal-btn-${confirmButtonColor}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

