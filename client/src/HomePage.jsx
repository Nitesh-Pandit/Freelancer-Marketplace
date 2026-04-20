import React, { useState, useEffect } from 'react';
import MyGigs from './MyGigs';
import AllGigs from './AllGigs';
import GigDetail from './GigDetail';
import FreelancerOrders from './FreelancerOrders';
import ClientOrders from './ClientOrders';
import FreelancerProfile from './FreelancerProfile';
import './HomePage.css';

function HomePage({ user, onLogout, token }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedGig, setSelectedGig] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Check if this is first login
    const hasVisitedBefore = localStorage.getItem(`user_visited_${user._id}`);
    if (!hasVisitedBefore) {
      setIsFirstLogin(true);
      localStorage.setItem(`user_visited_${user._id}`, 'true');
    }
  }, [user._id]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleGigClick = (gig) => {
    setSelectedGig(gig);
  };

  const handleCloseGigDetail = () => {
    setSelectedGig(null);
  };

  return (
    <div className="home-page">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo">
            <h1>🚀 FreelancePro</h1>
          </div>
          <div className="user-info">
            <span className="welcome-text">
              {isFirstLogin ? '👋 Welcome, ' : 'Welcome back, '}
              <strong>{user.name}</strong>!
            </span>
            <span className="role-badge">{user.role === 'freelancer' ? '💼 Freelancer' : '🏢 Client'}</span>
            <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="home-main">
        {user.role === 'freelancer' && (
          <>
            {/* NAVIGATION TABS */}
            <nav className="nav-tabs">
              <button
                className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                📊 Dashboard
              </button>
              <button
                className={`nav-tab ${currentView === 'gigs' ? 'active' : ''}`}
                onClick={() => setCurrentView('gigs')}
              >
                💼 My Gigs
              </button>
              <button
                className={`nav-tab ${currentView === 'profile' ? 'active' : ''}`}
                onClick={() => setCurrentView('profile')}
              >
                ⭐ Ratings & Profile
              </button>
              <button
                className={`nav-tab ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('orders')}
              >
                📦 Orders
              </button>
            </nav>
          </>
        )}

        {user.role === 'client' && (
          <>
            {/* CLIENT NAVIGATION TABS */}
            <nav className="nav-tabs">
              <button
                className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                📊 Dashboard
              </button>
              <button
                className={`nav-tab ${currentView === 'browse' ? 'active' : ''}`}
                onClick={() => setCurrentView('browse')}
              >
                🔍 Browse Gigs
              </button>
              <button
                className={`nav-tab ${currentView === 'my-orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('my-orders')}
              >
                👔 My Hires
              </button>
            </nav>
          </>
        )}

        {currentView === 'dashboard' ? (
          <div className="dashboard">
            <div className="welcome-section">
              {isFirstLogin ? (
                <>
                  <h2>✨ Welcome to FreelancePro!</h2>
                  <p>Excited to have you on board! Get started by exploring our platform and completing your profile.</p>
                </>
              ) : (
                <>
                  <h2>Welcome back, {user.name}! 👋</h2>
                  <p>Continue building your success story with FreelancePro.</p>
                </>
              )}
            </div>

            <div className="dashboard-grid">
              {user.role === 'freelancer' ? (
                <>
                  <div className="card" onClick={() => setCurrentView('gigs')}>
                    <div className="card-icon">📋</div>
                    <h3>My Gigs</h3>
                    <p>Manage and create your service listings</p>
                    <button className="card-btn" onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView('gigs');
                    }}>
                      View Gigs
                    </button>
                  </div>
                  <div className="card">
                    <div className="card-icon">💰</div>
                    <h3>Earnings</h3>
                    <p>Track your income and payments</p>
                    <button className="card-btn">View Earnings</button>
                  </div>
                  <div className="card">
                    <div className="card-icon">⭐</div>
                    <h3>Reviews</h3>
                    <p>Check client feedback and ratings</p>
                    <button className="card-btn">View Reviews</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="card" onClick={() => setCurrentView('browse')}>
                    <div className="card-icon">🔍</div>
                    <h3>Find Freelancers</h3>
                    <p>Browse and hire talented professionals</p>
                    <button className="card-btn" onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView('browse');
                    }}>
                      Browse
                    </button>
                  </div>
                  <div className="card">
                    <div className="card-icon">📦</div>
                    <h3>My Projects</h3>
                    <p>Manage your active projects</p>
                    <button className="card-btn">View Projects</button>
                  </div>
                  <div className="card">
                    <div className="card-icon">💵</div>
                    <h3>Payments</h3>
                    <p>Manage billing and invoices</p>
                    <button className="card-btn">View Payments</button>
                  </div>
                </>
              )}
            </div>

            <div className="info-box">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name:</label>
                  <span>{user.name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Role:</label>
                  <span className="role-text">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'gigs' ? (
          <MyGigs user={user} token={token} />
        ) : currentView === 'orders' ? (
          <FreelancerOrders user={user} token={token} />
        ) : currentView === 'browse' ? (
          <>
            <AllGigs onGigClick={handleGigClick} />
            {selectedGig && (
              <GigDetail
                gigId={selectedGig._id}
                onClose={handleCloseGigDetail}
                user={user}
                token={token}
                onOrderCreated={() => handleCloseGigDetail()}
              />
            )}
          </>
        ) : currentView === 'my-orders' ? (
          <ClientOrders user={user} token={token} />
        ) : currentView === 'profile' ? (
          <FreelancerProfile user={user} token={token} />
        ) : null}
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">👋</div>
            <h3>Are you sure you want to logout?</h3>
            <p>You will be signed out of your account.</p>
            <div className="logout-modal-buttons">
              <button
                className="logout-modal-btn cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="logout-modal-btn confirm-btn"
                onClick={handleConfirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
