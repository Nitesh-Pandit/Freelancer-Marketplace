import React, { useState, useEffect } from 'react';
import './GigDetail.css';

function GigDetail({ gigId, onClose, user, token, onOrderCreatedzz }) {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hireLoading, setHireLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [ratingData, setRatingData] = useState({
  averageRating: 0,
  totalRatings: 0,
});
  useEffect(() => {
    fetchGigDetails();
  }, [gigId]);


  const fetchGigDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`);
      const data = await response.json();

      if (response.ok) {
        setGig(data.gig);
        fetchFreelancerRating(data.gig.userId);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch gig details');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Fetch gig error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHireFreelancer = async () => {
    if (!gig || !token) return;

    setHireLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gigId: gig._id,
        }),
      });

      // Check if response is valid JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If response is not JSON, read as text
        const text = await response.text();
        console.error('Invalid response format:', text);
        setError('Server returned invalid response. Please check server logs.');
        setHireLoading(false);
        return;
      }

      if (response.ok) {
        setOrderCreated(true);
        // Call parent callback to refresh orders list
        if (onOrderCreated) {
          onOrderCreated(data.order);
        }
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Hire error:', err);
    } finally {
      setHireLoading(false);
    }
  };

  const fetchFreelancerRating = async (freelancerId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/ratings/freelancer/${freelancerId}`);
    const data = await res.json();

    if (res.ok) {
      setRatingData({
        averageRating: data.averageRating,
        totalRatings: data.totalRatings,
      });
    }
  } catch (err) {
    console.error("Rating fetch error:", err);
  }
};

  if (loading) {
    return (
      <div className="gig-detail-overlay" onClick={onClose}>
        <div className="gig-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading gig details...</p>
          </div>
        </div>
      </div>
    );
  }

  if ((error && !gig) || !gig) {
    return (
      <div className="gig-detail-overlay" onClick={onClose}>
        <div className="gig-detail-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Error Loading Gig</h2>
            <p>{error || 'Gig not found'}</p>
            <button className="back-btn" onClick={onClose}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="gig-detail-overlay" onClick={onClose}>
        <div className="gig-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Order Created Successfully!</h2>
            <p>You have successfully hired {gig.freelancerName}</p>
            <p className="success-subtext">The freelancer will be notified about your order.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gig-detail-overlay" onClick={onClose}>
      <div className="gig-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="gig-detail-content">
          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError('')}>✕</button>
            </div>
          )}

          {/* HEADER */}
          <div className="detail-header">
            <div className="detail-title-section">
              <h1 className="detail-title">{gig.title}</h1>
              <p className="detail-price">${gig.price.toFixed(2)}</p>
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Posted</span>
                <span className="meta-value">
                  {new Date(gig.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* FREELANCER CARD */}
          <div className="freelancer-card">
            <div className="freelancer-avatar-large">
              {gig.freelancerName.charAt(0).toUpperCase()}
            </div>
            <div className="freelancer-details">
              <h2 className="freelancer-name">{gig.freelancerName}</h2>
              <div className="freelancer-stats">
                <div className="stat">
  <span className="stat-value">
    ⭐ {ratingData.averageRating || 0}
  </span>
  <span className="stat-label">
    {ratingData.totalRatings} Reviews
  </span>
</div>
                <div className="stat">
                  <span className="stat-value">✓</span>
                  <span className="stat-label">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="detail-section">
            <h3 className="section-title">About this Gig</h3>
            <p className="detail-description">{gig.description}</p>
          </div>

          {/* WHAT'S INCLUDED */}
          <div className="detail-section">
            <h3 className="section-title">What's Included</h3>
            <ul className="included-list">
              <li>Professional service</li>
              <li>Quality deliverables</li>
              <li>Timely completion</li>
              <li>Ongoing support</li>
            </ul>
          </div>

          {/* PRICING INFO */}
          <div className="detail-section">
            <h3 className="section-title">Pricing</h3>
            <div className="pricing-box">
              <div className="pricing-row">
                <span className="pricing-label">Service Price:</span>
                <span className="pricing-value">${gig.price.toFixed(2)}</span>
              </div>
              <div className="pricing-divider"></div>
              <div className="pricing-row total">
                <span className="pricing-label">Total:</span>
                <span className="pricing-value">${gig.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {user && user.role === 'client' ? (
            <div className="detail-actions">
              <button
                className="hire-btn"
                onClick={handleHireFreelancer}
                disabled={hireLoading}
              >
                {hireLoading ? '⏳ Hiring...' : '✓ Hire Freelancer'}
              </button>
              <button className="secondary-btn" onClick={onClose} disabled={hireLoading}>
                Close
              </button>
            </div>
          ) : (
            <div className="detail-actions">
              <button className="secondary-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GigDetail;
