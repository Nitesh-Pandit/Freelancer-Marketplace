import React, { useState } from 'react';
import './RatingForm.css';

function RatingForm({ order, user, token, onBack }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          rating,
          review: review.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Submit rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get freelancer name
  const freelancerName = typeof order.freelancerId === 'object'
    ? order.freelancerId.name
    : order.freelancerName;

  if (success) {
    return (
      <div className="rating-form">
        <div className="rating-success">
          <div className="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>Your rating has been submitted successfully.</p>
          <p className="success-message">We appreciate your feedback for {freelancerName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rating-form">
      <div className="rating-container">
        <h2>Rate {freelancerName}</h2>
        <p className="gig-info">{order.gigTitle}</p>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button className="error-close" onClick={() => setError('')}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmitRating}>
          {/* RATING STARS */}
          <div className="rating-stars-section">
            <p className="section-label">How was your experience with this freelancer?</p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-text">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* REVIEW TEXT */}
          <div className="review-section">
            <label htmlFor="review">Share your feedback (optional)</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell other clients about your experience..."
              maxLength={500}
              rows={4}
              className="review-textarea"
            />
            <p className="char-count">
              {review.length}/500
            </p>
          </div>

          {/* BUTTONS */}
          <div className="rating-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onBack}
              disabled={loading}
            >
              Skip
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!rating || loading}
            >
              {loading ? '⏳ Submitting...' : '✓ Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RatingForm;
