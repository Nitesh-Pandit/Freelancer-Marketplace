import React, { useState, useEffect } from 'react';
import CreateGigModal from './CreateGigModal';
import GigCard from './GigCard';
import EditGigModal from './EditGigModal';
import './MyGigs.css';

function MyGigs({ user, token }) {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGig, setEditingGig] = useState(null);

  useEffect(() => {
    fetchFreelancerGigs();
  }, [token]);

  const fetchFreelancerGigs = async () => {
    try {
      const response = await fetch('https://freelancer-marketplace-1.onrender.com/api/gigs/freelancer/my-gigs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGigs(data.gigs);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch gigs');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Fetch gigs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGigCreated = () => {
    fetchFreelancerGigs();
  };

  const handleGigDeleted = (gigId) => {
    setGigs(gigs.filter(gig => gig._id !== gigId));
  };

  const handleEditClick = (gig) => {
    setEditingGig(gig);
    setShowEditModal(true);
  };

  const handleGigUpdated = () => {
    setShowEditModal(false);
    setEditingGig(null);
    fetchFreelancerGigs();
  };

  return (
    <div className="my-gigs-container">
      <div className="my-gigs-header">
        <div className="header-content">
          <h1>My Gigs</h1>
          <p>Manage your services and attract clients</p>
        </div>
        <button
          className="create-gig-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="btn-icon">+</span>
          <span className="btn-text">Create New Gig</span>
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your gigs...</p>
        </div>
      ) : (
        <>
          {gigs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No Gigs Yet</h2>
              <p>Create your first gig to start attracting clients</p>
              <button
                className="create-gig-btn empty-state-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="btn-icon">+</span>
                <span className="btn-text">Create Your First Gig</span>
              </button>
            </div>
          ) : (
            <div className="gigs-grid">
              {gigs.map((gig) => (
                <GigCard
                  key={gig._id}
                  gig={{
                    ...gig,
                    id: gig._id,
                  }}
                  isOwner={true}
                  onEdit={handleEditClick}
                  onDelete={handleGigDeleted}
                  token={token}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <CreateGigModal
          onClose={() => setShowCreateModal(false)}
          onGigCreated={handleGigCreated}
          token={token}
        />
      )}

      {showEditModal && editingGig && (
        <EditGigModal
          gig={editingGig}
          onClose={() => {
            setShowEditModal(false);
            setEditingGig(null);
          }}
          onGigUpdated={handleGigUpdated}
          token={token}
        />
      )}
    </div>
  );
}

export default MyGigs;
