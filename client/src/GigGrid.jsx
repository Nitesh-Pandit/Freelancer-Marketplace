import './GigGrid.css';
import React, { useEffect, useState } from 'react';
function GigGrid({ gigs, onGigClick }) {
  const [ratings, setRatings] = useState({});
  useEffect(() => {
  const fetchRatings = async () => {
    let ratingsMap = {};

    for (let gig of gigs) {
      try {
        const res = await fetch(
          `https://freelancer-marketplace-1.onrender.com/api/ratings/freelancer/${gig.userId}`
        );
        const data = await res.json();

        if (res.ok) {
          ratingsMap[gig._id] = {
            avg: Number(data.averageRating),
            count: data.totalRatings,
          };
        }
      } catch (err) {
        console.error("Rating fetch error:", err);
      }
    }

    setRatings(ratingsMap);
  };

  if (gigs.length > 0) {
    fetchRatings();
  }
}, [gigs]);
  return (
    <div className="gig-grid-wrapper">
      <div className="gig-grid">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="gig-grid-card"
            onClick={() => onGigClick(gig)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onGigClick(gig);
              }
            }}
          >
            <div className="gig-card-header">
              <div className="freelancer-avatar">
                {gig.freelancerName.charAt(0).toUpperCase()}
              </div>
              <div className="freelancer-info">
                <h3 className="gig-card-title">{gig.title}</h3>
                {/* <p className="gig-card-freelancer">{gig.freelancerName}</p> */}
                <p className="gig-card-freelancer">{gig.freelancerName}</p>

{/* ⭐ ADD THIS */}
<div className="gig-rating">
  ⭐ {ratings[gig._id]?.avg || 0}
  <span>({ratings[gig._id]?.count || 0})</span>
</div>
              </div>
            </div>

            <p className="gig-card-description">{gig.description}</p>

            <div className="gig-card-footer">
              <div className="gig-card-price">
                <span className="price-label">Starting at</span>
                <span className="price-value">${gig.price.toFixed(2)}</span>
              </div>
              <button
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onGigClick(gig);
                }}
              >
                View Details →
              </button>
            </div>

            <div className="gig-card-date">
              {new Date(gig.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GigGrid;
