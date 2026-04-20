import React, { useState } from 'react';
import './Signup.css';

function Signup({ onClose, onLoginClick }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error || 'Signup failed');
        return;
      }

      // Success
      setLoading(false);
      setSuccess(data.message);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        onLoginClick();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left signup-left">
          <div className="auth-left-content">
            <h2>Join Us Today</h2>
            <p>Sign up as a Freelancer or Client and start your journey</p>
            <div className="illustration">🚀</div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-right">
          <div className="form-container">
            <div className="form-header">
              <h3>Create Account</h3>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* NAME FIELD */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* EMAIL FIELD */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD FIELD */}
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* ROLE SELECTION */}
              <div className="form-group role-selection">
                <label>I am a:</label>
                <div className="role-options">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="freelancer"
                      checked={role === 'freelancer'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="role-label">Freelancer</span>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      checked={role === 'client'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="role-label">Client</span>
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="auth-footer">
              <p>Already have an account? 
                <button 
                  type="button"
                  className="link-btn"
                  onClick={onLoginClick}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
