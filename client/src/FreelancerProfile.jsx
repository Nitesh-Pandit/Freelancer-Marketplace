import React, { useState, useEffect } from 'react';
import './FreelancerProfile.css';
console.log("FreelancerProfile loaded");
function FreelancerProfile({ user, token }) {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  console.log("useEffect triggered", user);

  if (user && user.id) {
    fetchFreelancerRatings();
  }
}, [user]);

const fetchFreelancerRatings = async () => {
  if (!user || !user.id) return;

  console.log("Fetching ratings for:", user.id);

  try {
    const response = await fetch(
      `http://localhost:5000/api/ratings/freelancer/${user.id}`
    );

    const data = await response.json();

    console.log("API RESPONSE:", data);

    setRatings(data.ratings || []);
    setAverageRating(Number(data.averageRating) || 0);
    setTotalRatings(data.totalRatings || 0);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="freelancer-profile">z
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="freelancer-profile">
      <div className="profile-container">
        {/* RATING SUMMARY */}
        <div className="rating-summary">
          <div className="rating-header">
            <h2>Your Ratings</h2>
            <p className="subtitle">Client feedback and reviews</p>
          </div>

          <div className="rating-stats">
            <div className="stat-card">
              <div className="stat-value">
                {averageRating.toFixed(1)}
              </div>
              <div className="stat-label">Average Rating</div>
              <div className="stars-large">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {totalRatings}
              </div>
              <div className="stat-label">Total Ratings</div>
            </div>
          </div>
        </div>

        {/* RATINGS LIST */}
        {totalRatings === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h3>No Ratings Yet</h3>
            <p>Complete orders and get ratings from satisfied clients!</p>
          </div>
        ) : (
          <div className="ratings-list">
            <h3>Client Feedback</h3>
            {ratings.map((rating, index) => (
              <div key={rating._id || index} className="rating-item">
                <div className="rating-header-item">
                  <div className="rater-info">
                    <div className="rater-avatar">
                      {rating.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="rater-details">
                      <p className="rater-name">{rating.clientName}</p>
                      <p className="gig-title">{rating.gigTitle}</p>
                    </div>
                  </div>
                  <div className="rating-date">
                    {new Date(rating.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="rating-body">
                  <div className="rating-stars">
                    {renderStars(rating.rating)}
                    <span className="rating-value">{rating.rating}/5</span>
                  </div>

                  {rating.review && (
                    <p className="review-text">{rating.review}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelancerProfile;
