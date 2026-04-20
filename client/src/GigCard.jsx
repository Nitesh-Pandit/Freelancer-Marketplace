import React, { useState } from 'react';
import './GigCard.css';

function GigCard({ gig, isOwner, onEdit, onDelete, token }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${gig.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(gig.id);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setDeleting(false);
  };

  return (
    <div className="gig-card">
      <div className="gig-header">
        <div className="gig-info">
          <h3 className="gig-title">{gig.title}</h3>
          <p className="gig-freelancer">👤 {gig.freelancerName}</p>
        </div>
        {isOwner && (
          <div className="gig-actions">
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(gig)}
              title="Edit gig"
            >
              ✎ Edit
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete gig"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      <p className="gig-description">{gig.description}</p>

      <div className="gig-footer">
        <div className="gig-price">
          <span className="price-label">Price</span>
          <span className="price-value">${gig.price.toFixed(2)}</span>
        </div>
        <div className="gig-date">
          {new Date(gig.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Gig?</h3>
            <p>Are you sure you want to delete "{gig.title}"? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn delete-confirm-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GigCard;
