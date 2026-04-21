import React, { useState } from 'react';
import './CreateGigModal.css';

function CreateGigModal({ onClose, onGigCreated, token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title || !description || !price) {
      setError('All fields are required');
      return;
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }

    if (price < 1) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gigs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error || 'Failed to create gig');
        return;
      }

      setLoading(false);
      setSuccess('Gig created successfully!');

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');

      // Close modal and refresh gigs
      setTimeout(() => {
        onGigCreated();
        onClose();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
      console.error('Create gig error:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Gig</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Gig Title *</label>
            <input
              type="text"
              id="title"
              placeholder="e.g., Build a React Website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              maxLength="100"
            />
            <span className="char-count">{title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Describe what you offer, what's included, and why clients should choose you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="6"
              maxLength="1000"
            />
            <span className="char-count">{description.length}/1000</span>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <div className="price-input-wrapper">
              <span className="currency">$</span>
              <input
                type="number"
                id="price"
                placeholder="Enter your price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-input"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Gig...' : 'Create Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGigModal;
