import React from 'react';
import './LandingPage.css';

function LandingPage({ onLoginClick, onSignupClick }) {
  return (
    <div className="landing-page">
      {/* HEADER SECTION */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>FreelancePro</h1>
          </div>
          <nav className="nav-buttons">
            <button className="btn btn-login" onClick={onLoginClick}>Login</button>
            <button className="btn btn-signup" onClick={onSignupClick}>Sign Up</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find the right freelancer for your work</h1>
          <p className="hero-subtitle">Hire developers, designers, and more</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onSignupClick}>Hire Freelancer</button>
            <button className="btn btn-secondary" onClick={onSignupClick}>Start Selling</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        
        <div className="steps-container">
          {/* CLIENT STEPS */}
          <div className="steps-group">
            <h3>For Clients</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Search Gigs</h4>
                <p>Browse professionals and find the perfect match</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Hire Freelancer</h4>
                <p>Connect and discuss your project requirements</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Get Work Done</h4>
                <p>Receive quality work on time</p>
              </div>
            </div>
          </div>

          {/* FREELANCER STEPS */}
          <div className="steps-group">
            <h3>For Freelancers</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Create Profile</h4>
                <p>Showcase your skills and experience</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Add Gig</h4>
                <p>Offer services at your own rates</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Get Hired</h4>
                <p>Earn by completing projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure Communication</h4>
            <p>Safe messaging system for client and freelancer engagement</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Easy Hiring</h4>
            <p>Simple and quick process to find and hire professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h4>Fast Delivery</h4>
            <p>Quality work delivered on time, every time</p>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h5>About Us</h5>
            <p>Connecting talented professionals with businesses worldwide</p>
          </div>
          <div className="footer-section">
            <h5>Contact</h5>
            <p>Email: hello@freelancepro.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h5>Links</h5>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 FreelancePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
