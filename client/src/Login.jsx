import React, { useState } from 'react';
import './Login.css';

function Login({ onClose, onSignupClick, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      // Call login API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error || 'Login failed');
        return;
      }

      // Success - save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
      
      // Call parent callback to update app state
      onLoginSuccess(data.user, data.token);
      console.log(data.token);
      
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left login-left">
          <div className="auth-left-content">
            <h2>Welcome Back</h2>
            <p>Sign in to your account and start finding amazing projects</p>
            <div className="illustration">👋</div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-right">
          <div className="form-container">
            <div className="form-header">
              <h3>Login</h3>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
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

              {/* FORGOT PASSWORD */}
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* SIGNUP LINK */}
            <div className="auth-footer">
              <p>Don't have an account? 
                <button 
                  type="button"
                  className="link-btn"
                  onClick={onSignupClick}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
